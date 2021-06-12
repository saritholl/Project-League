var express = require("express");
var router = express.Router();
const matchesBL = require("./BL/matchesBL");
const matchesDAL = require("./DAL/matchesDAL");
const roundsDAL = require("./DAL/roundsDAL");
const stadiumsDAL = require("./DAL/stadiumsDAL");
const teamsDAL = require("./DAL/teamsDAL");

const Errors = require("../errors");
const DButils = require("./utils/DButils");
const matches_utils = new matchesBL(new matchesDAL(), new teamsDAL(), new stadiumsDAL(), new roundsDAL())

router.post("/add", async (req, res, next) => {

  if (!req.headers || !req.headers.user_id) {
    res.status(403).send(Errors.USER_NOT_LOGGED_IN)
  } else {
    const user = await DButils.execQuery(`SELECT * FROM dbo.Users where id = ${req.headers.user_id}`)

    if (user.length == 0) {
      res.status(403).send(Errors.USER_NOT_LOGGED_IN)
    } else if (user[0].userRole != "ADMIN") {
      res.status(403).send(Errors.USER_MUST_BE_ADMIN)
    } else {
      try {
        const roundId = ~~req.body.roundId
        const homeTeamId = ~~req.body.homeTeamId
        const awayTeamId = ~~req.body.awayTeamId
        const stadiumId = ~~req.body.stadiumId
        const startTime = req.body.startTime

        matchId = await matches_utils.addMatch(
          roundId,
          homeTeamId,
          awayTeamId,
          stadiumId,
          startTime
        );

        res.status(201).send({
          id: matchId,
          roundId,
          homeTeamId,
          awayTeamId,
          stadiumId,
          startTime
        })
      }
      catch (error) {
        next(error);
      }
    }
  }
})

module.exports = router;
