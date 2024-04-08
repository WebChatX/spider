import { SpiderClientEngine } from "../dist/SpiderClient.esm.js";

let spiderClientEngine = null;

// 连接Spider服务器
const connectSpider = () => {
  spiderClientEngine = new SpiderClientEngine("ws://127.0.0.1:8080", "SP001");
};

// 断开Spider服务器
const disconnectSpider = () => {
  spiderClientEngine.disconnect();
};

const btn1El = document.querySelector("#btn1");
const btn2El = document.querySelector("#btn2");
btn1El.onclick = connectSpider;
btn2El.onclick = disconnectSpider;
