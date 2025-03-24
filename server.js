const express = require('express');
const mysql = require('mysql');
const crypto = require('crypto');

const port = process.env.PORT || 3000;
const app = express();
app.use(express.json());

var connection = mysql.createConnection({
    host: 'sql5.freesqldatabase.com',
    user: 'sql5769203',
    password: 'pbD81yj5R1',
    database: 'sql5769203'
});


app.post('/api/signup', (req, res) => {
    const { username, password } = req.body;
    const pwd = encryptPassword(password);
    const date = transformDate(new Date());
    connection.query('INSERT INTO user (username, password, signedup) VALUES (?, ?, ?)', [username, pwd, date], function (error, results, fields) {
        if (error) {
            console.error('Database query error: ', error);
            return res.status(500).json({ success: false, message: 'Database query failed', error: error.sqlMessage });
        }
        res.json({
            success: true,
            data: {
                username: username,
                encryptPassword: pwd,
                date: date
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
    console.log(`Server running on port ${port}`);
});

function encryptPassword(password) {
    return crypto.createHash('sha256').update(password).digest('hex');
}

function transformDate(date) {
    return date.toISOString().slice(0, 19).replace('T', ' ');
}