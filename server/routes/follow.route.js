const express = require('express');
const router = express.Router();
const bl = require('../bl/follow.bl');

router.get('/', (req, res) => {
    bl.getFollow(function (e, data) {
        if (e) {
            return res.status(500).send();
        } else {  
            req.io.emit('follow', data);
            return res.send(data);
        }
    })
});

router.get('/:id', (req, res) => {
    let id = req.params.id;
    bl.getVacation(id, function (e, data) {
        if (e) {
            return res.status(500).send();
        } else {
            return res.send(data);
        }
    })
});

router.post('/', (req, res) => {
    let newData = req.body;
    bl.createFollow(newData, function (e, data) {
        if (e) {
            return res.status(500).send();
        } else {
            bl.getFollow(function (e, data) {
                if (e) {
                    return res.status(500).send();
                } else {
                    req.io.emit('follow', data);
                    data.status = 200;
                    return res.send(data);
                }
            })
        }
    })
});

router.post('/:id', (req, res) => {
    let newData = req.body;
    bl.updateVacation(newData, function (e, data) {
        if (e) {
            return res.status(500).send();
        } else {
            data.status = 200;
            return res.send(data);
        }
    })
});

router.delete('/:id', (req, res) => {
    let id = req.params.id;
    bl.deleteVacation(id, function (e, data) {
        if (e) {
            return res.status(500).send();
        } else {
            return res.send(data);
        }
    })
});

module.exports = router;
