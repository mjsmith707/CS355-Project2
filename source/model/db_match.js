var mysql   = require('mysql');
var db      = require('./db_connection.js');
var xml2js	= require('xml2js');

/* DATABASE CONFIGURATION */
var connection = mysql.createConnection(db.config);
connection.query('SET SESSION sql_mode = \'strict_all_tables\'');

// Create Match XML Handler
exports.CreateMatch = function(xmldata, callback) {
    try {
        var jsondata;
        xml2js.parseString(xmldata, function(err, jsondata) {
            if (jsondata == null) {
                callback(new Error("Empty JSON Object."));
            }
            
            var type = jsondata["match"]["$"]["type"];
            var isTeamGame = jsondata["match"]["$"]["isTeamGame"];
		
            if (isTeamGame == "true") {
                if (type == "TDM") {
                    callback(new Error("Unsupported gametype."));
                }
                else if (type == "CTF") {
                    callback(new Error("Unsupported gametype."));
                }
                else {
                    callback(new Error("Invalid XML file specified."));
                }
            }
            else if (isTeamGame == "false") {
                if (type == "1v1") {
                    parseDuelData(callback, jsondata);
                }
                else if (type == "FFA") {
                    callback(new Error("Unsupported gametype."));
                }
                else {
                    callback(new Error("Invalid XML file specified."));
                }
            }
            else {
                callback(new Error("Invalid XML file specified."));
            }
        });
    }
    catch (err) {
        callback(err);
    }
}

exports.CreateMatchForm = function(req, callback) {
    try {
        var query = "CALL CreateMatch(" + connection.escape(req.body.P1Name) + "," + connection.escape(req.body.P2Name) + ","
            + connection.escape(req.body.Datetime) + "," + connection.escape(req.body.Map) + "," + connection.escape(req.body.Score1) + ","
            + connection.escape(req.body.Kills1) + "," + connection.escape(req.body.Deaths1) + "," + connection.escape(req.body.Suicides1) + ","
            + connection.escape(req.body.Net1) + "," + connection.escape(req.body.DamageGiven1) + "," + connection.escape(req.body.DamageTaken1) + ","
            + connection.escape(req.body.Captures1) + "," + connection.escape(req.body.Assists1) + "," + connection.escape(req.body.Defense1) + ","
            + connection.escape(req.body.Returns1) + "," + connection.escape(req.body.HealthTotal1) + "," + connection.escape(req.body.ArmorTotal1) + ","
            + connection.escape(req.body.MHPickups1) + "," + connection.escape(req.body.RAPickups1) + "," + connection.escape(req.body.YAPickups1) + ","
            + connection.escape(req.body.GAPickups1) + "," + connection.escape(req.body.QuadPickups1) + "," + connection.escape(req.body.BSPickups1) + ","
            + connection.escape(req.body.InvisPickups1) + "," + connection.escape(req.body.FlightPickups1) + "," + connection.escape(req.body.RegenPickups1) + ","
            + connection.escape(req.body.FlagGrabs1) + "," + connection.escape(req.body.QuadTime1) + "," + connection.escape(req.body.BSTime1) + ","
            + connection.escape(req.body.InvisTime1) + "," + connection.escape(req.body.FlightTime1) + "," + connection.escape(req.body.RegenTime1) + ","
            + connection.escape(req.body.FlagTime1) + ","
            + connection.escape(req.body.GKills1) + ","
            + connection.escape(req.body.MGKills1) + "," + connection.escape(req.body.MGShots1) + "," + connection.escape(req.body.MGHits1) + ","
            + connection.escape(req.body.SGKills1) + "," + connection.escape(req.body.SGShots1) + "," + connection.escape(req.body.SGHits1) + ","
            + connection.escape(req.body.PGKills1) + "," + connection.escape(req.body.PGShots1) + "," + connection.escape(req.body.PGHits1) + ","
            + connection.escape(req.body.RLKills1) + "," + connection.escape(req.body.RLShots1) + "," + connection.escape(req.body.RLHits1) + ","
            + connection.escape(req.body.LGKills1) + "," + connection.escape(req.body.LGShots1) + "," + connection.escape(req.body.LGHits1) + ","
            + connection.escape(req.body.RGKills1) + "," + connection.escape(req.body.RGShots1) + "," + connection.escape(req.body.RGHits1) + ","
            + connection.escape(req.body.BFGKills1) + "," + connection.escape(req.body.BFGShots1) + "," + connection.escape(req.body.BFGHits1) + ","
            + connection.escape(req.body.GLKills1) + "," + connection.escape(req.body.GLShots1) + "," + connection.escape(req.body.GLHits1) + ","
            + connection.escape(req.body.TFKills1) + ","
            + connection.escape(req.body.Score2) + ","
            + connection.escape(req.body.Kills2) + "," + connection.escape(req.body.Deaths2) + "," + connection.escape(req.body.Suicides2) + ","
            + connection.escape(req.body.Net2) + "," + connection.escape(req.body.DamageGiven2) + "," + connection.escape(req.body.DamageTaken2) + ","
            + connection.escape(req.body.Captures2) + "," + connection.escape(req.body.Assists2) + "," + connection.escape(req.body.Defense2) + ","
            + connection.escape(req.body.Returns2) + "," + connection.escape(req.body.HealthTotal2) + "," + connection.escape(req.body.ArmorTotal2) + ","
            + connection.escape(req.body.MHPickups2) + "," + connection.escape(req.body.RAPickups2) + "," + connection.escape(req.body.YAPickups2) + ","
            + connection.escape(req.body.GAPickups2) + "," + connection.escape(req.body.QuadPickups2) + "," + connection.escape(req.body.BSPickups2) + ","
            + connection.escape(req.body.InvisPickups2) + "," + connection.escape(req.body.FlightPickups2) + "," + connection.escape(req.body.RegenPickups2) + ","
            + connection.escape(req.body.FlagGrabs2) + "," + connection.escape(req.body.QuadTime2) + "," + connection.escape(req.body.BSTime2) + ","
            + connection.escape(req.body.InvisTime2) + "," + connection.escape(req.body.FlightTime2) + "," + connection.escape(req.body.RegenTime2) + ","
            + connection.escape(req.body.FlagTime2) + ","
            + connection.escape(req.body.GKills2) + ","
            + connection.escape(req.body.MGKills2) + "," + connection.escape(req.body.MGShots2) + "," + connection.escape(req.body.MGHits2) + ","
            + connection.escape(req.body.SGKills2) + "," + connection.escape(req.body.SGShots2) + "," + connection.escape(req.body.SGHits2) + ","
            + connection.escape(req.body.PGKills2) + "," + connection.escape(req.body.PGShots2) + "," + connection.escape(req.body.PGHits2) + ","
            + connection.escape(req.body.RLKills2) + "," + connection.escape(req.body.RLShots2) + "," + connection.escape(req.body.RLHits2) + ","
            + connection.escape(req.body.LGKills2) + "," + connection.escape(req.body.LGShots2) + "," + connection.escape(req.body.LGHits2) + ","
            + connection.escape(req.body.RGKills2) + "," + connection.escape(req.body.RGShots2) + "," + connection.escape(req.body.RGHits2) + ","
            + connection.escape(req.body.BFGKills2) + "," + connection.escape(req.body.BFGShots2) + "," + connection.escape(req.body.BFGHits2) + ","
            + connection.escape(req.body.GLKills2) + "," + connection.escape(req.body.GLShots2) + "," + connection.escape(req.body.GLHits2) + ","
            + connection.escape(req.body.TFKills2)
            + ")";
    
        var result = connection.query(query, function(err, result) {
            if (err) {
                callback(err);
            }
            else if (typeof result === 'undefined') {
                callback(new Error("Failed to insert match. Error Unknown."));
            }
            else {
                callback(false, result[0][0].MatchID);
            }
        });
    }
    catch (err) {
        callback(err);
    }
};

exports.EditMatchForm = function(req, callback) {
    try {
        var query = "CALL EditMatch(" + connection.escape(req.body.MatchID) + "," + connection.escape(req.body.P1Name) + "," + connection.escape(req.body.P2Name) + ","
            + connection.escape(req.body.Datetime) + "," + connection.escape(req.body.Map) + "," + connection.escape(req.body.Score1) + ","
            + connection.escape(req.body.Kills1) + "," + connection.escape(req.body.Deaths1) + "," + connection.escape(req.body.Suicides1) + ","
            + connection.escape(req.body.Net1) + "," + connection.escape(req.body.DamageGiven1) + "," + connection.escape(req.body.DamageTaken1) + ","
            + connection.escape(req.body.Captures1) + "," + connection.escape(req.body.Assists1) + "," + connection.escape(req.body.Defense1) + ","
            + connection.escape(req.body.Returns1) + "," + connection.escape(req.body.HealthTotal1) + "," + connection.escape(req.body.ArmorTotal1) + ","
            + connection.escape(req.body.MHPickups1) + "," + connection.escape(req.body.RAPickups1) + "," + connection.escape(req.body.YAPickups1) + ","
            + connection.escape(req.body.GAPickups1) + "," + connection.escape(req.body.QuadPickups1) + "," + connection.escape(req.body.BSPickups1) + ","
            + connection.escape(req.body.InvisPickups1) + "," + connection.escape(req.body.FlightPickups1) + "," + connection.escape(req.body.RegenPickups1) + ","
            + connection.escape(req.body.FlagGrabs1) + "," + connection.escape(req.body.QuadTime1) + "," + connection.escape(req.body.BSTime1) + ","
            + connection.escape(req.body.InvisTime1) + "," + connection.escape(req.body.FlightTime1) + "," + connection.escape(req.body.RegenTime1) + ","
            + connection.escape(req.body.FlagTime1) + ","
            + connection.escape(req.body.GKills1) + ","
            + connection.escape(req.body.MGKills1) + "," + connection.escape(req.body.MGShots1) + "," + connection.escape(req.body.MGHits1) + ","
            + connection.escape(req.body.SGKills1) + "," + connection.escape(req.body.SGShots1) + "," + connection.escape(req.body.SGHits1) + ","
            + connection.escape(req.body.PGKills1) + "," + connection.escape(req.body.PGShots1) + "," + connection.escape(req.body.PGHits1) + ","
            + connection.escape(req.body.RLKills1) + "," + connection.escape(req.body.RLShots1) + "," + connection.escape(req.body.RLHits1) + ","
            + connection.escape(req.body.LGKills1) + "," + connection.escape(req.body.LGShots1) + "," + connection.escape(req.body.LGHits1) + ","
            + connection.escape(req.body.RGKills1) + "," + connection.escape(req.body.RGShots1) + "," + connection.escape(req.body.RGHits1) + ","
            + connection.escape(req.body.BFGKills1) + "," + connection.escape(req.body.BFGShots1) + "," + connection.escape(req.body.BFGHits1) + ","
            + connection.escape(req.body.GLKills1) + "," + connection.escape(req.body.GLShots1) + "," + connection.escape(req.body.GLHits1) + ","
            + connection.escape(req.body.TFKills1) + ","
            + connection.escape(req.body.Score2) + ","
            + connection.escape(req.body.Kills2) + "," + connection.escape(req.body.Deaths2) + "," + connection.escape(req.body.Suicides2) + ","
            + connection.escape(req.body.Net2) + "," + connection.escape(req.body.DamageGiven2) + "," + connection.escape(req.body.DamageTaken2) + ","
            + connection.escape(req.body.Captures2) + "," + connection.escape(req.body.Assists2) + "," + connection.escape(req.body.Defense2) + ","
            + connection.escape(req.body.Returns2) + "," + connection.escape(req.body.HealthTotal2) + "," + connection.escape(req.body.ArmorTotal2) + ","
            + connection.escape(req.body.MHPickups2) + "," + connection.escape(req.body.RAPickups2) + "," + connection.escape(req.body.YAPickups2) + ","
            + connection.escape(req.body.GAPickups2) + "," + connection.escape(req.body.QuadPickups2) + "," + connection.escape(req.body.BSPickups2) + ","
            + connection.escape(req.body.InvisPickups2) + "," + connection.escape(req.body.FlightPickups2) + "," + connection.escape(req.body.RegenPickups2) + ","
            + connection.escape(req.body.FlagGrabs2) + "," + connection.escape(req.body.QuadTime2) + "," + connection.escape(req.body.BSTime2) + ","
            + connection.escape(req.body.InvisTime2) + "," + connection.escape(req.body.FlightTime2) + "," + connection.escape(req.body.RegenTime2) + ","
            + connection.escape(req.body.FlagTime2) + ","
            + connection.escape(req.body.GKills2) + ","
            + connection.escape(req.body.MGKills2) + "," + connection.escape(req.body.MGShots2) + "," + connection.escape(req.body.MGHits2) + ","
            + connection.escape(req.body.SGKills2) + "," + connection.escape(req.body.SGShots2) + "," + connection.escape(req.body.SGHits2) + ","
            + connection.escape(req.body.PGKills2) + "," + connection.escape(req.body.PGShots2) + "," + connection.escape(req.body.PGHits2) + ","
            + connection.escape(req.body.RLKills2) + "," + connection.escape(req.body.RLShots2) + "," + connection.escape(req.body.RLHits2) + ","
            + connection.escape(req.body.LGKills2) + "," + connection.escape(req.body.LGShots2) + "," + connection.escape(req.body.LGHits2) + ","
            + connection.escape(req.body.RGKills2) + "," + connection.escape(req.body.RGShots2) + "," + connection.escape(req.body.RGHits2) + ","
            + connection.escape(req.body.BFGKills2) + "," + connection.escape(req.body.BFGShots2) + "," + connection.escape(req.body.BFGHits2) + ","
            + connection.escape(req.body.GLKills2) + "," + connection.escape(req.body.GLShots2) + "," + connection.escape(req.body.GLHits2) + ","
            + connection.escape(req.body.TFKills2)
            + ")";
        
            console.log(query);
        
        var result = connection.query(query, function(err, result) {
            if (err) {
                callback(err);
            }
            else if (typeof result === 'undefined') {
                callback(new Error("Failed to edit match. Error Unknown."));
            }
            else {
                callback(false);
            }
        });
    }
    catch (err) {
        callback(err);
    }
};

exports.GetLatest10 = function(callback) {
    try {
        var query = "SELECT * FROM Latest10Matches";
        var result = connection.query(query, function(err, result) {
            if (err) {
                callback(err);
            }
            else {
                callback(false, result);
            }
        });
    }
    catch (err) {
        callback(err);
    }
}

exports.GetLatest100 = function(callback) {
    try {
        var query = "SELECT * FROM Latest100Matches";
        var result = connection.query(query, function(err, result) {
            if (err) {
                callback(err);
            }
            else {
                callback(false, result);
            }
        });
    }
    catch (err) {
        callback(err);
    }
}

exports.SelectMatch = function(MatchID, callback) {
    try {
        if (!MatchID) {
            callback(new Error("Error: Invalid MatchID specified."));
        }
        else {
            var query = "CALL SelectMatch(" + connection.escape(MatchID) + ")";
            var result = connection.query(query, function(err, result) {
                if (err) {
                    callback(err);
                }
                else if (result.length == 0) {
                    callback(new Error("Match not found."));
                }
                else {
                    callback(false, result);
                }
            });
        }
    }
    catch (err) {
        callback(err);
    }
};

exports.GetMatchesList = function(callback) {
    try {
        var query = "SELECT * FROM MatchesList";
        var result = connection.query(query, function(err, result) {
            if (err) {
                callback(err);
            }
            else if (result.length == 0) {
                    callback(new Error("No matches were found."));
            }
            else {
                callback(false, result);
            }
        });
    }
    catch (err) {
        callback(err);
    }
}

exports.DeleteMatch = function(MatchID, callback) {
    try {
        if (!MatchID) {
            callback(new Error("Invalid MatchID specified."));
        }
        else {
            var query = "DELETE FROM Matches WHERE MatchID=" + connection.escape(MatchID);
            var result = connection.query(query, function(err, result) {
                if (err) {
                    callback(err);
                }
                else {
                    callback(false, result);
                }
            });
        }
    }
    catch (err) {
        callback(err);
    }
}

exports.GetMatchComments = function(MatchID, callback) {
    try {
        if (!MatchID) {
            callback(new Error("Invalid MatchID specified."));
        }
        else {
            var query = "CALL SelectComments(" + connection.escape(MatchID) + ")";
            var result = connection.query(query, function(err, result) {
                if (err) {
                    callback(err);
                }
                else {
                    callback(false, result);
                }
            });
        }
    }
    catch (err) {
        callback(err);
    }
}

exports.CreateComment = function (req, callback) {
    try {
        if (!req.body.MatchID || !req.body.Name || !req.body.Message) {
            callback(new Error("No fields entered for comment."));
        }
        else {
            var query = "CALL CreateComment(" + connection.escape(req.body.MatchID) + "," + connection.escape(req.body.Name) + ","
            + connection.escape(req.body.Message) + ")";
            var result = connection.query(query, function(err, result) {
                if (err) {
                    callback(err);
                }
                else {
                    callback(false, result);
                }
            });
        }
    }
    catch (err) {
        callback(err);
    }
}

exports.DeleteComment = function(req, callback) {
    try {
        if (!req.body.MatchID || !req.body.Name || !req.body.Datetime) {
            callback(new Error("No fields entered for comment."));
        }
        else {
            var query = "CALL DeleteComment(" + connection.escape(req.body.MatchID) + "," + connection.escape(req.body.Name) + ","
            + connection.escape(req.body.Datetime) + ")";
            var result = connection.query(query, function(err, result) {
                if (err) {
                    callback(err);
                }
                else {
                    callback(false, result);
                }
            });
        }
    }
    catch (err) {
        callback(err);
    }
}

// Match Struct
function Match_s(Player1ID, Player2ID, Datetime, Map, Winner, P1EloChange, P2EloChange) {
	this.Player1ID = Player1ID;
    this.Player2ID = Player2ID;
    this.Datetime = Datetime;
    this.Map = Map;
    this.Winner = Winner;
    this.P1EloChange = P1EloChange;
    this.P2EloChange = P2EloChange;
}

// PlayerStats Struct
function PlayerStats_s(Name, Score, Kills, Deaths, Suicides, Net, DamageGiven, DamageTaken, 
					HealthTotal, ArmorTotal, Captures, Assists, Defense, Returns) {
	this.Name = Name;
	this.Score = Score;
	this.Kills = Kills;
	this.Deaths = Deaths;
	this.Suicides = Suicides;
	this.Net = Net;
	this.DamageGiven = DamageGiven;
	this.DamageTaken = DamageTaken;
	this.HealthTotal = HealthTotal;
	this.ArmorTotal = ArmorTotal;
	this.Captures = Captures;
	this.Assists = Assists;
	this.Defense = Defense;
	this.Returns = Returns;
}

// ItemStats Struct
function ItemStats_s(MHPickups, RAPickups, YAPickups, GAPickups, QuadPickups, BSPickups, 
					InvisPickups, FlightPickups, RegenPickups, FlagGrabs, QuadTime, BSTime, 
					InvisTime, FlightTime, RegenTime, FlagTime) {
	this.MHPickups = MHPickups;
	this.RAPickups = RAPickups;
	this.YAPickups = YAPickups;
	this.GAPickups = GAPickups;
	this.QuadPickups = QuadPickups;
	this.BSPickups = BSPickups;
	this.InvisPickups = InvisPickups;
	this.FlightPickups = FlightPickups;
	this.RegenPickups = RegenPickups;
	this.FlagGrabs = FlagGrabs;
	this.QuadTime = QuadTime;
	this.BSTime = BSTime;
	this.InvisTime = InvisTime;
	this.FlightTime = FlightTime;
	this.RegenTime = RegenTime;
	this.FlagTime = FlagTime;
}

// WeaponStats Struct
function WeaponStats_s(GKills, MGKills, MGShots, MGHits, SGKills, SGShots, 
					SGHits, PGKills, PGShots, PGHits, RLKills, RLShots, RLHits, LGKills, 
					LGShots, LGHits, RGKills, RGShots, RGHits, GLKills, GLShots, GLHits, BFGKills, 
					BFGShots, BFGHits, TFKills) {
	this.GKills = GKills;
	this.MGKills = MGKills;
	this.MGShots = MGShots;
	this.MGHits = MGHits;
	this.SGKills = SGKills;
	this.SGShots = SGShots;
	this.SGHits = SGHits;
	this.PGKills = PGKills;
	this.PGShots = PGShots;
	this.PGHits = PGHits;
	this.RLKills = RLKills;
	this.RLShots = RLShots;
	this.RLHits = RLHits;
	this.LGKills = LGKills;
	this.LGShots = LGShots;
	this.LGHits = LGHits;
	this.RGKills = RGKills;
	this.RGShots = RGShots;
	this.RGHits = RGHits;
	this.GLKills = GLKills;
	this.GLShots = GLShots;
	this.GLHits = GLHits;
	this.BFGKills = BFGKills;
	this.BFGShots = BFGShots;
	this.BFGHits = BFGHits;
	this.TFKills = TFKills;
}

// Input: Maxstats JSON Duel Data
// Output: Insertion into database, returns MatchID
// Throws: Parse Error, MySQL Error
function parseDuelData(callback, jsondata) {
    try {
        var Match = parseDuelMatch(jsondata);
        var P1PlayerStats = parseDuelPlayerStats(0, jsondata);
        var P1ItemStats = parseDuelItemStats(0, jsondata);
        var P1WeaponStats = parseDuelWeaponStats(0, jsondata);
        var P2PlayerStats = parseDuelPlayerStats(1, jsondata);
        var P2ItemStats = parseDuelItemStats(1, jsondata);
        var P2WeaponStats = parseDuelWeaponStats(1, jsondata);
    }
    catch (err) {
        callback(err);
    }
    
    var query = "CALL CreateMatch(" + connection.escape(P1PlayerStats.Name) + "," + connection.escape(P2PlayerStats.Name) + ","
        + connection.escape(Match.Datetime) + "," + connection.escape(Match.Map) + "," + connection.escape(P1PlayerStats.Score) + ","
        + connection.escape(P1PlayerStats.Kills) + "," + connection.escape(P1PlayerStats.Deaths) + "," + connection.escape(P1PlayerStats.Suicides) + ","
        + connection.escape(P1PlayerStats.Net) + "," + connection.escape(P1PlayerStats.DamageGiven) + "," + connection.escape(P1PlayerStats.DamageTaken) + ","
        + connection.escape(P1PlayerStats.Captures) + "," + connection.escape(P1PlayerStats.Assists) + "," + connection.escape(P1PlayerStats.Defense) + ","
        + connection.escape(P1PlayerStats.Returns) + "," + connection.escape(P1PlayerStats.HealthTotal) + "," + connection.escape(P1PlayerStats.ArmorTotal) + ","
        + connection.escape(P1ItemStats.MHPickups) + "," + connection.escape(P1ItemStats.RAPickups) + "," + connection.escape(P1ItemStats.YAPickups) + ","
        + connection.escape(P1ItemStats.GAPickups) + "," + connection.escape(P1ItemStats.QuadPickups) + "," + connection.escape(P1ItemStats.BSPickups) + ","
        + connection.escape(P1ItemStats.InvisPickups) + "," + connection.escape(P1ItemStats.FlightPickups) + "," + connection.escape(P1ItemStats.RegenPickups) + ","
        + connection.escape(P1ItemStats.FlagGrabs) + "," + connection.escape(P1ItemStats.QuadTime) + "," + connection.escape(P1ItemStats.BSTime) + ","
        + connection.escape(P1ItemStats.InvisTime) + "," + connection.escape(P1ItemStats.FlightTime) + "," + connection.escape(P1ItemStats.RegenTime) + ","
        + connection.escape(P1ItemStats.FlagTime) + ","
        + connection.escape(P1WeaponStats.GKills) + ","
        + connection.escape(P1WeaponStats.MGKills) + "," + connection.escape(P1WeaponStats.MGShots) + "," + connection.escape(P1WeaponStats.MGHits) + ","
        + connection.escape(P1WeaponStats.SGKills) + "," + connection.escape(P1WeaponStats.SGShots) + "," + connection.escape(P1WeaponStats.SGHits) + ","
        + connection.escape(P1WeaponStats.PGKills) + "," + connection.escape(P1WeaponStats.PGShots) + "," + connection.escape(P1WeaponStats.PGHits) + ","
        + connection.escape(P1WeaponStats.RLKills) + "," + connection.escape(P1WeaponStats.RLShots) + "," + connection.escape(P1WeaponStats.RLHits) + ","
        + connection.escape(P1WeaponStats.LGKills) + "," + connection.escape(P1WeaponStats.LGShots) + "," + connection.escape(P1WeaponStats.LGHits) + ","
        + connection.escape(P1WeaponStats.RGKills) + "," + connection.escape(P1WeaponStats.RGShots) + "," + connection.escape(P1WeaponStats.RGHits) + ","
        + connection.escape(P1WeaponStats.BFGKills) + "," + connection.escape(P1WeaponStats.BFGShots) + "," + connection.escape(P1WeaponStats.BFGHits) + ","
        + connection.escape(P1WeaponStats.GLKills) + "," + connection.escape(P1WeaponStats.GLShots) + "," + connection.escape(P1WeaponStats.GLHits) + ","
        + connection.escape(P1WeaponStats.TFKills) + ","
        + connection.escape(P2PlayerStats.Score) + ","
        + connection.escape(P2PlayerStats.Kills) + "," + connection.escape(P2PlayerStats.Deaths) + "," + connection.escape(P2PlayerStats.Suicides) + ","
        + connection.escape(P2PlayerStats.Net) + "," + connection.escape(P2PlayerStats.DamageGiven) + "," + connection.escape(P2PlayerStats.DamageTaken) + ","
        + connection.escape(P2PlayerStats.Captures) + "," + connection.escape(P2PlayerStats.Assists) + "," + connection.escape(P2PlayerStats.Defense) + ","
        + connection.escape(P2PlayerStats.Returns) + "," + connection.escape(P2PlayerStats.HealthTotal) + "," + connection.escape(P2PlayerStats.ArmorTotal) + ","
        + connection.escape(P2ItemStats.MHPickups) + "," + connection.escape(P2ItemStats.RAPickups) + "," + connection.escape(P2ItemStats.YAPickups) + ","
        + connection.escape(P2ItemStats.GAPickups) + "," + connection.escape(P2ItemStats.QuadPickups) + "," + connection.escape(P2ItemStats.BSPickups) + ","
        + connection.escape(P2ItemStats.InvisPickups) + "," + connection.escape(P2ItemStats.FlightPickups) + "," + connection.escape(P2ItemStats.RegenPickups) + ","
        + connection.escape(P2ItemStats.FlagGrabs) + "," + connection.escape(P2ItemStats.QuadTime) + "," + connection.escape(P2ItemStats.BSTime) + ","
        + connection.escape(P2ItemStats.InvisTime) + "," + connection.escape(P2ItemStats.FlightTime) + "," + connection.escape(P2ItemStats.RegenTime) + ","
        + connection.escape(P2ItemStats.FlagTime) + ","
        + connection.escape(P2WeaponStats.GKills) + ","
        + connection.escape(P2WeaponStats.MGKills) + "," + connection.escape(P2WeaponStats.MGShots) + "," + connection.escape(P2WeaponStats.MGHits) + ","
        + connection.escape(P2WeaponStats.SGKills) + "," + connection.escape(P2WeaponStats.SGShots) + "," + connection.escape(P2WeaponStats.SGHits) + ","
        + connection.escape(P2WeaponStats.PGKills) + "," + connection.escape(P2WeaponStats.PGShots) + "," + connection.escape(P2WeaponStats.PGHits) + ","
        + connection.escape(P2WeaponStats.RLKills) + "," + connection.escape(P2WeaponStats.RLShots) + "," + connection.escape(P2WeaponStats.RLHits) + ","
        + connection.escape(P2WeaponStats.LGKills) + "," + connection.escape(P2WeaponStats.LGShots) + "," + connection.escape(P2WeaponStats.LGHits) + ","
        + connection.escape(P2WeaponStats.RGKills) + "," + connection.escape(P2WeaponStats.RGShots) + "," + connection.escape(P2WeaponStats.RGHits) + ","
        + connection.escape(P2WeaponStats.BFGKills) + "," + connection.escape(P2WeaponStats.BFGShots) + "," + connection.escape(P2WeaponStats.BFGHits) + ","
        + connection.escape(P2WeaponStats.GLKills) + "," + connection.escape(P2WeaponStats.GLShots) + "," + connection.escape(P2WeaponStats.GLHits) + ","
        + connection.escape(P2WeaponStats.TFKills)
        + ")";
    
    var result = connection.query(query, function(err, result) {
        if (err) {
            callback(err);
        }
        else if (typeof result === 'undefined') {
            callback(new Error("Failed to insert match. Error Unknown."));
        }
        else {
            callback(false, result[0][0].MatchID);
        }
    });
}

// Input: Duel MaxStats JSON Object
// Output: Returns Match_s
// Throws: Parse Error
function parseDuelMatch(jsondata) {
	var Datetime = jsondata["match"]["$"]["datetime"];
	var Map = jsondata["match"]["$"]["map"];
	
	var match = new Match_s();
    match.Datetime = Datetime;
    match.Map = Map;
	
	return match;
}

// Input: Player Number, Maxstats JSON Object
// Output: Returns PlayerStats_s
// Throws: Parse Error
function parseDuelPlayerStats(playerNum, jsondata) {
	var Name = getDuelName(playerNum, jsondata);
	var Score = getDuelPlayerStats(playerNum, "Score", jsondata);
	var Kills = getDuelPlayerStats(playerNum, "Kills", jsondata);
	var Deaths = getDuelPlayerStats(playerNum, "Deaths", jsondata);
	var Suicides = getDuelPlayerStats(playerNum, "Suicides", jsondata);
	var Net = getDuelPlayerStats(playerNum, "Net", jsondata);
	var DamageGiven = getDuelPlayerStats(playerNum, "DamageGiven", jsondata);
	var DamageTaken = getDuelPlayerStats(playerNum, "DamageTaken", jsondata);
	var HealthTotal = getDuelPlayerStats(playerNum, "HealthTotal", jsondata);
	var ArmorTotal = getDuelPlayerStats(playerNum, "ArmorTotal", jsondata);
	var Captures = getDuelPlayerStats(playerNum, "Captures", jsondata);
	var Assists = getDuelPlayerStats(playerNum, "Assists", jsondata);
	var Defense = getDuelPlayerStats(playerNum, "Defense", jsondata);
	var Returns = getDuelPlayerStats(playerNum, "Returns", jsondata);
	
	var stats = new PlayerStats_s(Name, Score, Kills, Deaths, Suicides, Net, DamageGiven,
									DamageTaken, HealthTotal, ArmorTotal, Captures, Assists,
									Defense, Returns);
	
	return stats;
}

// Input: Player Number, MaxStats JSON Object
// Output: Returns Player Name
// Throws: Parse Error
function getDuelName(playerNum, jsondata) {
	var player = jsondata["match"]["player"][playerNum]["$"]["name"];
	return player;
}

// Input: Player Number, 'name' Field's Name, MaxStats JSON Object
// Output: Returns corresponding value associated with field/name
// Throws: None
function getDuelPlayerStats(playerNum, name, jsondata) {
    try {
        for (var i=0; i<15; i++) {
            var search = jsondata["match"]["player"][playerNum]["stat"][i]["$"]["name"];
            if (search == name) {
                var result = jsondata["match"]["player"][playerNum]["stat"][i]["$"]["value"];
                break;
            }
        }
    }
    catch (err) {
        result = 0;
    }

    return result;
}

// Input: Player Number, Maxstats JSON Object
// Output: Returns ItemStats_s
// Throws: None
function parseDuelItemStats(playerNum, jsondata) {
	var MHPickups = getDuelItemStats(playerNum, "MH", "pickups", jsondata);
	var RAPickups = getDuelItemStats(playerNum, "RA", "pickups", jsondata);
	var YAPickups = getDuelItemStats(playerNum, "YA", "pickups", jsondata);
	var GAPickups = getDuelItemStats(playerNum, "GA", "pickups", jsondata);
	var QuadPickups = getDuelPowerupStats(playerNum, "Quad", "pickups", jsondata);
	var BSPickups = getDuelPowerupStats(playerNum, "BattleSuit", "pickups", jsondata);
	var InvisPickups = getDuelPowerupStats(playerNum, "Invis", "pickups", jsondata);
	var FlightPickups = getDuelPowerupStats(playerNum, "Flight", "pickups", jsondata);
	var RegenPickups = getDuelPowerupStats(playerNum, "Regen", "pickups", jsondata);
	var FlagGrabs = getDuelPowerupStats(playerNum, "Red Flag", "pickups", jsondata);
	var QuadTime = getDuelPowerupStats(playerNum, "Quad", "time", jsondata);
	var BSTime = getDuelPowerupStats(playerNum, "BattleSuit", "time", jsondata);
	var InvisTime = getDuelPowerupStats(playerNum, "Invis", "time", jsondata);
	var FlightTime = getDuelPowerupStats(playerNum, "Flight", "time", jsondata);
	var RegenTime = getDuelPowerupStats(playerNum, "Regen", "time", jsondata);
	var FlagTime = getDuelPowerupStats(playerNum, "Red Flag", "time", jsondata);
	
	var items = new ItemStats_s(MHPickups, RAPickups, YAPickups, GAPickups, QuadPickups,
								BSPickups, InvisPickups, FlightPickups, RegenPickups, 
								FlagGrabs, QuadTime, BSTime, InvisTime, FlightTime, RegenTime, FlagTime);
	
	return items;
}

// Input: Player Number, 'name' Field's Name, MaxStats JSON Object
// Output: Returns corresponding value associated with field/name
// Throws: None
function getDuelItemStats(playerNum, name, value, jsondata) {
    try {
        for (var i=0; i<15; i++) {
            var search = jsondata["match"]["player"][playerNum]["items"][0]["item"][i]["$"]["name"];
            if (search == name) {
                var result = jsondata["match"]["player"][playerNum]["items"][0]["item"][i]["$"][value];
                break;
            }
        }
    }
    catch (err) {
        result = 0;
    }

    return result;
}

// Input: Player Number, 'name' Field's Name, MaxStats JSON Object
// Output: Returns corresponding value associated with field/name
// Throws: None
function getDuelPowerupStats(playerNum, name, value, jsondata) {
    try {
        for (var i=0; i<15; i++) {
            var search = jsondata["match"]["player"][playerNum]["powerups"][0]["item"][i]["$"]["name"];
            if (search == name) {
                var result = jsondata["match"]["player"][playerNum]["powerups"][0]["item"][i]["$"][value];
                break;
            }
        }
    }
    catch (err) {
        result = 0;
    }

    return result;
}

// Input: Player Number, Maxstats JSON Object
// Output: Returns WeaponStats_s
// Throws: None
function parseDuelWeaponStats(playerNum, jsondata) {
	var GKills = getDuelWeaponStats(playerNum, "G", "kills", jsondata);
	var MGKills = getDuelWeaponStats(playerNum, "MG", "kills", jsondata);
	var MGShots = getDuelWeaponStats(playerNum, "MG", "shots", jsondata);
	var MGHits = getDuelWeaponStats(playerNum, "MG", "hits", jsondata);
	var SGKills = getDuelWeaponStats(playerNum, "SG", "kills", jsondata);
	var SGShots = getDuelWeaponStats(playerNum, "SG", "shots", jsondata);
	var SGHits = getDuelWeaponStats(playerNum, "SG", "hits", jsondata);
	var PGKills = getDuelWeaponStats(playerNum, "PG", "kills", jsondata);
	var PGShots = getDuelWeaponStats(playerNum, "PG", "shots", jsondata);
	var PGHits = getDuelWeaponStats(playerNum, "PG", "hits", jsondata);
	var RLKills = getDuelWeaponStats(playerNum, "RL", "kills", jsondata);
	var RLShots = getDuelWeaponStats(playerNum, "RL", "shots", jsondata);
	var RLHits = getDuelWeaponStats(playerNum, "RL", "hits", jsondata);
	var LGKills = getDuelWeaponStats(playerNum, "LG", "kills", jsondata);
	var LGShots = getDuelWeaponStats(playerNum, "LG", "shots", jsondata);
	var LGHits = getDuelWeaponStats(playerNum, "LG", "hits", jsondata);
	var RGKills = getDuelWeaponStats(playerNum, "RG", "kills", jsondata);
	var RGShots = getDuelWeaponStats(playerNum, "RG", "shots", jsondata);
	var RGHits = getDuelWeaponStats(playerNum, "RG", "hits", jsondata);
	var GLKills = getDuelWeaponStats(playerNum, "GL", "kills", jsondata);
	var GLShots = getDuelWeaponStats(playerNum, "GL", "shots", jsondata);
	var GLHits = getDuelWeaponStats(playerNum, "GL", "hits", jsondata);
	var BFGKills = getDuelWeaponStats(playerNum, "BFG", "kills", jsondata);
	var BFGShots = getDuelWeaponStats(playerNum, "BFG", "shots", jsondata);
	var BFGHits = getDuelWeaponStats(playerNum, "BFG", "hits", jsondata);
	var TFKills = getDuelWeaponStats(playerNum, "TF", "kills", jsondata);
	
	var weapons = new WeaponStats_s(GKills, MGKills, MGShots, MGHits, SGKills, SGShots, 
									SGHits, PGKills, PGShots, PGHits, RLKills, RLShots, 
									RLHits, LGKills, LGShots, LGHits, RGKills, RGShots, 
									RGHits, GLKills, GLShots, GLHits, BFGKills, BFGShots, 
									BFGHits, TFKills);

	return weapons;
}

// Input: Player Number, 'name' Field's Name, 'value' Value's name MaxStats JSON Object
// Output: Returns corresponding value associated with field/name
// Throws: None
function getDuelWeaponStats(playerNum, name, value, jsondata) {
    try {
        for (var i=0; i<15; i++) {
            var search = jsondata["match"]["player"][playerNum]["weapons"][0]["weapon"][i]["$"]["name"];
            if (search == name) {
                var result = jsondata["match"]["player"][playerNum]["weapons"][0]["weapon"][i]["$"][value];
                break;
            }
        }
    }
    catch (err) {
        result = 0;
    }
	
    return result;
}