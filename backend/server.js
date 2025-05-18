const express = require('express');
const path = require('path');
const app = express();

// ✅ 直接从 /app/public 加载静态资源
app.use(express.static(path.join(__dirname, './public')));

// ✅ 默认路由
app.get('/', (_, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

// ✅ 处理任意路径（用于 SPA fallback）
app.get('*', (_, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});



