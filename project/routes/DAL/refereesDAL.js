const DButils = require("../utils/DButils");

class refereesDAL {
  async addReferee(referee) {
    await DButils.execQuery(
      `insert into dbo.referees (refereeName,refereeType,refereeStatus)`
      + ` values ('${referee.refereeName}',${referee.refereeType},${referee.refereeStatus})`
    );
  
    const id = await DButils.execQuery(
      `select @@identity`
    );
  
    return id[0]['']
  }

  async getRefereesById(refereeId) {
    return await DButils.execQuery(`SELECT * FROM dbo.referees where refereeId = ${refereeId}`)
  }

  async getRefereesByName(refereeName) {
    return await DButils.execQuery(`SELECT * FROM dbo.referees where refereeName = ${refereeName} `)
  }

  async deleteRefereeById(refereeId) {
    return await DButils.execQuery(`DELETE * FROM dbo.referees where refereeId = ${refereeId} `)
  }
}

module.exports = refereesDAL
