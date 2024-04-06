import { SpiderMessage, messageType } from "@spider/core";

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

export default SpiderClientEngine;
