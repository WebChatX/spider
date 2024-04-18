/**
 *  listen: Spider服务端引擎开始监听端口时触发
 *  close: Spider服务端引擎关闭时触发
 *  error: Spider服务端引擎发生错误时触发
 *  connect：Spider客户端引擎连接成功时触发
 *  disconnect：Spider客户端引擎断开连接时触发
 */
const eventTypes = ["listen", "close", "error", "connect", "disconnect"];

export default eventTypes;
