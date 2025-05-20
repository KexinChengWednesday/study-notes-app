# 使用官方 Node.js 镜像作为基础镜像
FROM node:18

# 设置工作目录
WORKDIR /app

# 复制依赖描述文件并安装依赖
COPY package*.json ./
RUN npm install

# 复制项目文件（包括 public、routes、models 等）
COPY . .

# 暴露应用端口
EXPOSE 8080

# 启动应用
CMD ["node", "server.js"]
