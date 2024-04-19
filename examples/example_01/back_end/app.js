import { SpiderServerEngine } from "@spider/server";

const spiderServerEngine = new SpiderServerEngine({ port: 3000 });

spiderServerEngine.addEventListener("listen", (port) => {
  console.log(`服务启动于：ws://127.0.0.1:${port}`);
});
