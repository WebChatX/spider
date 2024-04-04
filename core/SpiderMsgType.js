const allowMsgType = ["LOGIN_SPIDER"];

class SpiderMsgType {
  constructor(msgType) {
    if (!allowMsgType.includes(msgType)) {
      throw new Error(`Unsupported message type: ${msgType}`);
    }
    this.msgType = msgType;
  }
}

export default SpiderMsgType;
