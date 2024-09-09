const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const http = require('http');
require('dotenv').config();

const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
});

db.connect(err => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL database');
});

// Route to handle form submission
app.post('/api/contacts', (req, res) => {
    const { firstname, lastname, email, phone, message } = req.body;
    const sql = `
        INSERT INTO customers (firstname, lastname, email, phone, message)
        VALUES (?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
            firstname = VALUES(firstname),
            lastname = VALUES(lastname),
            phone = VALUES(phone),
            message = VALUES(message);
    `;

    db.query(sql, [firstname, lastname, email, phone, message], (err, result) => {
        if (err) {
            console.error('Error saving data:', err);
            res.status(500).send('Error saving data');
            return;
        }
        res.send('Contact saved successfully');
    });
});

// Route to fetch all contacts
app.get('/api/contacts', (req, res) => {
    const sql = 'SELECT * FROM customers';
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error fetching data:', err);
            res.status(500).send('Error fetching data');
            return;
        }
        res.json(results);
    });
});

const server = http.createServer(app);

server.listen(port, () => {
    console.log(`Server running on ${port}`);
});
