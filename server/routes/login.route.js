const express = require('express');
const router = express.Router();
const bl = require('../bl/login.bl');
const jwt = require('jsonwebtoken');
const atob = require('atob');
const SEKRET_KEY_JWT = "4rfu40rjf48urnf34u40fu8j04fj34fu9r4jnu94";

router.post("/", function (req, res) {
    let { user, pass } = req.body;
    user = atob(user);
    pass = atob(pass);
    bl.compareLogin(user, pass, function (e, _user) {
        if (e) {
            return res.status(500).send();
        } else {
            if (_user === "error") {
                const data = {
                    token: ""
                }
                return res.status(401).send(data);
            } else {
                const token = jwt.sign({
                    user: user,
                }, SEKRET_KEY_JWT,
                    {
                        expiresIn: 10000
                    });
                const data = {
                    user: _user,
                    token: token
                }
                return res.send(data);
            }
        }
    })
})

module.exports = router;