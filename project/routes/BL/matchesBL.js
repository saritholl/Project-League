// const axios = require("axios");
// const api_domain = "https://soccer.sportmonks.com/api/v2.0";
const Errors = require("../../errors");


// TODO: tests
class matchesBL {
  constructor(matchesDAL) {
    this.matchesDAL = matchesDAL
  }

  async addMatch(roundId, homeTeamId, awayTeamId, refereeId, startTime) {
    if (homeTeamId == awayTeamId) {
      throw {
        "message": Errors.TEAM_AGAINST_ITSELFS,
        "code": 409
      }
    }

    const current_game_date = new Date(startTime).toLocaleDateString()
    const homeTeamMatches = await this.getTeamMatches(homeTeamId)

    if (homeTeamMatches.some(match => new Date(match.startTime).toLocaleDateString() == current_game_date)) {
      throw {
        "message": Errors.TEAM_ALREADY_PLAYS_THIS_DAY,
        "code": 402
      }
    }

    const awayTeamMatches = await this.getTeamMatches(awayTeamId)
    if (awayTeamMatches.some(match => new Date(match.startTime).toLocaleDateString() == current_game_date)) {
      throw {
        "message": Errors.TEAM_ALREADY_PLAYS_THIS_DAY,
        "code": 402
      }
    }

    return this.matchesDAL.addMatch({ roundId, homeTeamId, awayTeamId, refereeId, startTime })
  }

  async getTeamMatches(homeTeamId) {
    return this.matchesDAL.getMatchesByTeamId(homeTeamId)
  }
}

module.exports = matchesBL
