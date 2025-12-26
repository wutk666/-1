import { OpenRouter } from '@openrouter/sdk';

const openrouter = new OpenRouter({
  apiKey: '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'
});

// 测试：生成圣诞祝福
async function generateChristmasWish(topic) {
  try {
    console.log(`🎄 为 "${topic}" 生成圣诞祝福...`);
    
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

    const wish = completion.choices[0].message.content;
    console.log('\n✨ 生成的祝福：\n');
    console.log(wish);
    console.log('\n');
    return wish;
    
  } catch (error) {
    console.error('❌ 错误:', error.message);
    console.error('详细信息:', error);
    throw error;
  }
}

// 流式生成示例
async function generateChristmasWishStreaming(topic) {
  try {
    console.log(`🎄 为 "${topic}" 生成圣诞祝福（流式）...`);
    
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

    console.log('\n✨ 生成的祝福：\n');
    let fullText = '';
    
    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content;
      if (content) {
        process.stdout.write(content);
        fullText += content;
      }
    }
    
    console.log('\n');
    return fullText;
    
  } catch (error) {
    console.error('❌ 错误:', error.message);
    console.error('详细信息:', error);
    throw error;
  }
}

// 运行测试
console.log('═══════════════════════════════════════');
console.log('🎄 圣诞树 AI 祝福生成器 - OpenRouter SDK');
console.log('═══════════════════════════════════════\n');

// 测试非流式
await generateChristmasWish('朋友');

// 测试流式
await generateChristmasWishStreaming('家人');
