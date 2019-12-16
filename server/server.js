const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const SEKRET_KEY_JWT = "4rfu40rjf48urnf34u40fu8j04fj34fu9r4jnu94";
const cors = require("cors");
const app = express();
app.use(cors());
const PORT = 3200;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var publicDir = require('path').join(__dirname, '/public');
app.use(express.static(publicDir));

//check token before render 
app.use(function (req, res, next) {
    if (req.method === 'POST' && req.path === '/register' || req.method === 'POST' && req.path === '/login' || req.method === 'GET' && req.path === '/car') {
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

const login = require('./routes/login.route');
const register = require('./routes/register.route');
//const vocations = require('./routes/vocations');
app.use('/login', login);
app.use('/register', register);
//app.use('/vocations', vocations);

app.listen(process.env.PORT || PORT, () =>
    console.log(`App listening on port ${PORT}!`),
);