const DButils = require("../utils/DButils");

class refereesDAL {
  async addReferee(referee) {
    await DButils.execQuery(
      `insert into dbo.Referees (refereeName, refereeRole)`
      + ` values ('${referee.refereeName}','${referee.refereeRole}')`
    );
  
    const id = await DButils.execQuery(
      `select @@identity`
    );
  
    return id[0]['']
  }

  async deleteRefereeById(refereeId) {
    await DButils.execQuery(`delete from dbo.Referees where id = ${refereeId}`)
  }

  async getRefereeById(refereeId) {
    const referees = await DButils.execQuery(`SELECT * FROM dbo.Referees where id = ${refereeId}`)

    if (referees.length == 0) {
      return null
    } else {
      return referees[0]
    }
  }
}

module.exports = refereesDAL
