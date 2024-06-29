# 使用官方Node.js镜像作为构建环境
FROM node:14 AS build

# 设置工作目录
WORKDIR /app

# 复制package.json和package-lock.json
COPY package*.json ./

# 安装依赖
RUN npm install

# 复制所有文件
COPY . .

# 启动前端应用
CMD ["npm", "start"]