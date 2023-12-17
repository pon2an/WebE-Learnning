const express = require('express');
const app = express();
const fs = require('fs');
const hostname = 'localhost';
const port = 3006;
const bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
const multer = require('multer');
const path = require('path');
const mysql = require('mysql');
app.use(express.static(__dirname));
// app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
      callback(null, 'public/img/');
    },

    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
  });

const imageFilter = (req, file, cb) => {
    // Accept images only
    if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
        req.fileValidationError = 'Only image files are allowed!';
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};

// ใส่ค่าตามที่เราตั้งไว้ใน mysql
const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "ponddb"
})

con.connect(err => {
    if(err) throw(err);
    else{
        console.log("MySQL connected");
    }
})

const queryDB = (sql) => {
    return new Promise((resolve,reject) => {
        // query method
        con.query(sql, (err,result, fields) => {
            if (err) reject(err);
            else
                resolve(result)
        })
    })
}

app.post('/regisDB', async (req,res) => {
    var sql = "CREATE TABLE IF NOT EXISTS user_info (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255), email VARCHAR(100), password VARCHAR(100),c_password VARCHAR(100),img VARCHAR(100))";
    var result = await queryDB(sql);
    sql = `INSERT INTO user_info (name, email, password,img) VALUES ("${req.body.name}", "${req.body.email}", "${req.body.password}","${req.body.img}")`;
    result = await queryDB(sql);
    console.log("New record created successfully one");
    console.log(req.body.name,req.body.email,req.body.password,req.body.img);
    return res.redirect('login.html');
    
})

app.post('/checkLogin',async (req,res) => {
    
    var input =  await req.body;
    var sql = `SELECT id, email, password FROM userInfo`;
    var result = await queryDB(sql);
    result = Object.assign({},result);
    var keys = Object.keys(result);

    for(var i =0; i< keys.length ;i++)
    {
        if(input.email == result[keys[i]].email &&  input.password == result[keys[i]].password){
            res.cookie('email',input.username);
            res.cookie('password',result[keys[i]].img);
            return res.redirect('home.html');
        }
    }
    return res.redirect('/DESIGN/Login.html?error=1');
})

 app.listen(port, hostname, () => {
        console.log(`Server running at   http://${hostname}:${port}/register.html`);
});
