const messageType = {
  loginSpider: "LOGIN_SPIDER",
  logoutSpider: "LOGOUT_SPIDER",
  customMessage: "CUSTOM_MESSAGE"
};

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

class SpiderClientEngine {
  /**
   * SpiderClientEngine构造函数
   * @param {string} url 要连接的URL
   * @param {string} socketID 唯一ID标识，服务端进行标识
   */
  constructor(url, socketID) {
    this.url = url;
    this.socketID = socketID;
    // 初始化引擎
    this._initEngine();
  }

  /**
   * Spider客户端引擎初始化
   */
  _initEngine() {
    this.engine = new WebSocket(this.url);
    this.engine.onopen = (event) => this._openHandler(event);
    this.engine.onclose = (event) => this._closeHandler(event);
    this.engine.onerror = (event) => this._errorHandler(event);
    this.engine.onmessage = (event) => this._messageHandler(event);
  }

  /**
   * 连接Spider服务端引擎成功
   * @param {Event} event
   */
  _openHandler(event) {
    // 登录消息
    const msgStr = SpiderMessage.createMsg(
      messageType.loginSpider,
      null,
      this.socketID,
      null
    );
    this.engine.send(msgStr);
  }

  /**
   * 连接关闭
   * @param {CloseEvent} event
   */
  _closeHandler(event) {
    console.log("------close------");
  }

  /**
   * 连接失败
   * @param {Event} event
   */
  _errorHandler(event) {
    console.log("------error------");
  }

  /**
   * 收到服务端的信息
   * @param {MessageEvent<any>} event
   */
  _messageHandler(event) {
    console.log("------message------");
    console.log(event.data);
    //const msg = SpiderMessage.deserialize(event.data);
  }

  /**
   * 断开与Spider服务器的连接
   */
  disconnect() {
    const msgStr = SpiderMessage.createMsg(
      messageType.logoutSpider,
      null,
      this.socketID,
      null
    );
    this.engine.send(msgStr);
    this.engine.close();
  }

  /**
   * 发送消息给其他客户端
   * @param {string} customMsgType  自定义消息类型
   * @param {*} data  消息数据
   * @param {*} receiverID  接收者ID
   */
  send(customMsgType, data, receiverID) {}
}

export { SpiderClientEngine };
