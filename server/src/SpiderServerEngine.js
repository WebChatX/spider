import { WebSocketServer } from "ws";
import { SpiderMessage, messageType } from "@spider/core";
import eventTypes from "./eventTypes.js";

class SpiderServerEngine {
  /**
   * SpiderServerEngine构造函数
   * @param {WebSocket.ServerOptions} options
   */
  constructor(options) {
    this.options = options;
    // 客户端socket列表
    this.clientSocketMap = new Map();
    // Spider事件中心
    this.spiderEventMap = new Map();
    // 自定义消息处理器
    this.customMessageHandler = null;
    // 初始化引擎
    this._initEngine();
  }

  /**
   * Spider服务端引擎初始化
   */
  _initEngine() {
    this.engine = new WebSocketServer(this.options);
    this.engine.on("listening", this._listenHandler.bind(this));
    this.engine.on("close", this._closeHandler.bind(this));
    this.engine.on("error", this._errorHandler.bind(this));
    this.engine.on("connection", this._connectHandler.bind(this));
    // this.engine.on("headers", () => {});
  }

  /**
   * WebSocket服务开始监听指定的端口时触发
   */
  _listenHandler() {
    if (this.spiderEventMap.has("listen")) {
      const listenEventFunc = this.spiderEventMap.get("listen");
      listenEventFunc(this.options.port);
    }
  }

  /**
   * WebSocket服务关闭时触发
   */
  _closeHandler() {
    if (this.spiderEventMap.has("close")) {
      const closeEventFunc = this.spiderEventMap.get("close");
      closeEventFunc();
    }
  }

  /**
   * WebSocket服务发生错误时触发
   * @param {Error} error
   */
  _errorHandler(error) {
    if (this.spiderEventMap.has("error")) {
      const errorEventFunc = this.spiderEventMap.get("error");
      errorEventFunc(error);
    }
  }

  /**
   * WebSocket服务收到连接请求时触发
   * @param {WebSocket} ws
   * @param {IncomingMessage} req
   */
  _connectHandler(ws, req) {
    console.log(req.socket.remoteAddress);
    // console.log("-------------客户端请求信息-------------");
    // console.log("HTTP Version:", req.httpVersion);
    // console.log("Request Method:", req.method);
    // console.log("Request URL:", req.url);
    // console.log("Request Headers:", req.headers);
    // console.log("---------------------------------------");
    ws.onclose = (event) => this._clientSocketCloseHandler(ws, event);
    ws.onerror = (event) => this._clientSocketErrorHandler(ws, event);
    ws.onmessage = (event) => this._clientSocketMessageHandler(ws, event);
  }

  /**
   * 客户端 WebSocket 连接关闭处理
   * @param {WebSocket} ws
   * @param {CloseEvent} event
   */
  _clientSocketCloseHandler(ws, event) {
    console.log("_clientSocketCloseHandler");
  }

  /**
   * 客户端 WebSocket 连接因错误而关闭时触发
   * @param {WebSocket} ws
   * @param {Event} event
   */
  _clientSocketErrorHandler(ws, event) {
    console.log("_clientSocketErrorHandler");
  }

  /**
   * 当收到 客户端 WebSocket 数据时触发
   * @param {WebSocket} ws
   * @param {MessageEvent<any>} event
   */
  _clientSocketMessageHandler(ws, event) {
    console.log("_clientSocketMessageHandler");
    const msg = SpiderMessage.deserialize(event.data);
    msg.isCustom
      ? this._customMessageHandler(ws, msg)
      : this._spiderMessageHandler(ws, msg);
  }

  /**
   * Spider消息处理
   * @param {WebSocket} ws
   * @param {SpiderMessage} msg
   */
  _spiderMessageHandler(ws, msg) {
    // 客户端上线
    if (msg.msgType === messageType.loginSpider) {
      const { senderID } = msg;
      //TODO:如果在线，则被挤下线
      this.clientSocketMap.set(senderID, ws);
      if (this.spiderEventMap.has("connect")) {
        const connectEventFunc = this.spiderEventMap.get("connect");
        connectEventFunc(ws);
      }
    }
    // 客户端下线
    else if (msg.msgType === messageType.logoutSpider) {
      const { senderID } = msg;
      this.clientSocketMap.delete(senderID);
      if (this.spiderEventMap.has("disconnect")) {
        const disconnectEventFunc = this.spiderEventMap.get("disconnect");
        disconnectEventFunc(ws);
      }
    }
    // 未知消息处理
    else {
      console.log("Error: 客户端传递未定义消息");
    }
  }

  /**
   * 自定义消息处理
   * @param {WebSocket} ws
   * @param {SpiderMessage} msg
   */
  _customMessageHandler(ws, msg) {
    if (this.customMessageHandler) {
      this.customMessageHandler(msg);
    }
  }

  /**
   * 为Spider服务端引擎添加事件监听
   * @param {"listen" | "close" | "error" | "connect" | "disconnect"} type 事件类型
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
   * @param {"listen" | "close" | "error" | "connect" | "disconnect"} type
   */
  removeEventListener(type) {
    if (!eventTypes.includes(type)) {
      throw new Error(`Unsupported event type: ${type}`);
    }
    if (this.spiderEventMap.has(type)) {
      this.spiderEventMap.delete(type);
    }
  }

  /**
   * 设置自定义消息处理器
   * @param {(msg:SpiderMessage) => void} callback
   */
  setCustomMessageHandler(callback) {
    this.customMessageHandler = callback;
  }
}

export default SpiderServerEngine;
