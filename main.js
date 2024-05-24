const db = require('./database');
const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

function isJSONObject(input) {
    return typeof input === 'object' && input !== null && !Array.isArray(input);
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
app.post('/update-key', (req, res) => {
    try {

        // 获取请求参数
        const { key } = req.body;

        console.log(req.body);

        // 校验参数
        if (!key) {
            res.status(400).json({ detail: 'key is required' });
            return;
        }

        db.updateRecord('channels', { id: 1 }, {key: key}, async (err, result) => {
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

// 获取日志
app.get('/logs', async (req, res) => {
    try {

        db.getAll('logs', {}, async (err, result) => {
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

// 获取其他表的所有记录
app.post('/all', async (req, res) => {
    try {

        const { table } = req.body;

        if (!table) {
            res.status(400).json({ detail: 'table is required' });
            return;
        }

        db.getAll(table, {}, async (err, result) => {
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


// 更新其他表的记录
app.post('/update', async (req, res) => {
    try {

        const { table, conditions, data } = req.body;

        if (!table) {
            res.status(400).json({ detail: 'table is required' });
            return;
        }

        if (!conditions) {
            res.status(400).json({ detail: 'conditions is required' });
            return;
        }

        if (!data) {
            res.status(400).json({ detail: 'data is required' });
            return;
        }

        if(isJSONObject(data)) {
            res.status(400).json({ detail: 'data must be a JSON object' });
            return;
        }

        let conditionsWhere = isJSONObject(conditions) ? conditions : JSON.parse(conditions);
        let dataToUpdate = isJSONObject(data)? data : JSON.parse(data);

        db.updateRecord(table, conditionsWhere, dataToUpdate, async (err, result) => {
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


// 启动服务器
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});


// res.type('txt');  // Content-Type: text/plain
// res.type('html'); // Content-Type: text/html
// res.type('json'); // Content-Type: application/json
// res.type('text/event-stream'); // Content-Type: text/event-stream