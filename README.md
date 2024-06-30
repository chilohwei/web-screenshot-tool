# 网页在线截图工具

![截图工具](https://img.shields.io/badge/Web-Screenshot%20Tool-blue)

[点击查看演示视频](https://files.chiloh.net/%E5%BC%80%E6%BA%90%EF%BD%9C%E6%99%BA%E8%83%BD%E7%BD%91%E9%A1%B5%E6%88%AA%E5%9B%BE%E5%B7%A5%E5%85%B7(GPT%E7%BC%96%E5%86%99).mp4)

<img width="1423" alt="image" src="https://github.com/chilohwei/web-screenshot-tool/assets/51521054/95fd755e-e8fe-4954-abde-c4f3186af558">

## 简介

网页在线截图工具是一个简单易用的在线工具，用户可以输入任意网址并获取该网页的截图。由 Chiloh 主导，ChatGPT 辅助编写实现，代码 100% 由 AI 创作。该工具支持桌面版和移动版截图，并提供一键下载功能。

## 功能

- **输入网址**：用户可以输入任意有效的 URL。
- **截图预览**：实时显示输入网址的截图预览。
- **切换设备**：支持桌面版和移动版的截图。
- **下载截图**：一键下载生成的截图。

## 技术栈

- **前端**：React, Material-UI
- **后端**：Node.js, Express
- **容器化**：Docker, Nginx Proxy Manager
- **域名管理和 CDN**：Cloudflare

## 使用方法

### 在线使用

1. 访问 [网页在线截图工具](https://jietu.chiloh.com)。
2. 在输入框中输入你想要截图的网页 URL。
3. 点击“获取截图”按钮。
4. 预览区域将显示生成的截图。
5. 点击“下载截图”按钮，将截图保存到本地。

### 本地开发

1. 克隆仓库：
   ```bash
   git clone https://github.com/chilohwei/web-screenshot-tool.git 
   cd web-screenshot-tool
   ```

2. 进入`backend`，安装依赖：
   ```bash
   npm install express puppeteer winston express-validator
   ```

3. 启动后端服务：
   ```bash
   node server.js
   ```
4. 进入`frontend`，安装依赖：
   ```bash
   npm install
   ```
5. 运行前端服务：
   ```bash
   npm start
   ```

6. 在浏览器中打开 [http://localhost:3000](http://localhost:3000)。

## 贡献

欢迎贡献代码！请 fork 本仓库并提交 Pull Request。如果有任何问题或建议，请提交 Issue。

## 许可证

本项目采用 [MIT 许可证](LICENSE)。
