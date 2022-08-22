const { Kafka } = require("kafkajs");

async function run() {
  const kafka = new Kafka({ brokers: ["localhost:9092"] });

  const producer = kafka.producer();
  await producer.connect();
  let data = {
    statusCode: "SUCCESS",
    statusMessage: "Payload processing status SUCCESS: 1 ERROR: 0",
    requestId: "MX2MT_Pac008_Aug18_002",
    trackingInfo: [
      {
        payload: {
          messageType: "PAC008",
          message:
            '{"1":"ABCDUS33XXX","2":"EFGHUS33XXX","3":{"121":"5ddd156bba52-4d7da7ea-197cf311dc19","113":"NORM"}}{4:\n:13C: /CLSTIME/2100+00:00\n:20: 823823423\n:32A: 221209EUR123.45\n:33B: USD5000\n:36: 0.45\n:50K: \nJhon Doe\nHS 1 Foo Street 3454 Manila CABA AR\n:52D: \nFoo Corp\n 10 Foo Street 1234 Colombo CABA AR\n:53D: NL91ABNA0417164300\n260-C North El Camino. Real. Encinit\nas. CA 92024-2333\n:54A: ICBCUS4CXXX\nIT60X0542811101000000123456\n:54D: NL91ABNA0417164300\n260-C North El Camino. Real. Encinit\nas. CA 92024-2333\n:70: NOT PROVIDEDTestndtond\n:71A: OUR\n:71G: EUR123.45\n:72: /PHOA/726872729191\n:77B: /ORDERRES/In//ng\n-}{"5":{"CHK":""}}',
        },
        messageTrackingId: "b2c01745-2ab1-4f98-86da-da58a853f0c1",
        status: "SUCCESS",
      },
    ],
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
