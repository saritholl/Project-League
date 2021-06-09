const { Int } = require("mssql");
const Errors = require("../../errors");

class matchesBL {
  constructor(matchesDAL, teamsDAL, stadiumsDAL, roundsDAL) {
    this.matchesDAL = matchesDAL
    this.teamsDAL = teamsDAL
    this.stadiumsDAL = stadiumsDAL
    this.roundsDAL = roundsDAL
  }

  async addMatch(roundId, homeTeamId, awayTeamId, stadiumId, startTime) {

    if (roundId == null || homeTeamId == null || awayTeamId == null || stadiumId == null || startTime == null) {
      throw {
        "message": Errors.PARAMETER_NULL,
        "code": 404
      }
    }

    if (!(Number.isInteger(roundId)) || !(Number.isInteger(homeTeamId)) || !(Number.isInteger(awayTeamId)) || !(Number.isInteger(stadiumId)) || !(typeof startTime === 'string')){
      throw {
        "message": Errors.WRONG_INSTANCE_OF_PARAMETER,
        "code": 400
      }
    }

    if (roundId < 0 || homeTeamId < 0 || awayTeamId < 0 || stadiumId < 0 || startTime < 0) {
      throw {
        "message": Errors.INVALID_PARAMETER,
        "code": 400
      }
    }

    if (!Number.isInteger(Date.parse(startTime))) {
      throw {
        "message": Errors.INVALID_PARAMETER,
        "code": 400
      }
    }

    if (homeTeamId == awayTeamId) {
      throw {
        "message": Errors.TEAM_AGAINST_ITSELFS,
        "code": 400
      }
    }

    const round = await this.roundsDAL.getRoundById(roundId)
    if (!round) {
      throw {
        "message": Errors.ROUND_NOT_FOUND,
        "code": 404
      }
    }

    const current_game_date = new Date(startTime).toLocaleDateString()
    const homeTeamMatches = await this.#getTeamMatches(homeTeamId)

    if (homeTeamMatches.some(match => new Date(match.startTime).toLocaleDateString() == current_game_date)) {
      throw {
        "message": Errors.TEAM_ALREADY_PLAYS_THIS_DAY,
        "code": 400
      }
    }

    const awayTeamMatches = await this.#getTeamMatches(awayTeamId)
    if (awayTeamMatches.some(match => new Date(match.startTime).toLocaleDateString() == current_game_date)) {
      throw {
        "message": Errors.TEAM_ALREADY_PLAYS_THIS_DAY,
        "code": 400
      }
    }

    const matchHour = new Date(startTime).getHours()
    if (matchHour >= 22 || matchHour < 12) {
      throw {
        "message": Errors.BAD_MATCH_TIME,
        "code": 400
      }
    }

    if (new Date(startTime) < new Date()) {
      throw {
        "message": Errors.PAST_TIME,
        "code": 400
      }
    }

    if (homeTeamMatches.some(match => match.homeTeamId == homeTeamId) && awayTeamMatches.some(match => match.awayTeamId == awayTeamId)) {
      throw {
        "message": Errors.MATCH_ALREADY_EXISTS,
        "code": 400
      }
    }

    if (homeTeamMatches.some(match => match.roundId == roundId)) {
      throw {
        "message": Errors.TEAM_ALREADY_PLAYED_THIS_ROUND,
        "code": 400
      }
    }

    if (awayTeamMatches.some(match => match.roundId == roundId)) {
      throw {
        "message": Errors.TEAM_ALREADY_PLAYED_THIS_ROUND,
        "code": 400
      }
    }

    const home_team = await this.teamsDAL.getTeamById(homeTeamId)
    if (!home_team) {
      throw {
        "message": Errors.TEAM_NOT_FOUND,
        "code": 404
      }
    }

    const away_team = await this.teamsDAL.getTeamById(awayTeamId)
    if (!away_team) {
      throw {
        "message": Errors.TEAM_NOT_FOUND,
        "code": 404
      }
    }


    if (home_team.leagueId != away_team.leagueId) {
      throw {
        "message": Errors.DIFFERENT_LEAGUES_TEAMS,
        "code": 400
      }
    }

    const stadium = await this.stadiumsDAL.getStadiumById(stadiumId)
    if (!stadium) {
      throw {
        "message": Errors.STADIUM_NOT_FOUND,
        "code": 404
      }
    }

    return this.matchesDAL.addMatch({ roundId, homeTeamId, awayTeamId, stadiumId, startTime })
  }

  async #getTeamMatches(homeTeamId) {
    return this.matchesDAL.getMatchesByTeamId(homeTeamId)
  }
}

module.exports = matchesBL
