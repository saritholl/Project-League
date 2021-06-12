var express = require("express");
var router = express.Router();
const DButils = require("./utils/DButils");
const Errors = require("../errors");

const refereesBL = require("./BL/refereesBL");
const refereesDAL = require("./DAL/refereesDAL");

const matchesDAL = require("./DAL/matchesDAL");

const referees_utils = new refereesBL(new refereesDAL(), new matchesDAL())

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
        let refereeName = req.body.refereeName;
        let refereeRole = req.body.refereeRole;

        const id = await referees_utils.addReferee(refereeName, refereeRole)

        res.status(201).send({
          id,
          refereeName,
          refereeRole
        });

      }
      catch (error) {
        next(error);
      }
    }
  }
})

// UC 9.4
router.delete("/delete", async (req, res, next) => {
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
        let referee_id = req.body.id;
        await referees_utils.deleteById(referee_id)

        res.status(200).send('referee was deleted succsessfully');
      } catch (error) {
        next(error);
      }
    }
  }
});

// UC 9.5
router.put("/settingReferees", async (req, res, next) => {
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

        let matchId = ~~req.body.matchId;

        let refereeId1 = ~~req.body.refereeId1;
        let refereeId2 = ~~req.body.refereeId2;
        let refereeId3 = ~~req.body.refereeId3;
        let refereeId4 = ~~req.body.refereeId4;
        await referees_utils.setRefereesToMatch(matchId, refereeId1, refereeId2, refereeId3, refereeId4)

        res.status(200).send("Referres were succsessfully set to match");
      } catch (error) {
        next(error);
      }
    }
  }
});


module.exports = router;
