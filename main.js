const express = require("express");
const { Kafka } = require("kafkajs");
const topicsData = require("./custom/topicsData");
const topicReader = new topicsData();
const topicLookupFromList = require("./custom/topicLookupFromList");
const res = require("express/lib/response");
const Model = require('./models/model');
const mongoose = require('mongoose');
const mongoString = process.env.DATABASE_URL;

mongoose.connect(mongoString);
const database = mongoose.connection;

database.on('error', (error) => {
    console.log(error)
})

database.once('connected', () => {
    console.log('Database Connected');
})

// let KAFKA_HOST = ["localhost:9092"];

let KAFKA_HOST = ["10.42.60.199:9092","10.42.60.203:9092","10.42.60.200:9092"];

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
  "consolidator_topic",
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
      "/kafka/topic/[topicName]/[requestId]/[messageTrackingId]",
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

app.get("/kafka/topic/:topic/:requestId/:messageTrackingId", (req, res) => {
  let topic = req.params.topic;
  let requestId = req.params.requestId;
  let messageTrackingId = req.params.messageTrackingId;
  let pathRouteTopic = topicLookupFromList(topicList, topic);
  if (pathRouteTopic === undefined) {
    res.json({ status: "topic not found", statusCode: 404 });
  } else {
    let dataScrap = topicReader[topic];
    if ( topic == undefined && requestId == undefined && messageTrackingId == undefined ) {
      res.send({ statusCode: 404, message: "Bad request" });
    } else {
      
      if (topic === "ISOConvertor_Response" || topic === "ISOConvertor_MT2MX_Response" || topic === "MT_Ingestor_Ingress" ) {
        if (topic === "MT_Ingestor_Ingress" ) {
          res.json(topicReader.getMessagesWithTrackingId(dataScrap,requestId,messageTrackingId));
        } else {
        res.json(topicReader.getMessagesWithMessageTrackingId(dataScrap,requestId,messageTrackingId));
        }
      } else {
        res.json({
          messages: "this topic not supported to filter messageTrackingId",
        });
      }
    }
  }
});


app.post('/kafka/message/post/', async (req, res) => {
    const data = new Model({
        messageId: req.body.messageId,
        fileName: req.body.fileName
    })
    try {
        const dataToSave = await data.save();
        res.status(200).json(dataToSave)
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
})

app.post('/kafka/message/post/', async (req, res) => {
    const data = new Model({
        messageId: req.body.messageId,
        fileName: req.body.fileName
    })
    try {
        const dataToSave = await data.save();
        res.status(200).json(dataToSave)
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
})

app.get('/kafka/messages/', async (req, res) => {
    try {
        const data = await Model.find();
        res.json(data)
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
})

app.get('/kafka/message/:id', async (req, res) => {
    try {
        const data = await Model.findById(req.params.id);
        res.json(data)
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
})

app.listen(9000, () => {
  topicList.forEach((tp) => {
    kafkaTopic(tp);
  });
});


