var express = require('express');
var router  = express.Router();
var mdb   = require('../model/db_match.js');
var pdb   = require('../model/db_player.js');

// Player Page
router.get('/', function(req, res) {
    if (req.query.length == 0) {
        res.redirect('/top100');
    }
    else if (req.query.PlayerID == null) {
        res.redirect('/top100');
    }
    else {
        var PlayerInfo = pdb.SelectPlayer(req.query.PlayerID, function(err, PlayerInfo) {
            if (err) {
                console.log(err.toString());
                res.render('Error.ejs', {output: err.toString()});
            }
            else {
                var Matches = pdb.SelectPlayersMatches(req.query.PlayerID, function(err2, Matches) {
                    if (err2) {
                        console.log(err2.toString());
                        res.render('Error.ejs', {output: err2.toString()});
                    }
                    else {
                        res.render('Player.ejs', {player: PlayerInfo, match: Matches});
                    }
                });
            }
        });
    }
});

module.exports = router;