var express = require('express');
var router  = express.Router();
var mdb     = require('../model/db_match.js');
var pdb     = require ('../model/db_player.js');

// match page
router.get('/', function(req, res) {
    var top10 = pdb.GetTop10(function (err, top10) {
        if (err) {
            console.log(err.toString());
            res.render('Error.ejs', {output: err.toString() });
        }
        else {
            var latest10 = mdb.GetLatest10(function (err2, latest10) {
                if (err2) {
                    console.log(err2.toString());
                    res.render('Error.ejs', {output: err2.toString() });
                }
                else {
                    res.render('Index.ejs', {top: top10, latest: latest10 });
                }
            });
        }
    });
});

router.get('/top100', function(req, res) {
    var top100 = pdb.GetTop100(function (err, top100) {
        if (err) {
            console.log(err.toString());
            res.render('Error.ejs', {output: err.toString() });
        }
        else {
            res.render('Top100.ejs', {top: top100});
        }
    });
});

router.get('/latestmatches', function(req, res) {
    var latest100 = mdb.GetLatest100(function (err, latest100) {
        if (err) {
            console.log(err.toString());
            res.render('Error.ejs', {output: err.toString() });
        }
        else {
            res.render('LatestMatches.ejs', {latest: latest100 });
        }
    });
});

router.get('/about', function(req, res) {
    res.render('About.ejs');
});

module.exports = router;