var mysql   = require('mysql');
var db      = require('./db_connection.js');
var xml2js	= require('xml2js');

/* DATABASE CONFIGURATION */
var connection = mysql.createConnection(db.config);
connection.query('SET SESSION sql_mode = \'strict_all_tables\'');

exports.ClearDatabase = function(callback) {
    try {
        var query = "DELETE FROM Players";
        connection.query(query, function(err, result) {
            if (err) {
                callback(err);
            }
            else {
                callback(false);
            }
        });
    }
    catch (err) {
        callback(err);
    }
}

exports.GetTop10 = function(callback) {
    var query = "SELECT * FROM Top10";
    var result = connection.query(query, function(err, result) {
        if (err) {
            callback(err);
        }
        else {
            callback(false, result);
        }
    });
}

exports.GetTop100 = function(callback) {
    var query = "SELECT * FROM Top100";
    var result = connection.query(query, function(err, result) {
        if (err) {
            callback(err);
        }
        else {
            callback(false, result);
        }
    });
}

exports.SelectPlayer = function(PlayerID, callback) {
    var query = "CALL SelectPlayerInfo(" + connection.escape(PlayerID) + ")";
    var result = connection.query(query, function(err, result) {
        if (err) {
            callback(err);
        }
        else {
            callback(false, result);
        }
    });
}

exports.SelectPlayersMatches = function(PlayerID, callback) {
    var query = "CALL SelectPlayersMatches(" + connection.escape(PlayerID) + ")";
    var result = connection.query(query, function(err, result) {
        if (err) {
            callback(err);
        }
        else {
            callback(false, result);
        }
    });
}

exports.GetPlayersList = function(callback) {
    var query = "SELECT Name, PlayerID FROM Players p";
    var result = connection.query(query, function (err, result) {
        if (err) {
            callback(err);
        }
        else {
            callback(false, result);
        }
    });
}

exports.CreatePlayer = function(Name, callback) {
    var query = "CALL CreatePlayer(" + connection.escape(Name) + ")";
    var result = connection.query(query, function(err, result) {
        if (err) {
            callback(err);
        }
        else {
            callback(false, result);
        }
    });
}

exports.EditPlayer = function(req, callback) {
    var query = "CALL EditPlayer(" + connection.escape(req.body.PlayerID) + "," + connection.escape(req.body.Name) + "," + connection.escape(req.body.FirstSeen) + "," + connection.escape(req.body.LastSeen) + ")";
    var result = connection.query(query, function(err, result) {
        if (err) {
            callback(err);
        }
        else {
            callback(false, result);
        }
    });
}

exports.DeletePlayer = function(req, callback) {
    var query = "CALL DeletePlayer(" + connection.escape(req.body.PlayerID) + ")";
    var result = connection.query(query, function(err, result) {
        if (err) {
            callback(err);
        }
        else {
            callback(false, result);
        }
    });
}