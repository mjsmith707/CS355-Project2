var express = require('express');
var router  = express.Router();
var mdb     = require('../model/db_match.js');
var pdb     = require('../model/db_player.js');
var fs      = require('fs');
var multer  = require('multer');

// Admin Control Panel Landing Page
router.get('/', function(req, res) {
    res.render('Admin.ejs');
});

// Match Upload Page
router.post('/uploadmatch', function(req, res) {
    res.render('MatchUploader.ejs');
});

// Match Upload Submit Page
router.post('/uploadmatch/submit', function(req, res) {
    try {
        if (req.files["matchdata"].length > 1) {
            var count = 0;
            var error = false;
            for (var i=0; i<req.files["matchdata"].length; i++) {
            
                var path = req.files["matchdata"][i]["path"];
	
                // Read temp file
                var xmldata = fs.readFileSync(path, "utf8");
            
                // Delete temp file
                fs.unlink(path);

                // It Begins...
                mdb.CreateMatch(xmldata, function(err, result) {
                    if (err) {
                        error = true;
                        console.log(err.toString());
                    }
                    count++;
                    if ((count == req.files["matchdata"].length-1)) {
                        if (!error) {
                            res.render('Success.ejs', {output: "All files uploaded successfully", output2: "/admin/"});
                        }
                        else {
                            res.render('Error.ejs', {output: "Failed to add some files" });
                        }
                    }
                });
            }
        }
        else {
            var path = req.files["matchdata"]["path"];
	
            // Read temp file
            var xmldata = fs.readFileSync(path, "utf8");
		
            // Delete temp file
            fs.unlink(path);

            // It Begins...
            mdb.CreateMatch(xmldata, function(err, result) {
                if (err) {
                    console.log(err.toString());
                    res.render('Error.ejs', {output: err.toString() });
                }
                else {
                    res.render('Success.ejs', {output: "File uploaded successfully", output2: "/admin/"});
                }
            });
        }
        
	}
	catch (err) {
	    console.log(err.toString());
		res.render('Error.ejs', {output: err.toString() });
	}
});

router.post('/creatematch/form', function(req, res) {
    var playerlist = pdb.GetPlayersList(function (err, playerlist) {
        if (err) {
            console.log(err.toString());
            res.render('InlineError.ejs', {output: err.toString() });
        }
        else {
            res.render('CreateMatchForm.ejs', {playerlist: playerlist });
        }
    });
});

router.post('/creatematch/submit', function(req, res) {
    var result = mdb.CreateMatchForm(req, function (err, result) {
        if (err) {
            console.log(err.toString());
            res.render('InlineError.ejs', {output: err.toString() });
        }
        else {
            res.send("Match Added Successfully");
        }
    });
});

router.post('/editmatch/select', function(req, res) {
    var matchlist = mdb.GetMatchesList(function (err, matchlist) {
        if (err) {
            console.log(err.toString());
            res.render('InlineError.ejs', {output: err.toString() });
        }
        else {
            res.render('EditMatchSelectForm.ejs', {matchlist: matchlist });
        }
    });
});

router.post('/editmatch', function(req, res) {
    var match = mdb.SelectMatch(req.body.MatchID, function (err, match) {
        if (err) {
            console.log(err.toString());
            res.render('InlineError.ejs', {output: err.toString() });
        }
        else {
            res.render('EditMatchForm.ejs', {match: match });
        }
    });
});

router.post('/editmatch/submit', function(req, res) {
    var result = mdb.EditMatchForm(req, function (err, result) {
        if (err) {
            console.log(err.toString());
            res.render('InlineError.ejs', {output: err.toString() });
        }
        else {
            res.send("Match Edited Successfully");
        }
    });
});

router.post('/deletematch', function(req, res) {
    var matchlist = mdb.GetMatchesList(function (err, matchlist) {
        if (err) {
            console.log(err.toString());
            res.render('InlineError.ejs', {output: err.toString() });
        }
        else {
            res.render('DeleteMatchSelectForm.ejs', {matchlist: matchlist });
        }
    });
});

router.post('/deletematch/submit', function(req, res) {
    var result = mdb.DeleteMatch(req.body.MatchID, function (err, result) {
        if (err) {
            console.log(err.toString());
            res.render('InlineError.ejs', {output: err.toString() });
        }
        else {
            res.send('Match Deleted Successfully.');
        }
    });
});

router.post('/createplayer', function(req, res) {
    res.render('CreatePlayerForm.ejs');
});

router.post('/createplayer/submit', function(req, res) {
    var result = pdb.CreatePlayer(req.body.Name, function(err, result) {
        if (err) {
            console.log(err.toString());
            res.render('InlineError.ejs', {output: err.toString() });
        }
        else {
            res.send('Player Created Successfully.');
        }
    });
});

router.post('/editplayer/select', function(req, res) {
    var playerlist = pdb.GetPlayersList(function (err, playerlist) {
        if (err) {
            console.log(err.toString());
            res.render('InlineError.ejs', {output: err.toString() });
        }
        else {
            res.render('EditPlayerSelectForm.ejs', {playerlist: playerlist });
        }
    });
});

router.post('/editplayer', function(req, res) {
    var player = pdb.SelectPlayer(req.body.PlayerID, function (err, player) {
        if (err) {
            console.log(err.toString());
            res.render('InlineError.ejs', {output: err.toString() });
        }
        else {
            res.render('EditPlayerForm.ejs', {player: player });
        }
    });
});

router.post('/editplayer/submit', function(req, res) {
    var result = pdb.EditPlayer(req, function(err, result) {
        if (err) {
            console.log(err.toString());
            res.render('InlineError.ejs', {output: err.toString() });
        }
        else {
            res.send('Player Updated Successfully.');
        }
    });
});

router.post('/deleteplayer/select', function(req, res) {
    var playerlist = pdb.GetPlayersList(function (err, playerlist) {
        if (err) {
            console.log(err.toString());
            res.render('InlineError.ejs', {output: err.toString() });
        }
        else {
            res.render('DeletePlayerSelectForm.ejs', {playerlist: playerlist });
        }
    });
});

router.post('/deleteplayer', function(req, res) {
    var result = pdb.DeletePlayer(req, function(err, result) {
        if (err) {
            console.log(err.toString());
            res.render('InlineError.ejs', {output: err.toString() });
        }
        else {
            res.send('Player Deleted Successfully.');
        }
    });
});

router.post('/deletecomment/select', function(req, res) {
    var matchlist = mdb.GetMatchesList(function (err, matchlist) {
        if (err) {
            console.log(err.toString());
            res.render('InlineError.ejs', {output: err.toString() });
        }
        else {
            res.render('DeleteCommentSelectForm.ejs', {matchlist: matchlist });
        }
    });
});

router.post('/deletecomment/list', function(req, res) {
    var Comments = mdb.GetMatchComments(req.body.MatchID, function(err, Comments) {
        if (err) {
            console.log(err.toString());
            res.render('InlineError.ejs', {output: err.toString() });
        }
        else {
            res.render('CommentList.ejs', {MatchID: req.body.MatchID, comments: Comments});
        }
    });
});

router.post('/deletecomment/submit', function(req, res) {
    var result = mdb.DeleteComment(req, function(err, result) {
        if (err) {
            console.log(err.toString());
            res.render('InlineError.ejs', {output: err.toString() });
        }
        else {
            res.send('Comment Deleted Successfully.');
        }
    });
});

router.post('/cleardatabase/confirm', function(req, res) {
    res.render('ClearDBConfirmation.ejs');
});

router.post('/cleardatabase', function(req, res) {
    try {
        pdb.ClearDatabase(function (err) {
            if (err) {
                console.log(err.toString());
                res.render('InlineError.ejs', {output: err.toString() });
            }
            else {
                res.send('Database cleared.');
            }
        });
    }
    catch (err) {
        console.log(err.toString());
        res.render('InlineError.ejs', {output: err.toString() });
    }
});

module.exports = router;