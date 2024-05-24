// database.js

const mysql = require('mysql2');

// 创建数据库连接池
const pool = mysql.createPool({
    host: '127.0.0.1',
    user: 'root',
    port: 3308,
    password: '123456',
    database: 'oneapi',
    waitForConnections: true,
    connectionLimit: 1000,
    queueLimit: 0
});


// 获取所有记录
function getAll(table, callback) {
    pool.query(`SELECT * FROM ${table}`, (error, results) => {
        callback(error, results);
    });
}

// 通过条件获取记录
function getRecord(table, conditions, callback) {
    const keys = Object.keys(conditions);
    const values = Object.values(conditions);

    // 构建WHERE子句
    const whereClause = keys.map(key => `${key} = ?`).join(' AND ');

    const query = `SELECT * FROM ${table} WHERE ${whereClause}`;
    pool.query(query, values, (error, results) => {
        if (error) {
            callback(error, null);
            return;
        }
        callback(null, results[0]);
    });
}

// 添加记录
function addRecord(table, data, callback) {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const placeholders = keys.map(() => '?').join(', ');  // 为每个值创建一个占位符

    // 用反引号包裹表名和列名
    const escapedKeys = keys.map(key => `\`${key}\``).join(', ');
    const query = `INSERT INTO \`${table}\` (${escapedKeys}) VALUES (${placeholders})`;

    pool.query(query, values, (error, results) => {
        if (error) {
            console.error('Error executing query:', error);
            callback(error, null);  // 传递错误给回调函数
            return;
        }
        callback(null, results);
    });
}

// 更新记录
function updateRecord(table, conditions, data, callback) {
    const dataEntries = Object.entries(data);
    const conditionEntries = Object.entries(conditions);

    // Generate the SET part of the query
    const updates = dataEntries.map(([key, val]) => `\`${key}\` = ?`).join(', ');

    // Generate the WHERE part of the query
    const whereClause = conditionEntries.map(([key, val]) => `\`${key}\` = ?`).join(' AND ');

    // Combine values for SET and WHERE parts
    const values = [...dataEntries.map(entry => entry[1]), ...conditionEntries.map(entry => entry[1])];

    const query = `UPDATE \`${table}\` SET ${updates} WHERE ${whereClause}`;

    pool.query(query, values, (error, results) => {
        if (error) {
            return callback(error, null);
        }

        callback(null, results);
    });
}

// 删除记录
function deleteRecord(table, id, callback) {
    pool.query(`DELETE FROM ${table} WHERE conversation_id = ?`, [id], (error, results) => {
        if (error) {
            return callback(error, null);
        }

        callback(null, results);
    });
}

module.exports = {
    getAll,
    getRecord,
    addRecord,
    updateRecord,
    deleteRecord
};
