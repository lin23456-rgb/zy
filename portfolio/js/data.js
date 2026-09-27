/**
 * 项目数据数组 —— 新增项目只需在此追加一条记录，页面会自动渲染。
 *
 * 每条记录字段：
 *   id          项目唯一标识
 *   title       项目名称
 *   category    类别
 *   description 项目简介
 *   techStack   技术栈（数组）
 *   date        完成时间（YYYY-MM）
 *   cover       封面图片路径
 *   layout      排版形态："split" 图文左右分栏 | "full" 全宽大图
 *   link        可选，项目链接（未提供则不渲染「查看详情」）
 */
const PROJECTS = [
  {
    id: "campus-market",
    title: "校园二手交易平台",
    category: "Web 应用",
    description:
      "面向高校学生的闲置物品交易 Web 应用，重点解决校园内二手物品信息分散、交易流程不便的问题。支持商品发布与检索、站内私信沟通、订单状态流转等功能，使用 JWT 完成登录鉴权，并通过 Redis 缓存热点商品数据以提升接口响应速度。",
    techStack: ["Vue", "Node.js", "MySQL", "Redis"],
    date: "2026-06",
    cover: "assets/images/projects/campus-market.svg",
    layout: "split"
  },
  {
    id: "ai-tutor",
    title: "AI 课程问答助手",
    category: "AI 应用",
    description:
      "面向课程学习场景的智能问答应用，针对课程知识点分散、答疑不及时的问题，将课程讲义构建为知识库并接入大语言模型，实现检索增强问答。支持文档上传、向量检索、流式回答与引用溯源，可自动生成知识点摘要，帮助同学快速定位课程重点。",
    techStack: ["Python", "FastAPI", "大语言模型 API", "Vue"],
    date: "2026-03",
    cover: "assets/images/projects/ai-tutor.svg",
    layout: "full"
  }
];
