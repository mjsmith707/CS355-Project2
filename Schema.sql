USE msmith;

SET FOREIGN_KEY_CHECKS=0;
DROP TABLE IF EXISTS GameStats;
DROP TABLE IF EXISTS Comments;
DROP TABLE IF EXISTS Matches;
DROP TABLE IF EXISTS Players;
DROP PROCEDURE IF EXISTS CreatePlayer;
DROP PROCEDURE IF EXISTS SelectElo;
DROP PROCEDURE IF EXISTS SelectPlayer;
DROP FUNCTION IF EXISTS SelectPlayerFN;
DROP FUNCTION IF EXISTS SelectEloFN;
DROP PROCEDURE IF EXISTS CreateMatch;
DROP PROCEDURE IF EXISTS EditMatch;
DROP PROCEDURE IF EXISTS EditPlayer;
DROP PROCEDURE IF EXISTS DeletePlayer;
DROP PROCEDURE IF EXISTS CreateComment;
DROP PROCEDURE IF EXISTS SelectComments;
DROP PROCEDURE IF EXISTS DeleteComment;
DROP PROCEDURE IF EXISTS SelectPlayerInfo;
DROP PROCEDURE IF EXISTS SelectPlayersMatches;
DROP PROCEDURE IF EXISTS SelectMatch;
DROP VIEW IF EXISTS Top10;
DROP VIEW IF EXISTS Top100;
DROP VIEW IF EXISTS Latest10Matches;
DROP VIEW IF EXISTS Latest100Matches;
DROP VIEW IF EXISTS MatchesList;
SET FOREIGN_KEY_CHECKS=1;

CREATE TABLE Players (
	PlayerID INT UNIQUE PRIMARY KEY AUTO_INCREMENT,
    Name VARCHAR(100) UNIQUE NOT NULL,
    FirstSeen VARCHAR(100) NOT NULL,
    LastSeen VARCHAR(100) NOT NULL
);

CREATE TABLE Matches (
	MatchID INT UNIQUE PRIMARY KEY AUTO_INCREMENT,
    Player1ID INT NOT NULL,
    Player2ID INT NOT NULL,
    Datetime VARCHAR(100) NOT NULL,
    Map VARCHAR (100) NOT NULL,
    Winner INT NOT NULL,
    P1EloChange INT NOT NULL,
    P2EloChange INT NOT NULL,
    FOREIGN KEY (Player1ID) REFERENCES Players(PlayerID) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (Player2ID) REFERENCES Players(PlayerID) ON DELETE CASCADE ON UPDATE CASCADE,
    UNIQUE(Player1ID, Player2ID, Datetime)
);

CREATE TABLE GameStats (
	MatchID INT NOT NULL,
    PlayerID INT NOT NULL,
    Score INT DEFAULT 0,
    Kills INT DEFAULT 0,
    Deaths INT DEFAULT 0,
    Suicides INT DEFAULT 0,
    Net INT DEFAULT 0,
    DamageGiven INT DEFAULT 0,
    DamageTaken INT DEFAULT 0,
    Captures INT DEFAULT 0,
    Assists INT DEFAULT 0,
    Defense INT DEFAULT 0,
    Returns INT DEFAULT 0,
    HealthTotal INT DEFAULT 0,
    ArmorTotal INT DEFAULT 0,
    MHPickups INT DEFAULT 0,
    RAPickups INT DEFAULT 0,
    YAPickups INT DEFAULT 0,
    GAPickups INT DEFAULT 0,
    QuadPickups INT DEFAULT 0,
    BSPickups INT DEFAULT 0,
    InvisPickups INT DEFAULT 0,
    FlightPickups INT DEFAULT 0,
    RegenPickups INT DEFAULT 0,
    FlagGrabs INT DEFAULT 0,
    QuadTime INT DEFAULT 0,
    BSTime INT DEFAULT 0,
    InvisTime INT DEFAULT 0,
    FlightTime INT DEFAULT 0,
    RegenTime INT DEFAULT 0,
    FlagTime INT DEFAULT 0,
	GKills INT DEFAULT 0,
    MGKills INT DEFAULT 0,
    MGShots INT DEFAULT 0,
    MGHits INT DEFAULT 0,
    SGKills INT  DEFAULT 0,
    SGShots INT DEFAULT 0,
    SGHits INT DEFAULT 0,
    PGKills INT DEFAULT 0,
    PGShots INT DEFAULT 0,
    PGHits INT DEFAULT 0,
	RLKills INT DEFAULT 0,
    RLShots INT DEFAULT 0,
    RLHits INT DEFAULT 0,
    LGKills INT DEFAULT 0,
    LGShots INT DEFAULT 0,
    LGHits INT DEFAULT 0,
    RGKills INT DEFAULT 0,
    RGShots INT DEFAULT 0,
    RGHits INT DEFAULT 0,
    BFGKills INT DEFAULT 0,
    BFGShots INT DEFAULT 0,
    BFGHits INT DEFAULT 0,
    GLKills INT DEFAULT 0,
    GLShots INT DEFAULT 0,
    GLHits INT DEFAULT 0,
    TFKills INT DEFAULT 0,
    UNIQUE (MatchID, PlayerID),
    FOREIGN KEY (MatchID) REFERENCES Matches(MatchID) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (PlayerID) REFERENCES Players(PlayerID) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE Comments (
	MatchID INT NOT NULL,
    Name VARCHAR(20) NOT NULL,
    Post VARCHAR(1000) NOT NULL,
    Datetime VARCHAR(100) NOT NULL,
    UNIQUE(MatchID, Name, Datetime),
    FOREIGN KEY (MatchID) REFERENCES Matches(MatchID) ON DELETE CASCADE
);

-- SelectElo
-- Elo Selection Procedure
DELIMITER //
CREATE PROCEDURE SelectElo (IN playerid INT)
BEGIN
	SELECT (CASE WHEN p.PlayerID=playerid THEN 1200 + sum(ifnull(m.P1EloChange, 0)) + sum(ifnull(m2.P2EloChange, 0)) ELSE 1200 END) as Elo 
	FROM Players p
	LEFT JOIN Matches m
	ON p.PlayerID = m.Player1ID
	LEFT JOIN Matches m2
	ON p.PlayerID = m2.Player2ID
	WHERE p.PlayerID=playerid;
    
END //
DELIMITER ;

-- CreatePlayer
-- Create Player Procedure
DELIMITER //
CREATE PROCEDURE CreatePlayer(IN Name VARCHAR(100))
BEGIN
	DECLARE EXIT HANDLER FOR SQLEXCEPTION, SQLWARNING
	BEGIN
		ROLLBACK;
        RESIGNAL;
	END;
    
    START TRANSACTION;
    BEGIN
		INSERT INTO Players(Name, FirstSeen, LastSeen) VALUES (Name, now(), now());
		SELECT LAST_INSERT_ID() AS PlayerID;
	COMMIT;
	END;
    
END //
DELIMITER ;

-- Select Player Procedure
-- Return PlayerID from Name, Create if non-existant.
DELIMITER //
CREATE PROCEDURE SelectPlayer(IN Name VARCHAR(100))
BEGIN
    IF EXISTS(SELECT PlayerID FROM Players p WHERE p.Name=Name)
    THEN
		SELECT PlayerID FROM Players p WHERE p.Name=Name;
	ELSE
		INSERT INTO Players(Name, FirstSeen, LastSeen) VALUES (Name, now(), now());
		SELECT LAST_INSERT_ID() AS PlayerID;
    END IF;
END //
DELIMITER ;

-- SelectPlayerFN
-- Return PlayerID from Name, Create if non-existant. Internal Use Function
DELIMITER //
CREATE FUNCTION SelectPlayerFN(Name VARCHAR(100))
RETURNS INT
BEGIN
	DECLARE PID INT;
    IF EXISTS(SELECT PlayerID FROM Players p WHERE p.Name=Name)
    THEN
		SET PID = (SELECT PlayerID FROM Players p WHERE p.Name=Name);
	ELSE
		INSERT INTO Players(Name, FirstSeen, LastSeen) VALUES (Name, now(), now());
		SET PID = LAST_INSERT_ID();
    END IF;
    RETURN PID;
END //
DELIMITER ;

-- SelectEloFN
-- Returns Elo for given PlayerID. Internal Use Function
DELIMITER //
CREATE Function SelectEloFN (playerid INT)
RETURNS INT
BEGIN
	DECLARE Elo INT;
	SET Elo = (SELECT (CASE WHEN p.PlayerID=playerid THEN 1200 + sum(ifnull(m.P1EloChange, 0)) + sum(ifnull(m2.P2EloChange, 0)) ELSE 1200 END) as Elo 
	FROM Players p
	LEFT JOIN Matches m
	ON p.PlayerID = m.Player1ID
	LEFT JOIN Matches m2
	ON p.PlayerID = m2.Player2ID
	WHERE p.PlayerID=playerid);
    RETURN Elo;
END //
DELIMITER ;

-- Create Match Stored Procedure
-- This thing saves several hundred lines of js
DELIMITER //
CREATE PROCEDURE CreateMatch
(
	IN 
    P1Name VARCHAR(100), P2Name VARCHAR(100), Datetime VARCHAR(100), Map VARCHAR(100),
    P1Score INT,P1Kills INT,P1Deaths INT,P1Suicides INT,P1Net INT,P1DamageGiven INT,
    P1DamageTaken INT,P1Captures INT,P1Assists INT,P1Defense INT,P1Returns INT,P1HealthTotal INT,P1ArmorTotal INT,P1MHPickups INT,P1RAPickups INT,P1YAPickups INT,
    P1GAPickups INT,P1QuadPickups INT,P1BSPickups INT,P1InvisPickups INT,P1FlightPickups INT,P1RegenPickups INT,P1FlagGrabs INT,P1QuadTime INT,P1BSTime INT,P1InvisTime INT,
    P1FlightTime INT,P1RegenTime INT,P1FlagTime INT,P1GKills INT,P1MGKills INT,P1MGShots INT,P1MGHits INT,P1SGKills INT,P1SGShots INT,P1SGHits INT,P1PGKills INT,P1PGShots INT,
    P1PGHits INT,P1RLKills INT,P1RLShots INT,P1RLHits INT,P1LGKills INT,P1LGShots INT,P1LGHits INT,P1RGKills INT,P1RGShots INT,P1RGHits INT,P1BFGKills INT,P1BFGShots INT,
    P1BFGHits INT,P1GLKills INT,P1GLShots INT,P1GLHits INT,P1TFKills INT,
    P2Score INT,P2Kills INT,P2Deaths INT,P2Suicides INT,P2Net INT,P2DamageGiven INT,P2DamageTaken INT,P2Captures INT,P2Assists INT,P2Defense INT,P2Returns INT,
    P2HealthTotal INT,P2ArmorTotal INT,P2MHPickups INT,P2RAPickups INT,P2YAPickups INT,P2GAPickups INT,P2QuadPickups INT,P2BSPickups INT,P2InvisPickups INT,P2FlightPickups INT,
    P2RegenPickups INT,P2FlagGrabs INT,P2QuadTime INT,P2BSTime INT,P2InvisTime INT,P2FlightTime INT,P2RegenTime INT,P2FlagTime INT,P2GKills INT,P2MGKills INT,P2MGShots INT,
    P2MGHits INT,P2SGKills INT,P2SGShots INT,P2SGHits INT,P2PGKills INT,P2PGShots INT,P2PGHits INT,P2RLKills INT,P2RLShots INT,P2RLHits INT,P2LGKills INT,P2LGShots INT,
    P2LGHits INT,P2RGKills INT,P2RGShots INT,P2RGHits INT,P2BFGKills INT,P2BFGShots INT,P2BFGHits INT,P2GLKills INT,P2GLShots INT,P2GLHits INT,P2TFKills INT
)
BEGIN
    
	DECLARE EXIT HANDLER FOR SQLEXCEPTION, SQLWARNING
	BEGIN
		ROLLBACK;
        RESIGNAL;
	END;

    START TRANSACTION;
    BEGIN
		DECLARE P1ID INT;
		DECLARE P2ID INT;
        DECLARE WinnerID INT;
        DECLARE MatchID INT;
        DECLARE P1Elo INT;
        DECLARE P2Elo INT;
        DECLARE K INT;
        DECLARE P1EloChange INT;
        DECLARE P2EloChange INT;
        
		SET P1ID = SelectPlayerFN(P1Name);
		SET P2ID = SelectPlayerFN(P2Name);
        
        IF (P1Score > P2Score)
        THEN
			SET WinnerID = P1ID;
        ELSE
			SET WinnerID = P2ID;
        END IF;
        
        SET P1Elo = SelectEloFN(P1ID);
        SET P2Elo = SelectEloFN(P2ID);
        
        IF ((P1Elo AND P2Elo) > 2400)
		THEN
			SET K = 16;
		ELSEIF ((P1Elo OR P2Elo) < 2100)
        THEN
			SET K = 32;
		ELSEIF ((P1Elo OR P2Elo) < 2401)
        THEN
			SET K = 24;
		END IF;

        IF (P1ID = WinnerID)
        THEN
			SET P1EloChange = K * (1.0 - (1/(10^(-(P1Elo - P2Elo)/400)+1)));
			SET P2EloChange = K * (0.0 - (1/(10^(-(P2Elo - P1Elo)/400)+1)));
		ELSE
			SET P1EloChange = K * (0.0 - (1/(10^(-(P1Elo - P2Elo)/400)+1)));
			SET P2EloChange = K * (1.0 - (1/(10^(-(P2Elo - P1Elo)/400)+1)));
        END IF;
        
        INSERT INTO Matches(Player1ID, Player2ID, Datetime, Map, Winner, P1EloChange, P2EloChange) VALUES (P1ID, P2ID, Datetime, Map, WinnerID, P1EloChange, P2EloChange);
        SET MatchID = LAST_INSERT_ID();
        
        INSERT INTO GameStats(MatchID,PlayerID,Score,Kills,Deaths,Suicides,Net,DamageGiven,DamageTaken,Captures,Assists,Defense,Returns,HealthTotal,ArmorTotal,MHPickups,RAPickups,YAPickups,
			GAPickups,QuadPickups,BSPickups,InvisPickups,FlightPickups,RegenPickups,FlagGrabs,QuadTime,BSTime,InvisTime,FlightTime,RegenTime,FlagTime,GKills,MGKills,
            MGShots,MGHits,SGKills,SGShots,SGHits,PGKills,PGShots,PGHits,RLKills,RLShots,RLHits,LGKills,LGShots,LGHits,RGKills,RGShots,RGHits,BFGKills,BFGShots,
            BFGHits,GLKills,GLShots,GLHits,TFKills)
            VALUES (MatchID,P1ID,P1Score,P1Kills,P1Deaths,P1Suicides,P1Net,P1DamageGiven,P1DamageTaken,P1Captures,P1Assists,P1Defense,P1Returns,P1HealthTotal,P1ArmorTotal,P1MHPickups,P1RAPickups,P1YAPickups,
			P1GAPickups,P1QuadPickups,P1BSPickups,P1InvisPickups,P1FlightPickups,P1RegenPickups,P1FlagGrabs,P1QuadTime,P1BSTime,P1InvisTime,P1FlightTime,P1RegenTime,P1FlagTime,P1GKills,P1MGKills,
            P1MGShots,P1MGHits,P1SGKills,P1SGShots,P1SGHits,P1PGKills,P1PGShots,P1PGHits,P1RLKills,P1RLShots,P1RLHits,P1LGKills,P1LGShots,P1LGHits,P1RGKills,P1RGShots,P1RGHits,P1BFGKills,P1BFGShots,
            P1BFGHits,P1GLKills,P1GLShots,P1GLHits,P1TFKills);
		
        INSERT INTO GameStats(MatchID,PlayerID,Score,Kills,Deaths,Suicides,Net,DamageGiven,DamageTaken,Captures,Assists,Defense,Returns,HealthTotal,ArmorTotal,MHPickups,RAPickups,YAPickups,
			GAPickups,QuadPickups,BSPickups,InvisPickups,FlightPickups,RegenPickups,FlagGrabs,QuadTime,BSTime,InvisTime,FlightTime,RegenTime,FlagTime,GKills,MGKills,
            MGShots,MGHits,SGKills,SGShots,SGHits,PGKills,PGShots,PGHits,RLKills,RLShots,RLHits,LGKills,LGShots,LGHits,RGKills,RGShots,RGHits,BFGKills,BFGShots,
            BFGHits,GLKills,GLShots,GLHits,TFKills)
            VALUES (MatchID,P2ID,P2Score,P2Kills,P2Deaths,P2Suicides,P2Net,P2DamageGiven,P2DamageTaken,P2Captures,P2Assists,P2Defense,P2Returns,P2HealthTotal,P2ArmorTotal,P2MHPickups,P2RAPickups,P2YAPickups,
			P2GAPickups,P2QuadPickups,P2BSPickups,P2InvisPickups,P2FlightPickups,P2RegenPickups,P2FlagGrabs,P2QuadTime,P2BSTime,P2InvisTime,P2FlightTime,P2RegenTime,P2FlagTime,P2GKills,P2MGKills,
            P2MGShots,P2MGHits,P2SGKills,P2SGShots,P2SGHits,P2PGKills,P2PGShots,P2PGHits,P2RLKills,P2RLShots,P2RLHits,P2LGKills,P2LGShots,P2LGHits,P2RGKills,P2RGShots,P2RGHits,P2BFGKills,P2BFGShots,
            P2BFGHits,P2GLKills,P2GLShots,P2GLHits,P2TFKills);
		
		UPDATE Players SET LastSeen = now() WHERE PlayerID=P1ID;
        UPDATE Players Set LastSeen = now() WHERE PlayerID=P2ID;
        
        SELECT MatchID;
    
    COMMIT;
    END;
    
END //
DELIMITER ;

-- Edit Match
-- Basically identical to CreateMatch except updating tables
DELIMITER //
CREATE PROCEDURE EditMatch
(
	IN 
    MID INT, P1Name VARCHAR(100), P2Name VARCHAR(100), Datetime VARCHAR(100), Map VARCHAR(100),
    P1Score INT,P1Kills INT,P1Deaths INT,P1Suicides INT,P1Net INT,P1DamageGiven INT,
    P1DamageTaken INT,P1Captures INT,P1Assists INT,P1Defense INT,P1Returns INT,P1HealthTotal INT,P1ArmorTotal INT,P1MHPickups INT,P1RAPickups INT,P1YAPickups INT,
    P1GAPickups INT,P1QuadPickups INT,P1BSPickups INT,P1InvisPickups INT,P1FlightPickups INT,P1RegenPickups INT,P1FlagGrabs INT,P1QuadTime INT,P1BSTime INT,P1InvisTime INT,
    P1FlightTime INT,P1RegenTime INT,P1FlagTime INT,P1GKills INT,P1MGKills INT,P1MGShots INT,P1MGHits INT,P1SGKills INT,P1SGShots INT,P1SGHits INT,P1PGKills INT,P1PGShots INT,
    P1PGHits INT,P1RLKills INT,P1RLShots INT,P1RLHits INT,P1LGKills INT,P1LGShots INT,P1LGHits INT,P1RGKills INT,P1RGShots INT,P1RGHits INT,P1BFGKills INT,P1BFGShots INT,
    P1BFGHits INT,P1GLKills INT,P1GLShots INT,P1GLHits INT,P1TFKills INT,
    P2Score INT,P2Kills INT,P2Deaths INT,P2Suicides INT,P2Net INT,P2DamageGiven INT,P2DamageTaken INT,P2Captures INT,P2Assists INT,P2Defense INT,P2Returns INT,
    P2HealthTotal INT,P2ArmorTotal INT,P2MHPickups INT,P2RAPickups INT,P2YAPickups INT,P2GAPickups INT,P2QuadPickups INT,P2BSPickups INT,P2InvisPickups INT,P2FlightPickups INT,
    P2RegenPickups INT,P2FlagGrabs INT,P2QuadTime INT,P2BSTime INT,P2InvisTime INT,P2FlightTime INT,P2RegenTime INT,P2FlagTime INT,P2GKills INT,P2MGKills INT,P2MGShots INT,
    P2MGHits INT,P2SGKills INT,P2SGShots INT,P2SGHits INT,P2PGKills INT,P2PGShots INT,P2PGHits INT,P2RLKills INT,P2RLShots INT,P2RLHits INT,P2LGKills INT,P2LGShots INT,
    P2LGHits INT,P2RGKills INT,P2RGShots INT,P2RGHits INT,P2BFGKills INT,P2BFGShots INT,P2BFGHits INT,P2GLKills INT,P2GLShots INT,P2GLHits INT,P2TFKills INT
)
BEGIN
	DECLARE EXIT HANDLER FOR SQLEXCEPTION, SQLWARNING
	BEGIN
		ROLLBACK;
        RESIGNAL;
	END;

    START TRANSACTION;
    BEGIN
		DECLARE P1ID INT;
		DECLARE P2ID INT;
        DECLARE WinnerID INT;
        DECLARE P1Elo INT;
        DECLARE P2Elo INT;
        DECLARE K INT;
        DECLARE P1EloChange INT;
        DECLARE P2EloChange INT;
        
		SET P1ID = SelectPlayerFN(P1Name);
		SET P2ID = SelectPlayerFN(P2Name);
        
        IF (P1Score > P2Score)
        THEN
			SET WinnerID = P1ID;
        ELSE
			SET WinnerID = P2ID;
        END IF;
        
        SET P1Elo = SelectEloFN(P1ID);
        SET P2Elo = SelectEloFN(P2ID);
        
        IF ((P1Elo AND P2Elo) > 2400)
		THEN
			SET K = 16;
		ELSEIF ((P1Elo OR P2Elo) < 2100)
        THEN
			SET K = 32;
		ELSEIF ((P1Elo OR P2Elo) < 2401)
        THEN
			SET K = 24;
		END IF;

        IF (P1ID = WinnerID)
        THEN
			SET P1EloChange = K * (1.0 - (1/(10^(-(P1Elo - P2Elo)/400)+1)));
			SET P2EloChange = K * (0.0 - (1/(10^(-(P2Elo - P1Elo)/400)+1)));
		ELSE
			SET P1EloChange = K * (0.0 - (1/(10^(-(P1Elo - P2Elo)/400)+1)));
			SET P2EloChange = K * (1.0 - (1/(10^(-(P2Elo - P1Elo)/400)+1)));
        END IF;
        
        UPDATE Matches SET Datetime=Datetime,Map=Map,Winner=WinnerID,P1EloChange=P1EloChange,P2EloChange=P2EloChange
        WHERE MatchID=MID;
        
        UPDATE GameStats SET Score=P1Score,Kills=P1Kills,Deaths=P1Deaths,Suicides=P1Suicides,Net=P1Net,DamageGiven=P1DamageGiven,
        DamageTaken=P1DamageTaken,Captures=P1Captures,Assists=P1Assists,Defense=P1Defense,Returns=P1Returns,HealthTotal=P1HealthTotal,
        ArmorTotal=P1ArmorTotal,MHPickups=P1MHPickups,RAPickups=P1RAPickups,YAPickups=P1YAPickups,GAPickups=P1GAPickups,QuadPickups=P1QuadPickups,
		BSPickups=P1BSPickups,InvisPickups=P1InvisPickups,FlightPickups=P1FlightPickups,RegenPickups=P1RegenPickups,FlagGrabs=P1FlagGrabs,QuadTime=P1QuadTime,
        BSTime=P1BSTime,InvisTime=P1InvisTime,FlightTime=P1FlightTime,RegenTime=P1RegenTime,FlagTime=P1FlagTime,GKills=P1GKills,MGKills=P1MGKills,
		MGShots=P1MGShots,MGHits=P1MGHits,SGKills=P1SGKills,SGShots=P1SGShots,SGHits=P1SGHits,PGKills=P1PGKills,PGShots=P1PGShots,PGHits=P1PGHits,
        RLKills=P1RLKills,RLShots=P1RLShots,RLHits=P1RLHits,LGKills=P1LGKills,LGShots=P1LGShots,LGHits=P1LGHits,RGKills=P1RGKills,RGShots=P1RGShots,
        RGHits=P1RGHits,BFGKills=P1BFGKills,BFGShots=P1BFGShots,BFGHits=P1BFGHits,GLKills=P1GLKills,GLShots=P1GLShots,GLHits=P1GLHits,TFKills=P1TFKills
        WHERE MatchID=MID AND PlayerID = P1ID;
		
        UPDATE GameStats SET Score=P2Score,Kills=P2Kills,Deaths=P2Deaths,Suicides=P2Suicides,Net=P2Net,DamageGiven=P2DamageGiven,
        DamageTaken=P2DamageTaken,Captures=P2Captures,Assists=P2Assists,Defense=P2Defense,Returns=P2Returns,HealthTotal=P2HealthTotal,
        ArmorTotal=P2ArmorTotal,MHPickups=P2MHPickups,RAPickups=P2RAPickups,YAPickups=P2YAPickups,GAPickups=P2GAPickups,QuadPickups=P2QuadPickups,
        BSPickups=P2BSPickups,InvisPickups=P2InvisPickups,FlightPickups=P2FlightPickups,RegenPickups=P2RegenPickups,FlagGrabs=P2FlagGrabs,QuadTime=P2QuadTime,
        BSTime=P2BSTime,InvisTime=P2InvisTime,FlightTime=P2FlightTime,RegenTime=P2RegenTime,FlagTime=P2FlagTime,GKills=P2GKills,MGKills=P2MGKills,
		MGShots=P2MGShots,MGHits=P2MGHits,SGKills=P2SGKills,SGShots=P2SGShots,SGHits=P2SGHits,PGKills=P2PGKills,PGShots=P2PGShots,PGHits=P2PGHits,
        RLKills=P2RLKills,RLShots=P2RLShots,RLHits=P2RLHits,LGKills=P2LGKills,LGShots=P2LGShots,LGHits=P2LGHits,RGKills=P2RGKills,RGShots=P2RGShots,
        RGHits=P2RGHits,BFGKills=P2BFGKills,BFGShots=P2BFGShots,BFGHits=P2BFGHits,GLKills=P2GLKills,GLShots=P2GLShots,GLHits=P2GLHits,TFKills=P2TFKills
        WHERE MatchID=MID AND PlayerID = P2ID;
		
		UPDATE Players SET LastSeen = now() WHERE PlayerID=P1ID;
        UPDATE Players Set LastSeen = now() WHERE PlayerID=P2ID;
    
    COMMIT;
    END;
    
END //
DELIMITER ;

-- EditPlayer
-- Updates the Player table
DELIMITER //
CREATE PROCEDURE EditPlayer
(
	IN 
    PID INT, Name VARCHAR(100), FirstSeen VARCHAR(100), LastSeen VARCHAR(100)
)
BEGIN
    
	DECLARE EXIT HANDLER FOR SQLEXCEPTION, SQLWARNING
	BEGIN
		ROLLBACK;
        RESIGNAL;
	END;

    START TRANSACTION;
    BEGIN
		UPDATE IGNORE Players SET Name=Name, FirstSeen = FirstSeen, LastSeen = LastSeen WHERE PlayerID=PID;
    COMMIT;
    END;
    
END //
DELIMITER ;

-- DeletePlayer
-- Delete Player Procedure
DELIMITER //
CREATE PROCEDURE DeletePlayer(IN PID INT)
BEGIN
	DECLARE EXIT HANDLER FOR SQLEXCEPTION, SQLWARNING
	BEGIN
		ROLLBACK;
        RESIGNAL;
	END;
    
    START TRANSACTION;
    BEGIN
		DELETE FROM Players WHERE PlayerID=PID;
	COMMIT;
	END;
    
END //
DELIMITER ;

-- CreateComment
-- Create Comment Procedure
DELIMITER //
CREATE PROCEDURE CreateComment(IN MID INT, CName VARCHAR(100), Message VARCHAR(100))
BEGIN
	DECLARE EXIT HANDLER FOR SQLEXCEPTION, SQLWARNING
	BEGIN
		ROLLBACK;
        RESIGNAL;
	END;
    
    START TRANSACTION;
    BEGIN
		DECLARE currtime VARCHAR(100);
        SET currtime = now();
		INSERT INTO Comments(MatchID, Name, Post, Datetime) VALUES (MID, CName, Message, currtime);
        SELECT MatchID, Name, Datetime, Post FROM Comments WHERE MatchID=MID AND Name=CName AND Datetime=currtime;
	COMMIT;
	END;
    
END //
DELIMITER ;

-- SelectComments
-- Select Comments Procedure
DELIMITER //
CREATE PROCEDURE SelectComments(IN MID INT)
BEGIN
	DECLARE EXIT HANDLER FOR SQLEXCEPTION, SQLWARNING
	BEGIN
		ROLLBACK;
        RESIGNAL;
	END;
    
    START TRANSACTION;
    BEGIN
		SELECT c.Name, c.Post, c.Datetime 
		FROM Comments c
		WHERE c.MatchID = MID
		ORDER BY c.Datetime ASC;
	COMMIT;
	END;
    
END //
DELIMITER ;

-- SelectComments
-- Select Comments Procedure
DELIMITER //
CREATE PROCEDURE DeleteComment(IN MID INT, CName VARCHAR(100), PostTime VARCHAR(100))
BEGIN
	DECLARE EXIT HANDLER FOR SQLEXCEPTION, SQLWARNING
	BEGIN
		ROLLBACK;
        RESIGNAL;
	END;
    
    START TRANSACTION;
    BEGIN
		DELETE FROM Comments WHERE MatchID=MID AND Name=CName AND Datetime=PostTime;
	COMMIT;
	END;
    
END //
DELIMITER ;

-- Top 10 Players View
CREATE VIEW Top10 AS
SELECT p.PlayerID, p.Name, COUNT(m.MatchID) as GamesPlayed, SUM(CASE WHEN p.PlayerID=m.Winner THEN 1 ELSE 0 END) as GamesWon,
SUM(CASE WHEN p.PlayerID!=m.Winner THEN 1 ELSE 0 END) as GamesLost,
SelectEloFN(p.PlayerID) as Elo 
FROM Players p
LEFT JOIN Matches m
ON (p.PlayerID = m.Player1ID) XOR (p.PlayerID = m.Player2ID)
WHERE p.PlayerID=playerid
GROUP BY p.Name
ORDER BY Elo DESC
LIMIT 10;

-- Top 100 Players View (Being strict here)
CREATE VIEW Top100 AS
SELECT p.PlayerID, p.Name, COUNT(m.MatchID) as GamesPlayed, SUM(CASE WHEN p.PlayerID=m.Winner THEN 1 ELSE 0 END) as GamesWon,
SUM(CASE WHEN p.PlayerID!=m.Winner THEN 1 ELSE 0 END) as GamesLost,
SelectEloFN(p.PlayerID) as Elo 
FROM Players p
LEFT JOIN Matches m
ON (p.PlayerID = m.Player1ID) XOR (p.PlayerID = m.Player2ID)
WHERE p.PlayerID=playerid
GROUP BY p.Name
ORDER BY Elo DESC
LIMIT 100;

-- Top 10 Matches View
CREATE VIEW Latest10Matches AS
SELECT DISTINCT p1.PlayerID as P1ID, p1.Name as P1Name, gs1.Score as P1Score, 
p2.PlayerID as P2ID, p2.Name as P2Name, gs2.Score as P2Score, 
m.Map, m.Datetime, m.MatchID
FROM Players p1
INNER JOIN Matches m
ON p1.PlayerID = m.Player1ID
INNER JOIN GameStats gs1
ON p1.PlayerID = gs1.PlayerID AND m.MatchID = gs1.MatchID
INNER JOIN Players p2
ON p2.PlayerID = m.Player2ID
INNER JOIN GameStats gs2
ON p2.PlayerID = gs2.PlayerID AND m.MatchID = gs2.MatchID
ORDER BY m.Datetime DESC
LIMIT 10;

-- Top 100 Matches View
CREATE VIEW Latest100Matches AS
SELECT DISTINCT p1.PlayerID as P1ID, p1.Name as P1Name, gs1.Score as P1Score, 
p2.PlayerID as P2ID, p2.Name as P2Name, gs2.Score as P2Score, 
m.Map, m.Datetime, m.MatchID
FROM Players p1
INNER JOIN Matches m
ON p1.PlayerID = m.Player1ID
INNER JOIN GameStats gs1
ON p1.PlayerID = gs1.PlayerID AND m.MatchID = gs1.MatchID
INNER JOIN Players p2
ON p2.PlayerID = m.Player2ID
INNER JOIN GameStats gs2
ON p2.PlayerID = gs2.PlayerID AND m.MatchID = gs2.MatchID
ORDER BY m.Datetime DESC
LIMIT 100;

-- SelectPlayerInfo
-- Select Player Information and Global Statistics
DELIMITER //
CREATE PROCEDURE SelectPlayerInfo (IN PlayerID INT)
BEGIN
    
    DECLARE EXIT HANDLER FOR SQLEXCEPTION, SQLWARNING
	BEGIN
        RESIGNAL;
	END;
    
		BEGIN
			SELECT DISTINCT p.PlayerID, p.Name, p.FirstSeen, p.LastSeen, SelectEloFN(p.PlayerID) as Elo, COUNT(m.MatchID) as GamesPlayed,
			SUM(CASE WHEN p.PlayerID=m.Winner THEN 1 ELSE 0 END) as GamesWon,
			SUM(CASE WHEN p.PlayerID!=m.Winner THEN 1 ELSE 0 END) as GamesLost,
			SUM(ifnull(gs.Score,0)) AS Score,
			SUM(ifnull(gs.Kills,0)) AS Kills,
			SUM(ifnull(gs.Deaths,0)) AS Deaths,
			SUM(ifnull(gs.Suicides,0)) AS Suicides,
			SUM(ifnull(gs.Net,0)) AS Net,
			SUM(ifnull(gs.DamageGiven,0)) AS DamageGiven,
			SUM(ifnull(gs.DamageTaken,0)) AS DamageTaken,
			SUM(ifnull(gs.Captures,0)) AS Captures,
			SUM(ifnull(gs.Assists,0)) AS Assists,
			SUM(ifnull(gs.Defense,0)) AS Defense,
			SUM(ifnull(gs.Returns,0)) AS Returns,
			SUM(ifnull(gs.HealthTotal,0)) AS HealthTotal,
			SUM(ifnull(gs.ArmorTotal,0)) AS ArmorTotal,
			SUM(ifnull(gs.MHPickups,0)) AS MHPickups,
			SUM(ifnull(gs.RAPickups,0)) AS RAPickups,
			SUM(ifnull(gs.YAPickups,0)) AS YAPickups,
			SUM(ifnull(gs.GAPickups,0)) AS GAPickups,
			SUM(ifnull(gs.QuadPickups,0)) AS QuadPickups,
			SUM(ifnull(gs.BSPickups,0)) AS BSPickups,
			SUM(ifnull(gs.InvisPickups,0)) AS InvisPickups,
			SUM(ifnull(gs.FlightPickups,0)) AS FlightPickups,
			SUM(ifnull(gs.RegenPickups,0)) AS RegenPickups,
			SUM(ifnull(gs.FlagGrabs,0)) AS FlagGrabs,
			SUM(ifnull(gs.QuadTime,0)) AS QuadTime,
			SUM(ifnull(gs.BSTime,0)) AS BSTime,
			SUM(ifnull(gs.InvisTime,0)) AS InvisTime,
			SUM(ifnull(gs.FlightTime,0)) AS FlightTime,
			SUM(ifnull(gs.RegenTime,0)) AS RegenTime,
			SUM(ifnull(gs.FlagTime,0)) AS FlagTime,
			SUM(ifnull(gs.GKills,0)) AS GKills,
			SUM(ifnull(gs.MGKills,0)) AS MGKills,
			SUM(ifnull(gs.MGShots,0)) AS MGShots,
			SUM(ifnull(gs.MGHits,0)) AS MGHits,
			SUM(ifnull(gs.SGKills,0)) AS SGKills,
			SUM(ifnull(gs.SGShots,0)) AS SGShots,
			SUM(ifnull(gs.SGHits,0)) AS SGHits,
			SUM(ifnull(gs.PGKills,0)) AS PGKills,
			SUM(ifnull(gs.PGShots,0)) AS PGShots,
			SUM(ifnull(gs.PGHits,0)) AS PGHits,
			SUM(ifnull(gs.RLKills,0)) AS RLKills,
			SUM(ifnull(gs.RLShots,0)) AS RLShots,
			SUM(ifnull(gs.RLHits,0)) AS RLHits,
			SUM(ifnull(gs.LGKills,0)) AS LGKills,
			SUM(ifnull(gs.LGShots,0)) AS LGShots,
			SUM(ifnull(gs.LGHits,0)) AS LGHits,
			SUM(ifnull(gs.RGKills,0)) AS RGKills,
			SUM(ifnull(gs.RGShots,0)) AS RGShots,
			SUM(ifnull(gs.RGHits,0)) AS RGHits,
			SUM(ifnull(gs.BFGKills,0)) AS BFGKills,
			SUM(ifnull(gs.BFGShots,0)) AS BFGShots,
			SUM(ifnull(gs.BFGHits,0)) AS BFGHits,
			SUM(ifnull(gs.GLKills,0)) AS GLKills,
			SUM(ifnull(gs.GLShots, 0)) AS GLShots,
			SUM(ifnull(gs.GLHits,0)) AS GLHits,
			SUM(ifnull(gs.TFKills,0)) AS TFKills
			FROM Players p
			LEFT JOIN Matches m
			ON (p.PlayerID = m.Player1ID) XOR (p.PlayerID = m.Player2ID)
			LEFT JOIN GameStats gs
			ON (p.PlayerID = gs.PlayerID) AND (m.MatchID = gs.MatchID)
			WHERE p.PlayerID=playerid
            GROUP BY p.PlayerID;
		END;
END //
DELIMITER ;

-- SelectPlayersMatches
-- Selects all matches a player has participated in
-- and some basic information about them.
DELIMITER //
CREATE PROCEDURE SelectPlayersMatches (IN PlayerID INT)
BEGIN
    
    DECLARE EXIT HANDLER FOR SQLEXCEPTION, SQLWARNING
	BEGIN
        RESIGNAL;
	END;
    
		BEGIN
			SELECT DISTINCT p1.Name AS P1Name, p2.Name as P2Name, m.MatchID, m.Datetime, m.Map, 
			m.P1EloChange, m.P2EloChange, m.Player1ID, m.Player2ID, gs1.Score as P1Score, gs2.Score as P2Score
			FROM Players p1
			INNER JOIN Matches m
			ON p1.PlayerID = m.Player1ID
			INNER JOIN GameStats gs1
			ON (m.Player1ID = gs1.PlayerID) AND (m.MatchID = gs1.MatchID)
			INNER JOIN Players p2
			ON p2.PlayerID = m.Player2ID
			INNER JOIN GameStats gs2
			ON (m.Player2ID = gs2.PlayerID) AND (m.MatchID = gs2.MatchID)
			WHERE ((p1.PlayerID=PlayerID) XOR (p2.PlayerID=PlayerID)) AND ((m.Player1ID=PlayerID) XOR (m.Player2ID=PlayerID))
			ORDER BY Datetime DESC;
		END;
END //
DELIMITER ;

-- SelectMatch
-- Select full fnformation from a match by a given ID
DELIMITER //
CREATE PROCEDURE SelectMatch (IN MatchID INT)
BEGIN
    
    DECLARE EXIT HANDLER FOR SQLEXCEPTION, SQLWARNING
	BEGIN
        RESIGNAL;
	END;
    
		BEGIN
			SELECT m.MatchID, m.Datetime, m.Map, m.Winner, p1.PlayerID as P1ID, p1.Name as P1Name, m.P1EloChange, m.P2EloChange, SelectEloFN(p1.PlayerID) as P1Elo, SelectEloFN(p2.PlayerID) as P2Elo,
			gs1.Score as P1Score, gs1.Suicides as P1Suicides, gs1.Kills as P1Kills, gs1.Deaths as P1Deaths, gs1.Net as P1Net,
			gs1.DamageGiven as P1DamageGiven, gs1.DamageTaken as P1DamageTaken, 
            gs1.Captures AS P1Captures, gs1.Assists AS P1Assists, gs1.Defense AS P1Defense, gs1.Returns AS P1Returns,
            gs1.HealthTotal as P1HealthTotal, gs1.ArmorTotal as P1ArmorTotal,
			gs1.GKills as P1GKills, 
			gs1.MGKills as P1MGKills, gs1.MGShots as P1MGShots, gs1.MGHits as P1MGHits, 
			gs1.SGKills as P1SGKills, gs1.SGShots as P1SGShots, gs1.SGHits as P1SGHits,
			gs1.PGKills as P1PGKills, gs1.PGShots as P1PGShots, gs1.PGHits as P1PGHits,
			gs1.RLKills as P1RLKills, gs1.RLShots as P1RLShots, gs1.RLHits as P1RLHits,
			gs1.LGKills as P1LGKills, gs1.LGShots as P1LGShots, gs1.LGHits as P1LGHits,
			gs1.RGKills as P1RGKills, gs1.RGShots as P1RGShots, gs1.RGHits as P1RGHits,
			gs1.BFGKills as P1BFGKills, gs1.BFGShots as P1BFGShots, gs1.BFGHits as P1BFGHits,
			gs1.GLKills as P1GLKills, gs1.GLShots as P1GLShots, gs1.GLHits as P1GLHits,
			gs1.TFKills as P1TFKills,
			gs1.MHPickups as P1MHPickups, gs1.RAPickups as P1RAPickups, gs1.YAPickups as P1YAPickups, gs1.GAPickups as P1GAPickups,
            gs1.QuadPickups AS P1QuadPickups, gs1.BSPickups AS P1BSPickups, gs1.InvisPickups AS P1InvisPickups, gs1.FlightPickups AS P1FlightPickups,
            gs1.RegenPickups AS P1RegenPickups, gs1.FlagGrabs AS P1FlagGrabs, gs1.QuadTime AS P1QuadTime, gs1.BSTime AS P1BSTime, gs1.InvisTime AS P1InvisTime,
            gs1.FlightTime AS P1FlightTime, gs1.RegenTime AS P1RegenTime, gs1.FlagTime as P1FlagTime,
			p2.PlayerID as P2ID, p2.Name as P2Name, gs2.Score as P2Score, gs2.Suicides as P2Suicides, gs2.Kills as P2Kills, gs2.Deaths as P2Deaths, gs2.Net as P2Net,
			gs2.DamageGiven as P2DamageGiven, gs2.DamageTaken as P2DamageTaken, 
            gs2.Captures AS P2Captures, gs2.Assists AS P2Assists, gs2.Defense AS P2Defense, gs2.Returns AS P2Returns,
            gs2.HealthTotal as P2HealthTotal, gs2.ArmorTotal as P2ArmorTotal,
			gs2.GKills as P2GKills, 
			gs2.MGKills as P2MGKills, gs2.MGShots as P2MGShots, gs2.MGHits as P2MGHits, 
			gs2.SGKills as P2SGKills, gs2.SGShots as P2SGShots, gs2.SGHits as P2SGHits,
			gs2.PGKills as P2PGKills, gs2.PGShots as P2PGShots, gs2.PGHits as P2PGHits,
			gs2.RLKills as P2RLKills, gs2.RLShots as P2RLShots, gs2.RLHits as P2RLHits,
			gs2.LGKills as P2LGKills, gs2.LGShots as P2LGShots, gs2.LGHits as P2LGHits,
			gs2.RGKills as P2RGKills, gs2.RGShots as P2RGShots, gs2.RGHits as P2RGHits,
			gs2.BFGKills as P2BFGKills, gs2.BFGShots as P2BFGShots, gs2.BFGHits as P2BFGHits,
			gs2.GLKills as P2GLKills, gs2.GLShots as P2GLShots, gs2.GLHits as P2GLHits,
			gs2.TFKills as P2TFKills,
			gs2.MHPickups as P2MHPickups, gs2.RAPickups as P2RAPickups, gs2.YAPickups as P2YAPickups, gs2.GAPickups as P2GAPickups,
            gs2.QuadPickups AS P2QuadPickups, gs2.BSPickups AS P2BSPickups, gs2.InvisPickups AS P2InvisPickups, gs2.FlightPickups AS P2FlightPickups,
            gs2.RegenPickups AS P2RegenPickups, gs2.FlagGrabs AS P2FlagGrabs, gs2.QuadTime AS P2QuadTime, gs2.BSTime AS P2BSTime, gs2.InvisTime AS P2InvisTime,
            gs2.FlightTime AS P2FlightTime, gs2.RegenTime AS P2RegenTime, gs2.FlagTime as P2FlagTime
			FROM Matches m
			INNER JOIN Players p1
			ON p1.PlayerID = m.Player1ID
			INNER JOIN Players p2
			ON p2.PlayerID = m.Player2ID
			INNER JOIN GameStats gs1
			ON m.Player1ID = gs1.PlayerID AND m.MatchID = gs1.MatchID
			INNER JOIN GameStats gs2
			ON m.Player2ID = gs2.PlayerID AND m.MatchID = gs2.MatchID
			WHERE m.MatchID=MatchID;
        END;
END //
DELIMITER ;

-- MatchesList
-- Basic MatchList View for selection forms
CREATE VIEW MatchesList AS 
SELECT m.MatchID, m.Map, m.Datetime, p1.Name AS P1Name, p2.Name as P2Name
FROM Matches m
INNER JOIN Players p1
ON p1.PlayerID = m.Player1ID
INNER JOIN Players p2
ON p2.PlayerID = m.Player2ID
ORDER BY m.Datetime DESC;