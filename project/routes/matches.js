var express = require("express");
var router = express.Router();
const matches_utils = require("./BL/matchesBL");
const Errors = require("../errors");
const DButils = require("./utils/DButils");

router.post("/add", async (req, res, next) => {

  if (!req.session || !req.session.user_id) {
    res.status(403).send(Errors.USER_NOT_LOGGED_IN)
  } else {
    const user = await DButils.execQuery(`SELECT * FROM dbo.Users where id = ${req.session.user_id}`)

    if (user.length == 0) {
      res.status(403).send(Errors.USER_NOT_LOGGED_IN)
    } else if (user[0].UserRole != "ADMIN") {
      res.status(403).send(Errors.USER_MUST_BE_ADMIN)
    } else {

      try {
        matchId = await matches_utils.addMatch(
          ~~req.body.roundId,
          ~~req.body.homeTeamId,
          ~~req.body.awayTeamId,
          req.body.refereeId,
          req.body.startTime,
        );

        const match_details = await matches_utils.getMatchDetails(matchId);

        res.status(201).send(match_details)
      }
      catch (error) {
        next(error);
      }
    }
  }
})

module.exports = router;
