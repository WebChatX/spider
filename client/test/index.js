import { SpiderClientEngine } from "../src/main.js";

let spiderClientEngine = null;

// 连接Spider服务器
const connectSpider = () => {
  spiderClientEngine = new SpiderClientEngine("ws://127.0.0.1:8080", "SP001");
};

const btn1El = document.querySelector("#btn1");
btn1El.onclick = connectSpider;
