/**
 *  listening: Spider服务端引擎开始监听指定的端口时触发
 *  close: Spider服务端引擎关闭时触发
 *  error: Spider服务端引擎发生错误时触发
 *  online：客户端上线时触发
 *  offline：客户端下线时触发
 */
const eventTypes = ["listening", "close", "error", "online", "offline"];

module.exports = eventTypes;
