const express = require('express');
const mysql = require('mysql');
const crypto = require('crypto');

const port = process.env.port || 3000;
const app = express();

var connection = mysql.createConnection({
    host: 'sql5.freesqldatabase.com',
    user: 'sql5769203',
    password: 'pbD81yj5R1',
    database: 'sql5769203'
});

app.get('/api/signup', async (req, res) => {
    const { username, password } = req.body;
    const pwd = encryptPassword(password);
    const date = transformDate(new Date());
    connection.connect();
    connection.query('INSERT INTO user (username, password, date) VALUES (?, ?, ?)', [username, pwd, date], function (error, results, fields) {
        connection.end();
        if (error) throw error;
        res.json({
            success: true,
            data: {
                username:username,
                encryptPassword:pwd,
                date:date
            }
        });
    });
});

app.get('/', async (req, res) => {
    connection.connect();
    connection.query('SELECT * from budget', function (error, results, fields) {
        connection.end();
        if (error) throw error;
        res.json(results);
    });
});

app.listen(port, () => {
    console.log(`Server on the port ${port}`);
});

function encryptPassword(password) {
    return crypto.createHash('sha256').update(password).digest('hex');
}

function transformDate(date) {
    return date.toISOString().slice(0, 19).replace('T', ' ');
}