const WebSocket = require("ws");
const eventTypes = require("./eventTypes");

class SpiderServerEngine {
  /**
   * SpiderServerEngine构造函数
   * @param {WebSocket.ServerOptions} options
   * @param {Function} callback 绑定接口成功的回调
   */
  constructor(options, callback) {
    // 客户端socket列表
    this.clientSocketList = [];
    // Spider事件中心
    this.spiderEventMap = new Map();
    // 初始化引擎
    this._initEngine(options, callback);
  }

  /**
   * Spider服务端引擎初始化
   * @param {WebSocket.ServerOptions} options
   * @param {Function} callback 绑定接口成功的回调
   */
  _initEngine(options, callback) {
    this.engine = new WebSocket.Server(options);
    this.engine.on("connection", this._connectHandler);
    this.engine.on("close", this._closeHandler);
    this.engine.on("error", this._errorHandler);
    // this.engine.on("headers", () => {});
    this.engine.on("listening", () => callback && callback());
  }

  /**
   * 客户端socket连接处理
   * @param {WebSocket} ws
   * @param {IncomingMessage} req
   */
  _connectHandler(ws, req) {
    const ip = req.socket.remoteAddress;
    console.log(ip);
  }

  /**
   * WebSocket服务发生错误时触发
   * @param {Error} error
   */
  _errorHandler(error) {
    const errorEvent = this.spiderEventMap.get("error");
    if (errorEvent) {
      errorEvent(error);
    }
  }

  // WebSocket服务关闭时触发
  _closeHandler() {
    const closeEvent = this.spiderEventMap.get("close");
    if (closeEvent) {
      closeEvent();
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
}

module.exports = SpiderServerEngine;
