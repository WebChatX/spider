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

class SpiderClientEngine {
  /**
   * SpiderClientEngine构造函数
   * @param {string} url 要连接的URL
   * @param {string} socketID 唯一ID标识，服务端进行标识
   */
  constructor(url, socketID) {
    // 初始化引擎
    this._initEngine(url, socketID);
    this.a = SpiderMessage;
  }

  /**
   * Spider客户端引擎初始化
   * @param {string} url 要连接的URL
   * @param {string} socketID 唯一ID标识，服务端进行标识
   */
  _initEngine(url, socketID) {
    this.engine = new WebSocket(url);
    this.engine.send();
  }
}

export { SpiderClientEngine };
