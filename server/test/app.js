import { SpiderServerEngine } from "../src/main.js";

const spiderServerEngine = new SpiderServerEngine({ port: 8080 });

spiderServerEngine.addEventListener("listen", (port) => {
  console.log(`服务启动于: ws://127.0.0.1:${port}`);
});

//接入日志系统
spiderServerEngine.addEventListener("error", (error) => {
  console.log("SpiderServerEngine服务运行出错: ", error.message);
});

spiderServerEngine.addEventListener("close", () => {
  console.log("SpiderServerEngine服务关闭");
});

//命令行打印
spiderServerEngine.addEventListener("connect", () => {
  console.log(`客户端上线`);
});

//命令行打印
spiderServerEngine.addEventListener("disconnect", () => {
  console.log("客户端下线");
});

//设置自定义消息
spiderServerEngine.setCustomMessageHandler((msg) => {
  console.log("-----------------------------------");
  console.log("消息类型：", msg.msgType);
  console.log("发送者ID：", msg.senderID);
  console.log("接受者ID：", msg.receiverID);
  console.log("消息数据：", msg.data);
  console.log("-----------------------------------");
});
