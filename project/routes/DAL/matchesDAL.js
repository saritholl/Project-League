const DButils = require("../utils/DButils");

class matchesDAL {
  async addMatch(match) {
    await DButils.execQuery(
      `insert into dbo.Fixtures (roundId,homeTeamId,awayTeamId,stadiumId,refereeId1,refereeId2,refereeId3,refereeId4,startTime)`
      + ` values (${match.roundId},${match.homeTeamId},${match.awayTeamId},${match.stadiumId},${match.refereeId1},${match.refereeId2},${match.refereeId3},${match.refereeId4},'${match.startTime}')`
    );
  
    const id = await DButils.execQuery(
      `select @@identity`
    );
  
    return id[0]['']
  }

  async getMatchesByTeamId(team_id) {
    return await DButils.execQuery(`SELECT * FROM dbo.Fixtures where homeTeamId = ${team_id} or awayTeamId = ${team_id}`)
  }

  async getMatchesByRefereeId(referee_id) {
    return await DButils.execQuery(`SELECT * FROM dbo.Fixtures where refereeId1 = ${referee_id} or refereeId2 = ${referee_id} or refereeId3 = ${referee_id} or refereeId4 = ${referee_id}`)
  }
}

module.exports = matchesDAL
