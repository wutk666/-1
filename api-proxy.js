/**
 * Christmas Tree API Proxy Server - OpenRouter Edition
 * 使用 OpenRouter SDK 提供 API 代理服务
 */

import express from 'express';
import cors from 'cors';
import { OpenRouter } from '@openrouter/sdk';

const app = express();
const PORT = 3000;

// OpenRouter 配置
const openrouter = new OpenRouter({
  apiKey: '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'
});

// 中间件
app.use(cors());
app.use(express.json());

// 健康检查
app.get('/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        message: 'Christmas Tree API Proxy (OpenRouter) is running',
        timestamp: new Date().toISOString()
    });
});

// 生成祝福（非流式）
app.post('/api/generate-wish-simple', async (req, res) => {
    try {
        const { topic } = req.body;
        console.log(`📝 Generating wish for: ${topic}`);
        
        const completion = await openrouter.chat.send({
            model: 'deepseek/deepseek-r1-0528:free',
            messages: [
                {
                    role: 'system',
                    content: '你是一个富有诗意的圣诞助手。用中文写一段简短、奢华、温暖的圣诞祝福。最多50字。语气要充满魔法和优雅。'
                },
                {
                    role: 'user',
                    content: `为${topic}写一段圣诞祝福`
                }
            ],
            stream: false,
            max_tokens: 200
        });

        const content = completion.choices[0].message.content;
        console.log('✅ Generated:', content.substring(0, 50) + '...');
        
        res.json({ 
            content: content,
            model: 'deepseek/deepseek-r1-0528:free'
        });

    } catch (error) {
        console.error('❌ Error:', error.message);
        res.status(500).json({ 
            error: error.message,
            fallback: true
        });
    }
});

// 生成祝福（流式 SSE）
app.post('/api/generate-wish', async (req, res) => {
    try {
        const { topic } = req.body;
        console.log(`📝 Generating wish (streaming) for: ${topic}`);
        
        // 设置 SSE 响应头
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        
        const stream = await openrouter.chat.send({
            model: 'deepseek/deepseek-r1-0528:free',
            messages: [
                {
                    role: 'system',
                    content: '你是一个富有诗意的圣诞助手。用中文写一段简短、奢华、温暖的圣诞祝福。最多50字。语气要充满魔法和优雅。'
                },
                {
                    role: 'user',
                    content: `为${topic}写一段圣诞祝福`
                }
            ],
            stream: true,
            max_tokens: 200
        });

        for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content;
            if (content) {
                // 发送 SSE 格式数据
                res.write(`data: ${JSON.stringify({ content })}\n\n`);
            }
        }
        
        res.write('data: [DONE]\n\n');
        res.end();
        console.log('✅ Stream complete');

    } catch (error) {
        console.error('❌ Error:', error.message);
        res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
        res.end();
    }
});

// 启动服务器
app.listen(PORT, () => {
    console.log(`
╔════════════════════════════════════════════╗
║   🎄 Christmas Tree API Proxy 🎄          ║
║   Powered by OpenRouter + DeepSeek        ║
║                                            ║
║   Server: http://localhost:${PORT}           ║
║                                            ║
║   Endpoints:                               ║
║   - GET  /health                           ║
║   - POST /api/generate-wish-simple         ║
║   - POST /api/generate-wish (streaming)    ║
║                                            ║
║   Model: deepseek/deepseek-r1-0528:free   ║
║   Press Ctrl+C to stop                     ║
╚════════════════════════════════════════════╝
    `);
});

