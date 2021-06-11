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

  async getMatchById(match_id) {
    const matches = await DButils.execQuery(`SELECT * FROM dbo.Fixtures where id = ${match_id}`)

    if (matches.length == 0) {
      return null
    } else {
      return matches[0]
    }
  }

  async getMatchesByRefereeId(referee_id) {
    return await DButils.execQuery(`SELECT * FROM dbo.Fixtures where refereeId1 = ${referee_id} or refereeId2 = ${referee_id} or refereeId3 = ${referee_id} or refereeId4 = ${referee_id}`)
  }

  async setReferees(matchId, refereeId1, refereeId2, refereeId3, refereeId4) {
    return await DButils.execQuery(`UPDATE dbo.Fixtures set 
    refereeId1 = ${refereeId1},
     refereeId2 = ${refereeId2},
      refereeId3 = ${refereeId3}, 
      refereeId4 = ${refereeId4} 
    where id = ${matchId}`)
  }
}

module.exports = matchesDAL
