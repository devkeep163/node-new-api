const express = require('express');
const db = require('./database');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

function isValidJson(str) {
    try {
        JSON.parse(str);
        return true;
    } catch (e) {
        return false;
    }
}

// 获取令牌
app.get('/key', async (req, res) => {
    try {

        db.getRecord('channels', { id: 1 }, async (err, result) => {
            if (err) {
                res.status(400).json(err);
            }
            if (result) {
                res.status(200).json(result);
            } 
        });
    } catch (error) {
        console.log(error);
        res.status(400).json({ detail: error.message });
    }
});

// 更新令牌
app.post('/update-key', async (req, res) => {
    try {

        // 获取请求参数
        const { key } = req.body;

        console.log(req.body);

        // 校验参数
        if (!key) {
            res.status(400).json({ detail: 'Key is required' });
            return;
        }

        db.updateRecord('channels', { id: 1 }, async (err, result) => {
            if (err) {
                res.status(400).json(err);
            }
            if (result) {
                res.status(200).json(result);
            } 
        });
    } 
    catch (error) 
    {
        res.status(429).json({ detail: error.message });
    }
});

// 启动服务器
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});


// res.type('txt');  // Content-Type: text/plain
// res.type('html'); // Content-Type: text/html
// res.type('json'); // Content-Type: application/json
// res.type('text/event-stream'); // Content-Type: text/event-stream