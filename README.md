# 林国俊 · 个人作品集网站

一个基于原生 HTML / CSS / JavaScript 构建的个人作品集单页网站，用于展示个人介绍、技能与项目作品。无框架、无构建工具、无第三方依赖，开箱即用。

## 功能特性

- **双栏编辑型布局**：桌面端左侧固定名片栏（头像、介绍、技能标签、导航），右侧流动内容区；采用"split 交替 / full 全宽"的项目排版
- **数据驱动渲染**：项目作品由 `js/data.js` 中的 `PROJECTS` 数组驱动，新增项目只需追加一条记录，页面自动渲染（含 HTML 转义防注入）
- **深浅色主题切换**：点击顶部主题按钮在浅色 / 深色主题间切换，背景、文字、边框等颜色通过 CSS 变量全局联动，选择通过 `localStorage` 持久化（键名 `portfolio-theme`），刷新后保持
- **导航高亮**：基于 `IntersectionObserver` 监听滚动位置，自动点亮当前可视区块对应的导航项
- **滚动出现动画**：内容区块进入视口时淡入上移；不支持 `IntersectionObserver` 的环境自动降级为直接显示
- **返回顶部**：滚动超过 600px 后显示悬浮按钮，点击平滑回到顶部
- **移动端适配**：1024px / 768px 两级响应式断点；窄屏下侧栏切换为顶部布局，介绍与技能区可折叠展开，导航变为横向滚动胶囊
- **可访问性**：跳转主内容链接、aria 标签、键盘焦点样式，并尊重系统"减少动效"偏好

## 技术栈

| 类别 | 说明 |
| --- | --- |
| 结构 | 原生 HTML5（语义化标签） |
| 样式 | 原生 CSS3（CSS 变量主题、Flexbox / Grid、媒体查询、`clamp()` 流式字号） |
| 逻辑 | 原生 JavaScript（ES5+，`IntersectionObserver`、`localStorage`、DOM API） |
| 运行环境 | 任意现代浏览器，无需安装依赖或构建 |

## 项目结构

```
lab03/
├── README.md                          # 本说明文档
├── profile.md                         # 个人信息与项目经历原始资料
└── portfolio/                         # 网站根目录
    ├── index.html                     # 页面结构（侧栏名片 + 四大内容区块）
    ├── css/
    │   └── style.css                  # 全部样式：主题变量（含深色主题）、布局、响应式
    ├── js/
    │   ├── data.js                    # 项目数据（PROJECTS 数组，新增项目在此追加）
    │   └── main.js                    # 页面逻辑：渲染、导航高亮、动画、菜单、主题切换
    └── assets/
        └── images/
            └── projects/              # 项目封面图（SVG）
```

## 快速开始

方式一：直接用浏览器打开 `portfolio/index.html`。

方式二（推荐，体验与线上一致）：在项目根目录启动任意静态服务器后访问，例如：

```bash
python -m http.server 8080
# 然后访问 http://localhost:8080/portfolio/
```

## 如何新增项目

编辑 `portfolio/js/data.js`，在 `PROJECTS` 数组中追加一条记录即可：

```js
{
  id: "my-project",            // 项目唯一标识
  title: "项目名称",
  category: "Web 应用",        // 类别
  description: "项目简介",
  techStack: ["Python", "Vue"],// 技术栈
  date: "2026-09",             // 完成时间（YYYY-MM）
  cover: "assets/images/projects/xxx.svg", // 封面图路径
  layout: "split",             // "split" 图文分栏 | "full" 全宽大图
  link: "https://example.com"  // 可选，不填则不显示「查看详情」
}
```

## 主题说明

- 默认浅色主题（米白背景 + 暖橙强调色），深色主题在 `style.css` 中通过 `html[data-theme="dark"]` 变量覆盖实现
- 用户手动切换后写入 `localStorage`；如需重置，清除浏览器站点数据中的 `portfolio-theme` 键即可
