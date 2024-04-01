const { SpiderServerEngine } = require("../src/main");

const spiderServerEngine = new SpiderServerEngine({ port: 8080 });

spiderServerEngine.addEventListener("listen", () => {
  console.log("服务启动于: ws://127.0.0.1:8080");
});

spiderServerEngine.addEventListener("error", (error) => {
  console.log("SpiderServerEngine服务运行出错: ", error.message);
});

spiderServerEngine.addEventListener("close", () => {
  console.log("SpiderServerEngine服务关闭");
});

spiderServerEngine.addEventListener("connect", () => {
  console.log(`客户端上线`);
});

spiderServerEngine.addEventListener("disconnect", () => {
  console.log("客户端下线");
});
