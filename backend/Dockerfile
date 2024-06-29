# 使用官方Node.js镜像作为基础镜像
FROM node:14

# 创建并设置工作目录
WORKDIR /usr/src/app

# 复制package.json和package-lock.json
COPY package*.json ./

# 安装依赖
RUN npm install

# 复制当前目录的所有文件到工作目录
COPY . .

# 暴露应用运行的端口，假设server.js监听3000端口
EXPOSE 3000

# 启动应用
CMD ["node", "server.js"]