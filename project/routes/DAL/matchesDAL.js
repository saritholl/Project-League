const DButils = require("../utils/DButils");

class matchesDAL {
  async addMatch(match) {
    await DButils.execQuery(
      `insert into dbo.Fixtures (roundId,homeTeamId,awayTeamId,stadiumId,startTime)`
      + ` values (${match.roundId},${match.homeTeamId},${match.awayTeamId},${match.stadiumId},'${match.startTime}')`
    );
  
    const id = await DButils.execQuery(
      `select @@identity`
    );
  
    return id[0]['']
  }

  async getMatchesByTeamId(team_id) {
    return await DButils.execQuery(`SELECT * FROM dbo.Fixtures where homeTeamId = ${team_id} or awayTeamId = ${team_id}`)
  }
}

module.exports = matchesDAL
