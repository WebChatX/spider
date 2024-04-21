import messageType from "./messageType.js";

const allowMsgType = Object.values(messageType);

class SpiderMessage {
  /**
   * SpiderMessage构造函数
   * @param {string} msgType 消息类型
   * @param {Object} data 消息数据
   * @param {string} senderID 发送者ID
   * @param {string} receiverID 接受者ID
   * @param {boolean} isCustom 是否为自定义消息
   */
  constructor(msgType, data, senderID, receiverID, isCustom = false) {
    if (!allowMsgType.includes(msgType)) {
      throw new Error(`Unsupported message type: ${msgType}`);
    }
    this.msgType = msgType;
    this.data = data;
    this.senderID = senderID;
    this.receiverID = receiverID;
    this.isCustom = isCustom;
  }

  /**
   * 消息序列化
   * @param {SpiderMessage} msg
   * @returns
   */
  static serialize(msg) {
    return JSON.stringify(msg);
  }

  /**
   * 消息反序列化
   * @param {string} msgStr
   * @returns
   */
  static deserialize(msgStr) {
    return JSON.parse(msgStr);
  }

  /**
   * 创建一条消息并进行序列化
   * @param {string} msgType 消息类型
   * @param {Object} data 消息数据
   * @param {string} senderID 发送者ID
   * @param {string} receiverID 接受者ID
   * @returns
   */
  static createMsg(msgType, data, senderID, receiverID) {
    const msg = new SpiderMessage(msgType, data, senderID, receiverID);
    return SpiderMessage.serialize(msg);
  }
}

export default SpiderMessage;
