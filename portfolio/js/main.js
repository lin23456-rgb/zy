/**
 * main.js —— 仅负责五件事：
 *   1) 项目数据渲染
 *   2) 滚动监听与导航高亮
 *   3) 滚动出现动画（IntersectionObserver）
 *   4) 移动端菜单切换 + 返回顶部
 *   5) 深浅色主题切换（localStorage 记忆）
 */
(function () {
  "use strict";

  var THEME_KEY = "portfolio-theme";

  /** 应用主题到 <html data-theme> */
  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
  }

  /** 初始化主题：读取 localStorage，默认浅色 */
  function initTheme() {
    var saved = null;
    try {
      saved = localStorage.getItem(THEME_KEY);
    } catch (e) { /* 隐私模式等场景下忽略 */ }
    applyTheme(saved === "dark" ? "dark" : "light");
  }

  /** 主题切换按钮 */
  function setupThemeToggle() {
    var btn = document.getElementById("themeToggle");
    if (!btn) return;

    function syncLabel() {
      var isDark = document.documentElement.getAttribute("data-theme") === "dark";
      btn.setAttribute("aria-label", isDark ? "切换浅色主题" : "切换深色主题");
      btn.setAttribute("title", isDark ? "切换浅色主题" : "切换深色主题");
    }

    btn.addEventListener("click", function () {
      var isDark = document.documentElement.getAttribute("data-theme") === "dark";
      var next = isDark ? "light" : "dark";
      applyTheme(next);
      try {
        localStorage.setItem(THEME_KEY, next);
      } catch (e) { /* 忽略写入失败 */ }
      syncLabel();
    });

    syncLabel();
  }

  /** 把 YYYY-MM 格式化为 YYYY.MM */
  function formatDate(date) {
    if (!date) return "";
    const parts = String(date).split("-");
    return parts.join(".");
  }

  /** HTML 转义，避免数据中特殊字符破坏结构 */
  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  /** 渲染项目列表 */
  function renderProjects() {
    const list = document.getElementById("projectList");
    if (!list || typeof PROJECTS === "undefined") return;

    const fragment = document.createDocumentFragment();

    PROJECTS.forEach((project, index) => {
      const num = String(index + 1).padStart(2, "0");
      const isFull = project.layout === "full";
      // split 形态：偶数项图文左图右文，奇数项右图左文
      const isReverse = !isFull && index % 2 === 1;

      const article = document.createElement("article");
      article.className =
        "project reveal" +
        (isFull ? " project--full" : " project--split") +
        (isReverse ? " project--reverse" : "");
      article.id = "project-" + project.id;

      const techItems = (project.techStack || [])
        .map((t) => "<li>" + escapeHtml(t) + "</li>")
        .join("");

      const linkHtml = project.link
        ? '<a class="project__link" href="' +
          escapeHtml(project.link) +
          '" target="_blank" rel="noopener">查看详情 →</a>'
        : "";

      article.innerHTML =
        '<div class="project__media">' +
        '  <span class="project__num" aria-hidden="true">' + num + "</span>" +
        '  <img class="project__cover" src="' + escapeHtml(project.cover) +
          '" alt="' + escapeHtml(project.title) + ' 项目封面图" loading="lazy" width="1200" height="800">' +
        "</div>" +
        '<div class="project__body">' +
        '  <div class="project__meta">' +
        '    <span class="project__category">' + escapeHtml(project.category) + "</span>" +
        '    <time class="project__date" datetime="' + escapeHtml(project.date) + '">' +
          formatDate(project.date) + "</time>" +
        "  </div>" +
        '  <h3 class="project__title">' + escapeHtml(project.title) + "</h3>" +
        '  <p class="project__desc">' + escapeHtml(project.description) + "</p>" +
        '  <ul class="project__tech">' + techItems + "</ul>" +
        linkHtml +
        "</div>";

      fragment.appendChild(article);
    });

    list.appendChild(fragment);

    // 新渲染出来的项目也需要观察淡入
    observeReveal(list.querySelectorAll(".reveal"));
  }

  /** 滚动出现动画观察 */
  let revealObserver = null;
  function observeReveal(elements) {
    if (!("IntersectionObserver" in window) || !elements || !elements.length) {
      // 不支持时直接显示，保证内容可见
      if (elements) elements.forEach((el) => el.classList.add("is-visible"));
      return;
    }
    if (!revealObserver) {
      revealObserver = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              revealObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.15, rootMargin: "0px 0px -10% 0px" }
      );
    }
    elements.forEach((el) => revealObserver.observe(el));
  }

  /** 导航高亮：根据当前可视区块点亮对应导航 */
  function setupNavHighlight() {
    const navLinks = Array.prototype.slice.call(
      document.querySelectorAll(".nav__link")
    );
    const sections = navLinks
      .map(function (a) {
        const href = a.getAttribute("href") || "";
        const id = href.slice(1);
        return document.getElementById(id);
      })
      .filter(Boolean);

    if (!sections.length) return;

    if (!("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            navLinks.forEach(function (a) {
              const isActive = a.getAttribute("href") === "#" + id;
              a.classList.toggle("active", isActive);
              if (isActive) a.setAttribute("aria-current", "true");
              else a.removeAttribute("aria-current");
            });
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );

    sections.forEach(function (s) {
      observer.observe(s);
    });
  }

  /** 移动端菜单切换 */
  function setupMobileMenu() {
    const toggle = document.getElementById("menuToggle");
    const collapsible = document.getElementById("sidebarCollapsible");
    if (!toggle || !collapsible) return;

    function syncLabel() {
      const opened = collapsible.classList.contains("is-open");
      toggle.setAttribute("aria-expanded", opened ? "true" : "false");
      toggle.classList.toggle("is-open", opened);
      const label = toggle.querySelector(".menu-toggle__label");
      if (label) label.textContent = opened ? "收起" : "展开";
    }

    toggle.addEventListener("click", function () {
      collapsible.classList.toggle("is-open");
      syncLabel();
    });

    // 点击导航后自动收起（移动端体验）
    document.querySelectorAll(".nav__link").forEach(function (a) {
      a.addEventListener("click", function () {
        if (collapsible.classList.contains("is-open")) {
          collapsible.classList.remove("is-open");
          syncLabel();
        }
      });
    });

    syncLabel();
  }

  /** 返回顶部按钮 */
  function setupBackToTop() {
    const btn = document.getElementById("toTop");
    if (!btn) return;
    window.addEventListener(
      "scroll",
      function () {
        if (window.scrollY > 600) {
          btn.hidden = false;
        } else {
          btn.hidden = true;
        }
      },
      { passive: true }
    );
    btn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /** 初始化 */
  function init() {
    initTheme(); // 尽早应用已保存的主题，避免闪烁
    renderProjects();
    observeReveal(document.querySelectorAll(".reveal"));
    setupNavHighlight();
    setupMobileMenu();
    setupBackToTop();
    setupThemeToggle();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
