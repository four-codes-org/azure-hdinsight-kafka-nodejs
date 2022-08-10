const { Kafka } = require("kafkajs");

async function run() {
  const kafka = new Kafka({ brokers: ["localhost:9092"] });

  const producer = kafka.producer();
  await producer.connect();
  let data = {
      requestId: "345",
      callbackId: "xx"
  };
  await producer.send({
    topic: "Error",
    messages: [{ value: JSON.stringify(data) }],
  });
}

run().then(
  () => console.log("Done"),
  (err) => console.log(err)
);
