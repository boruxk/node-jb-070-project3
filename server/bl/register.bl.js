const dal = require('../dal');

function compareReg(fname, lname, user, pass, callback) {
    let query = `SELECT * FROM user WHERE username LIKE '${user}'`;
    dal.readOne(query, function (err, _user) {
        if (err) {
            callback(err);
        } else {
            if (_user === "error") {
                //user not found, so proceed registration
                let query2 = `INSERT INTO user (firstname, lastname, username, password) VALUES ('${fname}', '${lname}', '${user}', '${pass}')`;
                dal.saveOne(query2, function (err, _user) {
                    if (err) {
                        callback(err);
                    } else {
                        callback(null, _user)
                    }
                })
            } else {
                //user found, no registration
                callback(null, _user);
            }
        }
    })
}

module.exports.compareReg = compareReg;