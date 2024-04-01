import { WebSocketServer } from "ws";
import eventTypes from "./eventTypes.js";

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
    this.engine = new WebSocketServer(options);
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
    if (this.spiderEventMap.has("listen")) {
      const listenEventFunc = this.spiderEventMap.get("listen");
      listenEventFunc();
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
    // ws.send(JSON.stringify(req));
    console.log("-------------客户端请求信息-------------");
    console.log("HTTP Version:", req.httpVersion);
    console.log("Request Method:", req.method);
    console.log("Request URL:", req.url);
    console.log("Request Headers:", req.headers);
    console.log("---------------------------------------");
    this.clientSocketList.push(ws);
    if (this.spiderEventMap.has("connect")) {
      const connectEventFunc = this.spiderEventMap.get("connect");
      connectEventFunc(ws);
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
    if (this.spiderEventMap.has("disconnect")) {
      const disconnectEventFunc = this.spiderEventMap.get("disconnect");
      disconnectEventFunc(ws);
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

export default SpiderServerEngine;
