var express = require("express");
var router = express.Router();
const DButils = require("../routes/utils/DButils");
const league_details = require("./utils/league_utils");
const game_utils = require("./utils/game_utils");


// UC 9.3
router.post("/addReferee", async (req, res, next) => {
  try {
    if(!req.session || !req.session.user_id)
    {
    throw { status: 401, message: "please login before trying the following request" };
    }
    const user = (
    await DButils.execQuery(
        `SELECT * FROM dbo.users WHERE username = '${req.session.user_id}'`
    )
    )[0];
    if(user.is_admin === 0)
    {
    throw { status: 403, message: "no premission to do the following" };
    }
    
    let referee_id = req.body.referee_id;
    let referee_name = req.body.referee_name;
    await DButils.execQuery(`INSERT INTO dbo.referees (referee_id,referee_name)
     , ${home_team_id}, '${referee_name}',)`
    );
    res.status(201).send('referee was added and created succsessfully');
  } catch (error) {
    next(error);
  }
});

// UC 9.4
router.post("/deleteReferee", async (req, res, next) => {
    try {
      if(!req.session || !req.session.user_id)
      {
      throw { status: 401, message: "please login before trying the following request" };
      }
      const user = (
      await DButils.execQuery(
          `SELECT * FROM dbo.users WHERE username = '${req.session.user_id}'`
      )
      )[0];
      if(user.is_admin === 0)
      {
      throw { status: 403, message: "no premission to do the following" };
      }
      
      let referee_id = req.body.referee_id;
      let referee_name = req.body.referee_name;
      await DButils.execQuery(`DELETE referee_id, referee_name FROM dbo.referees WHERE referee_id = ${referee_id} AND referee_name = '${referee_name}')`);
      res.status(201).send('referee was deleted succsessfully');
    } catch (error) {
      next(error);
    }
  });
  
  // UC 9.5
  router.put("/settingReferee", async (req, res, next) => {
    try{
      if(!req.session || !req.session.user_id)
      {
        throw { status: 401, message: "please login before trying the following request" };
      }
      const user = (
        await DButils.execQuery(
          `SELECT * FROM dbo.users WHERE username = '${req.session.user_id}'`
        )
      )[0];
      if(user.is_admin === 0)
      {
        throw { status: 403, message: "no premission to do the following" };
      }
      let league_name = req.body.league_name;
      let league_year = req.body.league_year;
      let referee_id = req.body.referee_id;
      let referee_name = req.body.referee_name;
      await DButils.execQuery(`UPDATE dbo.games SET home_team_score = ${home_score}, guest_team_score=${guest_score},is_past=1
      WHERE game_id = ${game_id}`);
      res.status(201).send("update result was successfully created.");
    } catch (error) {
      next(error);
    }
  
  });
 

module.exports = router;
