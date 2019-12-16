const express = require('express');
const router = express.Router();
const bl = require('../bl/register.bl');
const atob = require('atob');

router.post("/", function (req, res) {
    let { fname, lname, user, pass } = req.body;
    fname = atob(fname);
    lname = atob(lname);
    user = atob(user);
    pass = atob(pass);
    bl.compareReg(fname, lname, user, pass, function (e, _user) {
        if (e) {
            return res.status(500).send();
        } else {
            if (_user.id) {
                _user.password = ""; //protect pass from being reached to client 
            }
            return res.send(_user);
        }
    })
})

module.exports = router;