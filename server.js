const express = require('express');
const app = express();
const fs = require('fs');
const hostname = 'localhost';
const port = 3006;
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const multer = require('multer');
const path = require('path');
const mysql = require('mysql');

app.use(express.static(__dirname));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'public/img/');
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({ storage: storage });

const con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'ponddb',
});

con.connect((err) => {
    if (err) throw err;
    console.log('MySQL connected');
});

const queryDB = (sql, values) => {
    return new Promise((resolve, reject) => {
        con.query(sql, values, (err, result, fields) => {
            if (err) reject(err);
            else resolve(result);
        });
    });
};

app.post('/regisDB', upload.single('img'), async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!req.file) {
            return res.status(400).send('Image file is required');
        }
        const img = req.file.filename;

        const sql = 'INSERT INTO user_info (name, email, password, img) VALUES (?, ?, ?, ?)';
        const result = await queryDB(sql, [name, email, password, img]);
        console.log('New record created successfully');
        return res.redirect('login.html');
    } catch (error) {
        console.error('Error during registration:', error);
        return res.status(500).send('Internal Server Error');
    }
});

app.post('/checkLogin', upload.none(), async (req, res) => {
    try {
        const { email, password } = req.body;
        const sql = 'SELECT id, email, password FROM user_info WHERE email = ?';
        const result = await queryDB(sql, [email]);

        if (result.length > 0) {
            const user = result[0];
            if (password === user.password) {
                res.cookie('userId', user.id, { maxAge: 3600000 });
                return res.redirect('/home.html');
            }
        }
        return res.status(400).send('Invalid email or password.');
    } catch (error) {
        console.error('Error during login:', error);
        return res.status(500).send('Internal Server Error');
    }
});

// app.listen(port, hostname, () => {
//     console.log('Server running at http://${hostname}:${port}/register.html');
// });

app.listen(port, hostname, () => {
    console.log(`Server running at   http://${hostname}:${port}/register.html`);
});