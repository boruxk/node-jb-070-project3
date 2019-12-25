const express = require('express');
const router = express.Router();
const bl = require('../bl/vacation.bl');
const multer = require('multer');
const upload = multer({ dest: 'public/uploads/' });
const fs = require("fs");
const uuidv4 = require('uuid/v4');

router.get('/', (req, res) => {
    bl.getVacations(function (e, data) {
        if (e) {
            return res.status(500).send();
        } else {
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

router.post('/', upload.single('image'), (req, res) => {
    let fileName = uuidv4() + ".jpg";
    fs.rename('./public/uploads/' + req.file.filename, './public/uploads/' + fileName, function (err) {
        if (err) console.log('ERROR: ' + err);
        let newData = req.body;
        newData.image = fileName;
        bl.createVacation(newData, function (e, data) {
            if (e) {
                return res.status(500).send();
            } else {
                data.status = 200;
                return res.send(data);
            }
        })
    });
});

router.post('/:id', upload.single('image'), (req, res) => {
    if (req.file === undefined) {
        let newData = req.body;
        bl.updateVacation(newData, function (e, data) {
            if (e) {
                return res.status(500).send();
            } else {
                data.status = 200;
                return res.send(data);
            }
        })
    } else {
        let fileName = uuidv4() + ".jpg";
        fs.rename('./public/uploads/' + req.file.filename, './public/uploads/' + fileName, function (err) {
            if (err) console.log('ERROR: ' + err);
            let newData = req.body;
            newData.image = fileName;
            bl.updateVacation(newData, function (e, data) {
                if (e) {
                    return res.status(500).send();
                } else {
                    data.status = 200;
                    return res.send(data);
                }
            })
        });
    }
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
