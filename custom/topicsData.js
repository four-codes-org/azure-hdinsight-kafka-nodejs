class topicsData {
  constructor() {
    this.CBPR_Validator_Ingress = [];
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

  getMessages(topic, parameters) {
    return topic.filter((data) => data.requestId === parameters);
  }
}

module.exports = topicsData;
