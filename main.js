const express = require('express');
const axios = require('axios');
const path = require('path');
const db = require('./database');

const app = express();
const PORT = 3000;
const UPSTREAM_URL = 'http://127.0.0.1:8300';

app.use(express.json());
app.use(express.text());

function isValidJson(str) {
    try {
        JSON.parse(str);
        return true;
    } catch (e) {
        return false;
    }
}

// 获取令牌
app.get('/get-key', async (req, res) => {
    try {

        db.getRecord('chat_conversation_detail', { conversation_id: conversation_id }, async (err, result) => {
            if (err) {
                console.log(err);
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



// 修改标题接口
app.post('/backend-api/conversation/gen_title/:id', async (req, res) => {
    try {
        const response = await axios({
            method: req.method,
            url: UPSTREAM_URL + req.url,
            headers: req.headers,
            data: req.body,
            responseType: 'stream'
        });
        res.status(response.status);
        res.set(response.headers);
        response.data.pipe(res);
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