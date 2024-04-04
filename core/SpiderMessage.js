const allowMsgType = ["LOGIN_SPIDER"];

class SpiderMessage {
  constructor(msgType, data) {
    if (!allowMsgType.includes(msgType)) {
      throw new Error(`Unsupported message type: ${msgType}`);
    }
    this.msgType = msgType;
    this.data = data;
  }
}

export default SpiderMessage;
