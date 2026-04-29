const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3333;
const DATA_FILE = path.join(__dirname, 'ideas.json');

app.use(express.json());
app.use(express.static('public'));

// 初始化数据文件
if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify({ ideas: [] }, null, 2));
}

// 读取数据
function readData() {
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(data);
}

// 写入数据
function writeData(data) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// 生成 ID
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}

// API: 获取所有想法
app.get('/api/ideas', (req, res) => {
    const data = readData();
    // 按时间倒序排序
    data.ideas.sort((a, b) => b.createdAt - a.createdAt);
    res.json(data);
});

// API: 添加想法
app.post('/api/ideas', (req, res) => {
    const { content, tags, priority } = req.body;
    if (!content || content.trim() === '') {
        return res.status(400).json({ error: '内容不能为空' });
    }
    
    const data = readData();
    const idea = {
        id: generateId(),
        content: content.trim(),
        tags: tags || [],
        priority: priority || 'low',
        completed: false,
        createdAt: Date.now(),
        updatedAt: Date.now()
    };
    
    data.ideas.unshift(idea);
    writeData(data);
    
    res.json({ success: true, idea });
});

// API: 更新想法
app.put('/api/ideas/:id', (req, res) => {
    const { id } = req.params;
    const { content, tags, completed, priority } = req.body;
    
    const data = readData();
    const idea = data.ideas.find(i => i.id === id);
    
    if (!idea) {
        return res.status(404).json({ error: '想法不存在' });
    }
    
    if (content !== undefined) idea.content = content.trim();
    if (tags !== undefined) idea.tags = tags;
    if (completed !== undefined) idea.completed = completed;
    if (priority !== undefined) idea.priority = priority;
    idea.updatedAt = Date.now();
    
    writeData(data);
    res.json({ success: true, idea });
});

// API: 删除想法
app.delete('/api/ideas/:id', (req, res) => {
    const { id } = req.params;
    
    const data = readData();
    const index = data.ideas.findIndex(i => i.id === id);
    
    if (index === -1) {
        return res.status(404).json({ error: '想法不存在' });
    }
    
    data.ideas.splice(index, 1);
    writeData(data);
    
    res.json({ success: true });
});

// API: 获取所有标签
app.get('/api/tags', (req, res) => {
    const data = readData();
    const tagMap = {};
    
    data.ideas.forEach(idea => {
        idea.tags.forEach(tag => {
            tagMap[tag] = (tagMap[tag] || 0) + 1;
        });
    });
    
    const tags = Object.entries(tagMap)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count);
    
    res.json({ tags });
});

// API: 导入数据
app.post('/api/import', (req, res) => {
    const { ideas } = req.body;
    
    if (!ideas || !Array.isArray(ideas)) {
        return res.status(400).json({ error: '无效的导入数据' });
    }
    
    const data = readData();
    let importedCount = 0;
    
    ideas.forEach(idea => {
        // 验证必要字段
        if (!idea.content || !idea.id) return;
        
        // 检查 ID 是否已存在
        if (data.ideas.some(i => i.id === idea.id)) return;
        
        // 添加想法
        data.ideas.push({
            id: idea.id,
            content: idea.content.trim(),
            tags: idea.tags || [],
            priority: idea.priority || 'low',
            completed: idea.completed || false,
            createdAt: idea.createdAt || Date.now(),
            updatedAt: idea.updatedAt || Date.now()
        });
        importedCount++;
    });
    
    // 按时间倒序排序
    data.ideas.sort((a, b) => b.createdAt - a.createdAt);
    writeData(data);
    
    res.json({ success: true, importedCount });
});

// API: 健康检查
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: Date.now() });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`📝 Ideas Server running at http://localhost:${PORT}`);
});
