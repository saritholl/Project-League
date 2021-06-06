var express = require("express");
var router = express.Router();
const matches_utils = require("./BL/matchesBL");

// TODO: test it + many validations
// TODO: catch exceptions?
router.post("/add", async (req, res, next) => {
  try{
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
})

module.exports = router;
