const DButils = require("../utils/DButils");

class refereesDAL {
  async getRefereeById(refereeId) {
    const referees = await DButils.execQuery(`SELECT * FROM dbo.Referees where id = '${refereeId}'`)

    if (referees.length == 0) {
      return null
    } else {
      return referees[0]
    }
  }
}


module.exports = refereesDAL
