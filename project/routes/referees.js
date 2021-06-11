var express = require("express");
var router = express.Router();
const DButils = require("./utils/DButils");

const refereesBL = require("./BL/refereesBL");
const refereesDAL = require("./DAL/refereesDAL");

const matchesDAL = require("./DAL/matchesDAL");

const referees_utils = new refereesBL(new refereesDAL(), new matchesDAL())

// UC 9.3
router.post("/add", async (req, res, next) => {



  if (!req.session || !req.session.user_id) {
    throw { status: 401, message: "please login before trying the following request" };
  }
  const user = (
    await DButils.execQuery(
      `SELECT * FROM dbo.UsersTable WHERE UserName = '${req.session.user_id}'`
    )
  )[0];
  if (!(user.UserRole == "ADMIN")) {
    throw { status: 403, message: "no premission to do the following" };
  }

  if (!req.headers || !req.headers.user_id) {
    res.status(403).send(Errors.USER_NOT_LOGGED_IN)
  } else {
    const user = await DButils.execQuery(`SELECT * FROM dbo.Users where id = ${req.headers.user_id}`)

    if (user.length == 0) {
      res.status(403).send(Errors.USER_NOT_LOGGED_IN)
    } else if (user[0].UserRole != "ADMIN") {
      res.status(403).send(Errors.USER_MUST_BE_ADMIN)
    } else {
      try {

        let refereeName = req.body.refereeName;
        let refereeType = req.body.refereeRole;

        await referees_utils.addReferee(refereeName, refereeType)

        res.status(201).send('referee was created succsessfully');
      } catch (error) {
        next(error);
      }
    }
  }
});

// UC 9.4
router.post("/delete", async (req, res, next) => {
  if (!req.headers || !req.headers.user_id) {
    res.status(403).send(Errors.USER_NOT_LOGGED_IN)
  } else {
    const user = await DButils.execQuery(`SELECT * FROM dbo.Users where id = ${req.headers.user_id}`)

    if (user.length == 0) {
      res.status(403).send(Errors.USER_NOT_LOGGED_IN)
    } else if (user[0].UserRole != "ADMIN") {
      res.status(403).send(Errors.USER_MUST_BE_ADMIN)
    } else {
      try {
        let referee_id = req.body.referee_id;
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
    } else if (user[0].UserRole != "ADMIN") {
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
