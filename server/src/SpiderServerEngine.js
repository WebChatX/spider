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
    this.engine.on("listening", this._listenHandler.bind(this));
    this.engine.on("close", this._closeHandler.bind(this));
    this.engine.on("error", this._errorHandler.bind(this));
    this.engine.on("connection", this._connectHandler.bind(this));
    // this.engine.on("headers", () => {});
  }

  // #region SpiderServerEngine事件处理

  /**
   * Spider服务端引擎开始监听指定的端口时触发
   */
  _listenHandler() {
    if (this.spiderEventMap.has("listening")) {
      const listeningEventFunc = this.spiderEventMap.get("listening");
      listeningEventFunc();
    }
  }

  /**
   * Spider服务端引擎关闭时触发
   */
  _closeHandler() {
    if (this.spiderEventMap.has("close")) {
      const closeEventFunc = this.spiderEventMap.get("close");
      closeEventFunc();
    }
  }

  /**
   * Spider服务端引擎发生错误时触发
   * @param {Error} error
   */
  _errorHandler(error) {
    if (this.spiderEventMap.has("error")) {
      const errorEventFunc = this.spiderEventMap.get("error");
      errorEventFunc(error);
    }
  }

  /**
   * 客户端 Websocket 连接处理
   * @param {WebSocket} ws
   * @param {IncomingMessage} req
   */
  _connectHandler(ws, req) {
    console.log(req.socket.remoteAddress);
    this._clientSocketOpenHandler(ws, req);
    ws.onclose = () => this._clientSocketCloseHandler(ws, req);
  }

  // #endregion

  // #region 客户端 WebSocket事件处理

  /**
   * 客户端 WebSocket 连接成功处理
   * @param {WebSocket} ws
   * @param {IncomingMessage} req
   */
  _clientSocketOpenHandler(ws, req) {
    this.clientSocketList.push(ws);
    if (this.spiderEventMap.has("online")) {
      const onlineEventFunc = this.spiderEventMap.get("online");
      onlineEventFunc(ws);
    }
  }

  /**
   * 客户端 WebSocket 连接关闭处理
   * @param {WebSocket} ws
   * @param {IncomingMessage} req
   */
  _clientSocketCloseHandler(ws, req) {
    // TODO 从客户端Socket列表中移除
    //???
    if (this.spiderEventMap.has("offline")) {
      const offlineEventFunc = this.spiderEventMap.get("offline");
      offlineEventFunc(ws);
    }
  }

  // #endregion

  // #region 外部调用

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
