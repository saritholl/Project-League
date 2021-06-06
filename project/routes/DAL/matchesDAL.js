const DButils = require("../../utils/DButils");

// TODO: tests
class matchesDAL {
  async addMatch(match) {
    await DButils.execQuery(
      `insert into dbo.Matches (roundId,homeTeamId,awayTeamId,refereeId,startTime)`
      + ` values (${match.roundId},${match.homeTeamId},${match.awayTeamId},'${match.refereeId}','${match.startTime}')`
    );
  
    id = await DButils.execQuery(
      `select @@identity`
    );
  
    return id[0]['']
  }

  async getMatchesByTeamId(team_id) {
    return await DButils.execQuery(`SELECT * FROM dbo.Matches where homeTeamId = '${team_id}' or awayTeamId = '${team_id}'`)
  }
}


exports.matchesDAL = matchesDAL;
