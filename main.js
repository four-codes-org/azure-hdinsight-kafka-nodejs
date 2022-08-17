const express = require("express");
const { Kafka } = require("kafkajs");
const topicsData = require("./custom/topicsData");
const topicReader = new topicsData();
const topicLookupFromList = require("./custom/topicLookupFromList");

let KAFKA_HOST = ["localhost:9092"]; 

// let KAFKA_HOST = ["10.42.60.199:9092","10.42.60.203:9092","10.42.60.200:9092"];

var topicList = [
  "CBPR_Validator_Ingress",
  "MX2MT_Transformer_Ingress",
  "MT_Builder_Ingress",
  "Error",
  "MX_Response_Builder_Ingress",
  "MT2MX_Transformer_Ingress",
  "MX_Validator_Ingress",
  "MT_Validator_Ingress",
  "MT_Response_Builder_Ingress",
  "MT_Ingestor_Ingress",
  "ISOConvertor_Response",
  "MX_Builder_Ingress",
  "ISOConvertor_MT2MX_Response",
  "Error_Mx2Mt",
  "Error_Mt2Mx",
  "consolidator_topic"
];

const app = express();
app.use(express.json());

const kafkaTopic = async (topic) => {
  const kafka = new Kafka({ brokers: KAFKA_HOST });
  const consumer = kafka.consumer({ groupId: topic + Date.now() });
  await consumer.connect();
  await consumer.subscribe({ topic: topic, fromBeginning: true });
  await consumer.run({
    eachMessage: async (data) => {
      var topicData = data.message.value.toString();
      topicReader.setMessages(data.topic, data.message.offset, topicData);
    },
  });
};

app.get("/kafka", async (req, res) => {
  res.json({
    State: "Running",
    Path: [
      "/kafka",
      "/kafka/topics",
      "/kafka/topic/[topicName]",
      "/kafka/topic/[topicName]/[requestId]",
    ],
    Status: 200,
  });
});

app.get("/kafka/topics/", (req, res) => {
  res.json(topicReader);
});

app.get("/kafka/topic/:topic/", (req, res) => {
  let topic = req.params.topic;
  let pathRouteTopic = topicLookupFromList(topicList, topic);
  if (pathRouteTopic === undefined)
    res.json({ status: "topic not found", statusCode: 404 });
  else res.json(topicReader[topic]);
});

app.get("/kafka/topic/:topic/:requestId", (req, res) => {
  let topic = req.params.topic;
  let requestId = req.params.requestId;
  let pathRouteTopic = topicLookupFromList(topicList, topic);
  if (pathRouteTopic === undefined) {
    res.json({ status: "topic not found", statusCode: 404 });
  } else {
    let dataScrap = topicReader[topic];
    if (topic == undefined && requestId == undefined) {
      res.send({ statusCode: 404, message: "Bad request" });
    } else {
      res.json(topicReader.getMessages(dataScrap, requestId));
    }
  }
});

app.listen(9000, () => {
  topicList.forEach((tp) => {
    kafkaTopic(tp);
  });
});
