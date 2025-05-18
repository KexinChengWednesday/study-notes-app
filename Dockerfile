# 原始基础镜像
FROM node:18

# 创建并进入工作目录
WORKDIR /app

# 复制依赖文件
COPY backend/package.json .

# 安装依赖
RUN npm install

# 复制静态资源和服务器文件
COPY backend/server.js ./server.js
COPY public ./public  
# 暴露端口
EXPOSE 8080

# 启动应用
CMD ["node", "server.js"]
