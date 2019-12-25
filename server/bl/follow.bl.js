const dal = require('../dal');

function getFollow(callback) {
    let query = "SELECT * FROM following";
    dal.readAll(query, function (err, data) {
        if (err) {
            callback(err);
        } else {
            callback(null, data);
        }
    })
}

function getVacation(id, callback) {
    let query = `SELECT * FROM vocation WHERE id = ${id}`;
    dal.readOne(query, function (err, data) {
        if (err) {
            callback(err);
        } else {
            callback(null, data);
        }
    })
}

function createFollow(newData, callback) {
    let query = `SELECT * FROM following WHERE id_user = ${newData.userid} AND id_vocation = ${newData.vacationid}`;
    dal.readOne(query, function (err, data) {
        if (err) {
            callback(err);
        } else {
            if (data === "error") {
                let query2 = `INSERT INTO following (id_user, id_vocation) VALUES (${newData.userid}, ${newData.vacationid})`;
                dal.saveOne(query2, function (err, data) {
                    if (err) {
                        callback(err);
                    } else {
                        callback(null, data);
                    }
                })
            } else {
                let query2 = `DELETE FROM following WHERE id_user = ${newData.userid} AND id_vocation = ${newData.vacationid}`;
                dal.deleteOne(query2, function (err, data) {
                    if (err) {
                        callback(err);
                    } else {
                        callback(null, data);
                    }
                })
            }
            
        }
    })
}

function updateVacation(newData, callback) {
    query = `UPDATE vocation SET description = "${newData.description}", target = "${newData.target}", date_departure = '${strS}', date_arrival = '${strE}', price = ${newData.price} WHERE id = ${newData.id}`;
    dal.updateOne(query, function (err, data) {
        if (err) {
            callback(err);
        } else {
            let id = newData.id;
            let query = `SELECT * FROM vocation WHERE id = ${id}`;
            dal.readOne(query, function (err, data) {
                if (err) {
                    callback(err);
                } else {
                    callback(null, data);
                }
            })
        }
    })
}

function deleteVacation(id, callback) {
    let query = `DELETE FROM vocation WHERE id = ${id}`;
    dal.deleteOne(query, function (err, data) {
        if (err) {
            callback(err);
        } else {
            callback(null, data);
        }
    })
}

module.exports.getFollow = getFollow;
module.exports.getVacation = getVacation;
module.exports.createFollow = createFollow;
module.exports.updateVacation = updateVacation;
module.exports.deleteVacation = deleteVacation;
