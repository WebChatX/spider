const WebSocket = require("ws");
const eventTypes = require("./eventTypes");

class SpiderServerEngine {
  /**
   * SpiderServerEngine构造函数
   * @param {WebSocket.ServerOptions} options
   */
  constructor(options) {
    // 客户端socket列表
    this.clientSocketList = [];
    // Spider事件中心
    this.spiderEventMap = new Map();
    // 初始化引擎
    this._initEngine(options);
  }

  /**
   * Spider服务端引擎初始化
   * @param {WebSocket.ServerOptions} options
   */
  _initEngine(options) {
    this.engine = new WebSocket.Server(options);
    this.engine.on("connection", this._connectHandler.bind(this));
    this.engine.on("listening", this._listenHandler.bind(this));
    this.engine.on("close", this._closeHandler.bind(this));
    this.engine.on("error", this._errorHandler.bind(this));
    // this.engine.on("headers", () => {});
  }

  // #region SpiderServerEngine事件处理

  /**
   * 客户端socket连接处理
   * @param {WebSocket} ws
   * @param {IncomingMessage} req
   */
  _connectHandler(ws, req) {
    this.clientSocketList.push(ws);
    if (this.spiderEventMap.has("online")) {
      const onlineEvent = this.spiderEventMap.get("online");
      onlineEvent(ws, req);
    }
  }

  /**
   * Spider服务端引擎开始监听指定的端口时触发
   */
  _listenHandler() {
    const listeningEvent = this.spiderEventMap.get("listening");
    if (listeningEvent) {
      listeningEvent();
    }
  }

  /**
   * Spider服务端引擎关闭时触发
   */
  _closeHandler() {
    const closeEvent = this.spiderEventMap.get("close");
    if (closeEvent) {
      closeEvent();
    }
  }

  /**
   * Spider服务端引擎发生错误时触发
   * @param {Error} error
   */
  _errorHandler(error) {
    const errorEvent = this.spiderEventMap.get("error");
    if (errorEvent) {
      errorEvent(error);
    }
  }

  /**
   * 为Spider服务端引擎添加事件监听
   * @param {string} type 事件类型
   * @param {Function} listener 监听器
   */
  addEventListener(type, listener) {
    if (!eventTypes.includes(type)) {
      throw new Error(`Unsupported event type: ${type}`);
    }
    this.spiderEventMap.set(type, listener);
  }

  /**
   * 为Spider服务端引擎移除事件监听
   * @param {string} type
   */
  removeEventListener(type) {
    if (!eventTypes.includes(type)) {
      throw new Error(`Unsupported event type: ${type}`);
    }
    if (this.spiderEventMap.has(type)) {
      this.spiderEventMap.delete(type);
    }
  }

  // #endregion
}

module.exports = SpiderServerEngine;
