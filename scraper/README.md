# TechfinX Content Scraper

TechfinX 内容抓取系统，支持从多个源自动抓取AI和金融科技相关的内容。

## 🚀 功能特性

- **多源抓取**: 支持Twitter、RSS、Google News
- **智能分类**: 自动分类文章到不同类别
- **内容去重**: 智能检测和过滤重复内容
- **质量评分**: 自动评估文章质量
- **定时调度**: 支持定时自动抓取
- **缓存优化**: Redis缓存提升性能
- **错误处理**: 完善的错误处理和重试机制

## 📋 环境要求

- Python >= 3.8
- MongoDB >= 5.0
- Redis >= 6.0
- Node.js >= 18.0 (用于后端API)

## 🛠️ 安装配置

### 1. 安装依赖

```bash
pip install -r requirements.txt
```

### 2. 环境配置

复制环境变量文件：
```bash
cp .env.example .env
```

编辑 `.env` 文件，配置必要的环境变量：

```env
# 数据库配置
MONGODB_URI=mongodb://localhost:27017/techfinx
REDIS_URL=redis://localhost:6379

# API配置
API_BASE_URL=http://localhost:8000/api
SCRAPER_API_KEY=your-api-key

# Twitter配置
TWITTER_API_KEY=your-twitter-api-key
TWITTER_API_SECRET=your-twitter-api-secret
TWITTER_ACCESS_TOKEN=your-twitter-access-token
TWITTER_ACCESS_SECRET=your-twitter-access-secret
TWITTER_BEARER_TOKEN=your-twitter-bearer-token

# Google News配置
GOOGLE_NEWS_API_KEY=your-google-news-api-key

# 其他配置
LOG_LEVEL=INFO
LOG_FILE=./logs/scraper.log
```

### 3. 创建必要目录

```bash
mkdir -p logs
mkdir -p uploads
```

## 🎯 使用方法

### 命令行使用

```bash
# 运行一次抓取
python main.py --mode once

# 运行特定源的抓取
python main.py --mode once --sources twitter rss

# 使用自定义关键词
python main.py --mode once --keywords "artificial intelligence" "machine learning"

# 限制文章数量
python main.py --mode once --max-articles 50

# 启动定时调度器
python main.py --mode scheduler

# 查看状态
python main.py --mode status

# 查看统计信息
python main.py --mode stats --hours 24

# 重置统计信息
python main.py --reset-stats
```

### 编程使用

```python
import asyncio
from scraper_manager import scraper_manager

async def main():
    # 运行一次抓取
    result = await scraper_manager.run_scraping()
    print(f"抓取结果: {result}")
    
    # 运行特定源
    result = await scraper_manager.run_single_scraper('twitter')
    print(f"Twitter抓取结果: {result}")
    
    # 获取状态
    status = await scraper_manager.get_status()
    print(f"状态: {status}")

asyncio.run(main())
```

## 📊 抓取器详情

### Twitter抓取器

- **功能**: 抓取Twitter上的AI和金融科技相关内容
- **配置**: 需要Twitter API凭据
- **关键词**: 可配置抓取关键词
- **限制**: 受Twitter API限制

### RSS抓取器

- **功能**: 抓取RSS源的内容
- **源**: 支持多个RSS源
- **解析**: 自动解析RSS内容
- **图片**: 自动提取文章图片

### Google News抓取器

- **功能**: 抓取Google News相关内容
- **API**: 支持Google News API
- **网页**: 支持网页抓取模式
- **分类**: 自动分类新闻内容

## 🔧 配置说明

### 抓取配置

```python
# 启用/禁用抓取源
enabled_sources = ['twitter', 'rss', 'news']

# 抓取间隔（分钟）
run_interval = 30

# 最大工作线程
max_workers = 4

# 重试次数
retry_attempts = 3
```

### 内容过滤

```python
# 最小内容长度
min_content_length = 100

# 最大内容长度
max_content_length = 10000

# 重复检测阈值
duplicate_threshold = 0.8

# 自动发布
auto_publish = False
```

### 质量评分

```python
# 评分权重
quality_weights = {
    'title_length': 0.1,
    'content_length': 0.2,
    'keyword_density': 0.2,
    'readability': 0.2,
    'image_count': 0.1,
    'link_count': 0.1,
    'freshness': 0.1
}
```

## 📈 监控和日志

### 日志配置

- **级别**: DEBUG, INFO, WARNING, ERROR
- **文件**: 自动轮转，最大10MB
- **保留**: 保留最近5个文件

### 统计信息

- **抓取统计**: 成功/失败次数，文章数量
- **质量统计**: 平均质量评分
- **错误统计**: 错误类型和频率

### 监控指标

- **运行状态**: 是否正在运行
- **最后运行**: 上次运行时间
- **下次运行**: 下次运行时间
- **错误日志**: 最近的错误信息

## 🚀 部署

### Docker部署

```dockerfile
FROM python:3.9-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .
CMD ["python", "main.py", "--mode", "scheduler"]
```

### 系统服务

```ini
[Unit]
Description=TechfinX Content Scraper
After=network.target

[Service]
Type=simple
User=scraper
WorkingDirectory=/opt/scraper
ExecStart=/opt/scraper/venv/bin/python main.py --mode scheduler
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

### 定时任务

```bash
# 添加到crontab
# 每小时运行一次
0 * * * * /opt/scraper/venv/bin/python /opt/scraper/main.py --mode once

# 每天凌晨2点运行
0 2 * * * /opt/scraper/venv/bin/python /opt/scraper/main.py --mode once --sources rss news
```

## 🔍 故障排除

### 常见问题

1. **API限制**: 检查API密钥和限制
2. **网络问题**: 检查网络连接和代理设置
3. **数据库连接**: 检查MongoDB和Redis连接
4. **内存不足**: 调整max_workers参数

### 调试模式

```bash
# 启用调试日志
export LOG_LEVEL=DEBUG
python main.py --mode once

# 查看详细错误
python main.py --mode once --sources twitter 2>&1 | tee debug.log
```

### 性能优化

1. **调整并发数**: 根据系统资源调整max_workers
2. **优化缓存**: 调整Redis缓存配置
3. **数据库索引**: 确保MongoDB有适当的索引
4. **网络优化**: 使用CDN或代理

## 📚 API文档

### 抓取器管理器API

```python
# 运行抓取
await scraper_manager.run_scraping(sources=['twitter'], max_articles=100)

# 获取状态
status = await scraper_manager.get_status()

# 获取统计
stats = await scraper_manager.get_articles_stats(hours=24)
```

### 配置API

```python
# 获取配置
config = scraper_manager.get_config()

# 更新配置
scraper_manager.update_config(new_config)
```

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支
3. 提交更改
4. 推送到分支
5. 创建 Pull Request

## 📄 许可证

MIT License

## 📞 支持

如有问题，请提交 Issue 或联系开发团队。
