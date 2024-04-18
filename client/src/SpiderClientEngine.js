import { SpiderMessage, messageType } from "@spider/core";

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
    this.engine.close();
  }
}

export default SpiderClientEngine;
