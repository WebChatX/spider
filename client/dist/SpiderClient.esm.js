const messageType = {
  loginSpider: "LOGIN_SPIDER",
  logoutSpider: "LOGOUT_SPIDER"
};

const allowMsgType = Object.values(messageType);

class SpiderMessage {
  /**
   * SpiderMessage构造函数
   * @param {string} msgType 消息类型
   * @param {Object} data 消息数据
   * @param {string} senderID 发送者ID
   * @param {string} receiverID 接受者ID
   */
  constructor(msgType, data, senderID, receiverID) {
    if (!allowMsgType.includes(msgType)) {
      throw new Error(`Unsupported message type: ${msgType}`);
    }
    this.msgType = msgType;
    this.data = data;
    this.senderID = senderID;
    this.receiverID = receiverID;
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

class SpiderClientEngine {
  /**
   * SpiderClientEngine构造函数
   * @param {string} url 要连接的URL
   * @param {string} socketID 唯一ID标识，服务端进行标识
   */
  constructor(url, socketID) {
    this.socketID = socketID;
    // 初始化引擎
    this._initEngine(url);
  }

  /**
   * Spider客户端引擎初始化
   * @param {string} url 要连接的URL
   */
  _initEngine(url) {
    this.engine = new WebSocket(url);

    this.engine.onopen = () => {
      console.log("------open------");
    };
    this.engine.onclose = () => {
      console.log("------close------");
    };
    this.engine.onerror = () => {
      console.log("------error------");
    };
    this.engine.onmessage = () => {
      console.log("------message------");
    };
  }

  /**
   * 连接Spider服务器
   */
  connect() {
    console.log("------connect------");
    const msgStr = SpiderMessage.createMsg(
      messageType.loginSpider,
      null,
      this.socketID,
      null
    );
    this.engine.send(msgStr);
  }

  /**
   * 断开与Spider服务器的连接
   */
  disconnect() {
    console.log("------disconnect------");
    const msgStr = SpiderMessage.createMsg(
      messageType.logoutSpider,
      null,
      this.socketID,
      null
    );
    this.engine.send(msgStr);
  }
}

export { SpiderClientEngine };
