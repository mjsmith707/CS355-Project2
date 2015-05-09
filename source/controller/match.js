var express = require('express');
var router  = express.Router();
var mdb   = require('../model/db_match.js');

// Match page
router.get('/', function(req, res) {
    if (req.length == 0) {
        res.redirect('/latestmatches');
    }
    else {
        var Match = mdb.SelectMatch(req.query.MatchID, function(err, Match) {
            if (err) {
                console.log(err.toString());
                res.render('Error.ejs', {output: err.toString() });
            }
            else {
                var Comments = mdb.GetMatchComments(req.query.MatchID, function(err2, Comments) {
                    if (err2) {
                        console.log(err2.toString());
                        res.render('Error.ejs', {output: err2.toString() });
                    }
                    else {
                        res.render('Match.ejs', {match: Match, comments: Comments});
                    }
                });
            }
        });
    }
});

router.post('/createcomment', function(req, res) {
    res.render('CreateCommentArea.ejs', {MatchID: req.body.MatchID});
});

router.post('/createcomment/submit', function(req, res) {
    var Comment = mdb.CreateComment(req, function(err, Comment) {
        if (err) {
            console.log(err.toString());
            res.render('InlineError.ejs', {output: err.toString() });
        }
        else if (!Comment) {
            console.log("Returned comment was undefined.");
            res.render('InlineError.ejs', {output: "Blame Max" });
        }
        else {
            res.render('NewComment.ejs', {comment: Comment });
        }
    });
});

module.exports = router;