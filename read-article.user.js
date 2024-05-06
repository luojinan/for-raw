// ==UserScript==
// @name         文章阅读模式
// @namespace    http://tampermonkey.net/
// @version      2024-04-30
// @description  无图模式精简文章网页，方便阅读
// @author       You
// @match        https://www.boyamedia.com/category/*
// @match        https://www.lifeweek.com.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=boyamedia.com
// @grant        none
// ==/UserScript==

(function () {
  "use strict";

  function observeElementCount(targetElement, callback) {
    const observer = new MutationObserver((mutationsList) => {
      for (const mutation of mutationsList) {
        if (mutation.type === "childList") {
          console.log("子节点数量发生变化"); // TODO: 列表滚动加载会被执行多次，优化，防抖？
          callback();
        }
      }
    });

    observer.observe(targetElement, { childList: true });

    // 返回一个函数，调用它可以停止监听
    return function stopObserving() {
      observer.disconnect();
    };
  }

  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  const run = async () => {
    const { hostname, pathname } = location;

    // 人物文章详情
    if (hostname == "www.boyamedia.com" && pathname.includes("detail")) {
      // 移除图片，文章边框样式
      try {
        document.querySelectorAll("img").forEach((item) => item.remove());
        document.querySelector("header")?.remove();
        document.querySelector(".footer")?.remove();
        document.querySelector(".mobile-content").className = "";
      } catch (error) {}
      return;
    }
    // 人物文章列表
    if (hostname == "www.boyamedia.com" && pathname.includes("category")) {
        document.querySelector("header")?.remove();
        document.querySelector(".footer")?.remove();
        document.querySelector(".cjtx-box")?.remove();
      return;
    }

    // 三联生活周刊列表
    if (hostname == "www.lifeweek.com.cn" && pathname.includes("latest")) {
      console.log("latest");
      await sleep(1000); // TODO: 优化
      document.querySelector("footer")?.remove();
      document.querySelector("header")?.remove();
      document.querySelector(".latest-head")?.remove();

      const listElement = document.querySelector(".latest-list-box");
      observeElementCount(listElement, () => {
        // 移除数字刊
        document
          .querySelectorAll(".latest-list-box-item-title")
          .forEach((item) => {
            if (item.innerText) {
              item.parentElement.parentElement.remove();
            }
          });
      });
      return;
    }
    // 三联生活周刊文章详情
    if (hostname == "www.lifeweek.com.cn" && pathname.includes("article")) {
      document.querySelector("header")?.remove();
      document.querySelector("footer")?.remove();
      document.querySelectorAll("img").forEach((item) => item.remove());
      document.querySelector(".comment-wrap")?.remove();
      document.querySelector(".left-side-box")?.remove();
      const article = document.querySelector("#js_content");
      const children = article.children;
      const length = children.length;

      for (let i = length - 1; i >= length - 4; i--) {
        article.removeChild(children[i]);
      }
      document.querySelector('[data-tools="135编辑器"]')?.remove();
      return;
    }
  };

  // 三联生活周刊是单页面应用nuxt，跳转页面不会重新触发脚本，因此需要在首次加载脚本时添加路由监听，手动再次触发脚本
  window.addEventListener("popstate", function (event) {
    console.log("触发路由监听popstate"); // 左滑返回触发
    run();
  });
  // 监听 body 元素内子元素的变化，来判断是否切换了路由，而不是通过监听href来判断路由切换（可能存在问题
  // 因为nuxt 服务端渲染不会触发客户端浏览器的路由事件，而是发出资源请求触发渲染再手动修改url，或许要办法监听url变化而不监听路由事件API
  const observer = new MutationObserver(() => {
    console.log("Body子节点变化了", window.location.href);
    run();
  });
  const body = document.querySelector("body");
  observer.observe(body, { childList: true });
})();
