/**
 *  listen: WebSocket服务开始监听指定的端口时触发
 *  close: WebSocket服务关闭时触发
 *  error: WebSocket服务发生错误时触发
 *  connect：客户端连接成功时触发
 *  disconnect：客户端断开连接时触发
 */
const eventTypes = ["listen", "close", "error", "connect", "disconnect"];

export default eventTypes;
