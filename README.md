# 音频算法系统补强计划

这是一个纯静态 GitHub Pages 学习网页，不需要后端服务。

## 发布文件

- `index.html`
- `styles.css`
- `app.js`
- `lessons.js`
- `lesson-extras.js`
- `.nojekyll`
- `llm-proxy-worker.js`

## 内容范围

网页包含 24 周音频算法路线、岗位对照、知识地图、实战项目、资料库、能力验收和右侧 AI 知识问答面板。岗位对照已补充：

- 虚拟环绕声、空间音频、上混/下混、混响、干湿声分离、音频分轨、全景声
- SOC/DSP 移植、上位机调试、音频流信号搭建、调音准备
- 市场音响对标评价与分析

## GitHub Pages 设置

在仓库 `Settings -> Pages` 中选择：

- Source: `Deploy from a branch`
- Branch: `main`
- Folder: `/root`

保存后等待 1-3 分钟即可访问 GitHub Pages 链接。

## AI 问答接口

右侧“知识问答”面板会向一个代理接口发送：

- `question`
- `messages`
- `context`

不要把大模型 API Key 写进前端代码。可以用 `llm-proxy-worker.js` 部署一个 Cloudflare Worker，并配置这些环境变量：

- `LLM_API_URL`
- `LLM_API_KEY`
- `LLM_MODEL`
- `ALLOWED_ORIGIN`，例如 `https://lxc661.github.io`

部署后，把 Worker 地址填到网页右侧设置里的“接口地址”即可。
