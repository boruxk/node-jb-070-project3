const dal = require('../dal');

function getVacations(callback) {
    let query = "SELECT * FROM `vocation` ORDER BY id ASC";
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

function createVacation(newData, callback) {
    //convert time
    (function () {
        Date.prototype.toYMD = Date_toYMD;
        function Date_toYMD() {
            var year, month, day;
            year = String(this.getFullYear());
            month = String(this.getMonth() + 1);
            if (month.length == 1) {
                month = "0" + month;
            }
            day = String(this.getDate());
            if (day.length == 1) {
                day = "0" + day;
            }
            return year + "-" + month + "-" + day;
        }
    })();
    var dtS = new Date(newData.startdate);
    var strS = dtS.toYMD();
    var dtE = new Date(newData.enddate);
    var strE = dtE.toYMD();

    let query = `INSERT INTO vocation (description, target, image, date_departure, date_arrival, price) VALUES ("${newData.description}", '${newData.target}', '${newData.image}', '${strS}', '${strE}', ${newData.price})`;
    dal.saveOne(query, function (err, data) {
        if (err) {
            callback(err);
        } else {
            callback(null, data);
        }
    })
}

function updateVacation(newData, callback) {
    //convert time
    (function () {
        Date.prototype.toYMD = Date_toYMD;
        function Date_toYMD() {
            var year, month, day;
            year = String(this.getFullYear());
            month = String(this.getMonth() + 1);
            if (month.length == 1) {
                month = "0" + month;
            }
            day = String(this.getDate());
            if (day.length == 1) {
                day = "0" + day;
            }
            return year + "-" + month + "-" + day;
        }
    })();
    var dtS = new Date(newData.startdate);
    var strS = dtS.toYMD();
    var dtE = new Date(newData.enddate);
    var strE = dtE.toYMD();

    let query = "";
    if (newData.image === undefined) {
        query = `UPDATE vocation SET description = "${newData.description}", target = "${newData.target}", date_departure = '${strS}', date_arrival = '${strE}', price = ${newData.price} WHERE id = ${newData.id}`;
    } else {
        query = `UPDATE vocation SET description = "${newData.description}", target = "${newData.target}", date_departure = '${strS}', date_arrival = '${strE}', price = ${newData.price}, image = '${newData.image}' WHERE id = ${newData.id}`;
    }
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
    dal.deleteOne(query, id, function (err, data) {
        if (err) {
            callback(err);
        } else {
            callback(null, data);
        }
    })
}

module.exports.getVacations = getVacations;
module.exports.getVacation = getVacation;
module.exports.createVacation = createVacation;
module.exports.updateVacation = updateVacation;
module.exports.deleteVacation = deleteVacation;
