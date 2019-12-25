const mysql = require('mysql');

function readAll(query, callback) {
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
                const data = result;
                callback(null, data);
            }
            db.end();
        });
    });
}

function readOne(query, callback) {
    const db = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'vocations'
    });
    db.connect((err) => {
        if (err) throw err;
        db.query(query, (err, result) => {
            if (err || result.length === 0) { 
                callback(null, 'error'); 
            }
            else {
                let [dataOne] = result;
                callback(null, dataOne);
            }
            db.end();
        });
    });
}

function saveOne(query, callback) {
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
            else { callback(null, result); }
            db.end();
        });
    });
}

function updateOne(query, callback) {
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
            else { callback(null, result); }
            db.end();
        });
    });
}

function deleteOne(query, callback) {
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
            else { callback(null); }
            db.end();
        });
    });
}

module.exports.readAll = readAll;
module.exports.readOne = readOne;
module.exports.saveOne = saveOne;
module.exports.updateOne = updateOne;
module.exports.deleteOne = deleteOne;