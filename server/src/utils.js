/**
 * 生成客户端SocketID
 * @returns
 */
export function generateSocketID() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}
