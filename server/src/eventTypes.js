/**
 *  listen: WebSocket服务开始监听指定的端口时触发
 *  close: WebSocket服务关闭时触发
 *  error: WebSocket服务发生错误时触发
 *  online：客户端上线时触发
 *  offline：客户端下线时触发
 */
const eventTypes = ["listen", "close", "error", "connect", "disconnect"];

module.exports = eventTypes;
