const dal = require('../dal');

function compareLogin(user, pass, callback) {
    let query = `SELECT * FROM user WHERE username LIKE '${user}' AND password LIKE '${pass}'`;
    dal.readOne(query, function (err, _user) {
        if (err) {
            callback(err);
        } else {
            callback(null, _user);
        }
    })
}

module.exports.compareLogin = compareLogin;