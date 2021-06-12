var express = require("express");
var router = express.Router();
const DButils = require("../routes/utils/DButils");

router.post("/login", async (req, res, next) => {
  try {
    const user = (
      await DButils.execQuery(
        `SELECT * FROM dbo.Users WHERE userName = '${req.body.userName}'`
      )
    )[0];

    // check that username exists & the password is correct
    if (!user || !(req.body.userPassword == user.userPassword)) {
      throw { status: 401, message: "Username or Password incorrect" };
    }

    // Set cookie
    req.session.user_id = user.id;
    res.header('user_id', user.id)

    res.status(200).send("login succeeded");
  } catch (error) {
    next(error);
  }
});

module.exports = router;