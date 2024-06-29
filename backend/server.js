const express = require('express');
const puppeteer = require('puppeteer');
const winston = require('winston');
const { body, validationResult } = require('express-validator');

const app = express();
const port = process.env.PORT || 3001;

// 配置日志
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'screenshot-service' },
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));
}

app.use(express.json());

// 根路径路由
app.get('/', (req, res) => {
  res.send('<h1>截图服务</h1><p>请使用POST请求到 /api/capture 以获取网页截图</p>');
});

// 输入验证中间件
const validateUrl = [
  body('url').isURL().withMessage('请提供有效的URL'),
  body('waitTime').optional().isInt({ min: 0 }).withMessage('请提供有效的等待时间（毫秒）'),
];

app.post('/api/capture', validateUrl, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { url, device, waitTime } = req.body;

  logger.info(`Received screenshot request for URL: ${url}, Device: ${device}, WaitTime: ${waitTime}`);

  let browser;
  try {
    browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const page = await browser.newPage();

    if (device === 'mobile') {
      await page.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1');
      await page.setViewport({ width: 375, height: 812, isMobile: true });
    } else {
      await page.setViewport({ width: 1920, height: 1080 });
    }

    await page.goto(url, { waitUntil: 'networkidle0', timeout: 120000 });

    // 自动滚动并确保所有内容加载完毕
    await autoScroll(page);

    // 等待自定义时间
    if (waitTime) {
      await page.waitForTimeout(waitTime);
    }

    // 滚动回页面顶部
    await page.evaluate(() => window.scrollTo(0, 0));

    const screenshot = await page.screenshot({ fullPage: true });

    res.contentType('image/png');
    res.send(screenshot);

    logger.info(`Successfully captured screenshot for URL: ${url}`);
  } catch (error) {
    logger.error(`Error capturing screenshot for URL: ${url}`, { error });
    res.status(500).json({ error: '获取截图时出错，请稍后重试' });
  } finally {
    if (browser) {
      await browser.close();
    }
  }
});

// 自动滚动函数
async function autoScroll(page) {
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let totalHeight = 0;
      const distance = 100;
      const timer = setInterval(() => {
        window.scrollBy(0, distance);
        totalHeight += distance;

        // 等待图片和其他资源加载完毕
        const images = Array.from(document.images);
        const allLoaded = images.every(img => img.complete && img.naturalHeight !== 0);

        if (totalHeight >= document.body.scrollHeight || allLoaded) {
          clearInterval(timer);
          resolve();
        }
      }, 200);
    });
  });
}

// 错误处理中间件
app.use((err, req, res, next) => {
  logger.error('Unhandled error', { error: err });
  res.status(500).json({ error: '服务器内部错误，请稍后重试' });
});

const server = app.listen(port, () => {
  logger.info(`Server is running on port ${port}`);
});

// 优雅关闭
process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    logger.info('HTTP server closed');
    process.exit(0);
  });
});