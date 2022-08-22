class topicsData {
  constructor() {
    this.CBPR_Validator_Ingress = [];
    this.consolidator_topic = [];
    this.MX2MT_Transformer_Ingress = [];
    this.MT_Builder_Ingress = [];
    this.Error = [];
    this.MX_Response_Builder_Ingress = [];
    this.MT2MX_Transformer_Ingress = [];
    this.MX_Validator_Ingress = [];
    this.MT_Validator_Ingress = [];
    this.MT_Response_Builder_Ingress = [];
    this.test = [];
    this.MT_Ingestor_Ingress = [];
    this.ISOConvertor_Response = [];
    this.MX_Builder_Ingress = [];
    this.ISOConvertor_MT2MX_Response = [];
    this.Error_Mx2Mt = [];
    this.Error_Mt2Mx = [];
  }
  setMessages(topic, offset, message) {
    // console.log(typeof message);
    // convert data into JSON object
    var parsedData = JSON.parse(message);
    // console.log(typeof parsedData);

    console.log(
      topic + " => " + offset + " => " + JSON.stringify(JSON.parse(message))
    );
    this[topic].push(parsedData);
  }

  getMessages(topic, requestId) {
    let dataRequestId = topic.filter((data) => data.requestId === requestId);
    return dataRequestId;
  }
  
  getMessagesWithMessageTrackingId(topic, requestId, messageTrackingId) {
    console.log(topic);
      let dataRequestId = topic.filter((data) => data.requestId === requestId);
      let scrapData = dataRequestId[0]["trackingInfo"];
      return scrapData.filter((data) => data.messageTrackingId === messageTrackingId );
  }
}

module.exports = topicsData;
