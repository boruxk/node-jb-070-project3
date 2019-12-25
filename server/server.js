const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const SEKRET_KEY_JWT = "4rfu40rjf48urnf34u40fu8j04fj34fu9r4jnu94";
const cors = require("cors");
const app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
const mysql = require('mysql');
app.use(cors());
const PORT = 3200;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var publicDir = require('path').join(__dirname, '/public');
app.use(express.static(publicDir));


//check token before render 
app.use(function (req, res, next) {
    if (req.method === 'POST' && req.path === '/register' || req.method === 'POST' && req.path === '/login') {
        next();
    } else {
        if (req.headers.authorization) {
            const token = req.headers.authorization.split(" ")[1];
            try {
                const a = jwt.verify(token, SEKRET_KEY_JWT);
                next();
            } catch (ex) {
                res.status(401).send();
            }
        } else {
            res.status(401).send();
        }
    }
})

// Make io accessible to router
app.use(function (req, res, next) {
    req.io = io;
    next();
});

/*
io.on('connection', function (socket) {
    var initial_result;
    setInterval(function () {
        let query = "SELECT * FROM following";
        const db = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'vocations'
        });
        db.connect((err) => {
            if (err) throw err;
            db.query(query, (err, result) => {
                if (err) { callback('error'); }
                else {
                    console.log(result);
                    console.log(initial_result);
                    console.log("-------------------");
                    if (result != initial_result) {
                        socket.emit('follow', result);
                    }
                    initial_result = result;
                }
                db.end();
            });
        });
    }, 1000)
});*/

const login = require('./routes/login.route');
const register = require('./routes/register.route');
const vacations = require('./routes/vacation.route');
const follow = require('./routes/follow.route');
app.use('/login', login);
app.use('/register', register);
app.use('/vacations', vacations);
app.use('/follow', follow);

app.listen(process.env.PORT || PORT, () =>
    console.log(`App listening on port ${PORT}!`),
);

http.listen(3100, function () {
    console.log('listening on *:3100');
});