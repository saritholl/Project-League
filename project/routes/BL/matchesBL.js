// const axios = require("axios");
// const api_domain = "https://soccer.sportmonks.com/api/v2.0";
const Errors = require("../../errors");


// TODO: IT matchesBL
// TODO: IT matches.js
// TODO: IT teamsDAL - todo
// TODO: IT stadiumsDAL - todo
// TODO: UT matchesBL - more tests

class matchesBL {
  constructor(matchesDAL, refereesDAL, teamsDAL, stadiumsDAL, roundsDAL) {
    this.matchesDAL = matchesDAL
    this.refereesDAL = refereesDAL
    this.teamsDAL = teamsDAL
    this.stadiumsDAL = stadiumsDAL
    this.roundsDAL = roundsDAL
  }

  datesAreOnSameDay = (first, second) =>
    first.getFullYear() === second.getFullYear() &&
    first.getMonth() === second.getMonth() &&
    first.getDate() === second.getDate();

  refereeHasMatchInDate = (matches, date) =>
    matches.some(match => this.datesAreOnSameDay(new Date(match.startTime), date))

  async addMatch(roundId, homeTeamId, awayTeamId, stadiumId, refereeId1, refereeId2, refereeId3, refereeId4, startTime) {
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

    const referee1 = await this.refereesDAL.getRefereeById(refereeId1)
    if (!referee1) {
      throw {
        "message": Errors.REFEREE_NOT_FOUND,
        "code": 404
      }
    }

    const referee2 = await this.refereesDAL.getRefereeById(refereeId2)
    if (!referee2) {
      throw {
        "message": Errors.REFEREE_NOT_FOUND,
        "code": 404
      }
    }

    const referee3 = await this.refereesDAL.getRefereeById(refereeId3)
    if (!referee3) {
      throw {
        "message": Errors.REFEREE_NOT_FOUND,
        "code": 404
      }
    }

    const referee4 = await this.refereesDAL.getRefereeById(refereeId4)
    if (!referee4) {
      throw {
        "message": Errors.REFEREE_NOT_FOUND,
        "code": 404
      }
    }

    const referees = [referee1, referee2, referee3, referee4]
    if (referees.every(ref => ref.RefereeRole != 'Main')) {
      throw {
        "message": Errors.NO_MAIN_REFEREE,
        "code": 400
      }
    }

    const refereesId = [refereeId1, refereeId2, refereeId3, refereeId4]
    if ((new Set(refereesId)).size !== refereesId.length) {
      throw {
        "message": Errors.REFEREE_ALREADY_SET_IN_THIS_MATCH,
        "code": 400
      }
    }

    const referee1_matches = await this.matchesDAL.getMatchesByRefereeId(refereeId1)
    const referee2_matches = await this.matchesDAL.getMatchesByRefereeId(refereeId2)
    const referee3_matches = await this.matchesDAL.getMatchesByRefereeId(refereeId3)
    const referee4_matches = await this.matchesDAL.getMatchesByRefereeId(refereeId4)
    const match_day = new Date(startTime)
    if (this.refereeHasMatchInDate(referee1_matches, match_day) ||
      this.refereeHasMatchInDate(referee2_matches, match_day) ||
      this.refereeHasMatchInDate(referee3_matches, match_day) ||
      this.refereeHasMatchInDate(referee4_matches, match_day)) {
      throw {
        "message": Errors.REFEREE_ALREADY_SET_TO_MATCH_THIS_DAY,
        "code": 400
      }
    }

    const current_game_date = new Date(startTime).toLocaleDateString()
    const homeTeamMatches = await this.getTeamMatches(homeTeamId)

    if (homeTeamMatches.some(match => new Date(match.startTime).toLocaleDateString() == current_game_date)) {
      throw {
        "message": Errors.TEAM_ALREADY_PLAYS_THIS_DAY,
        "code": 400
      }
    }

    const awayTeamMatches = await this.getTeamMatches(awayTeamId)
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

    return this.matchesDAL.addMatch({ roundId, homeTeamId, awayTeamId, stadiumId, refereeId1, refereeId2, refereeId3, refereeId4, startTime })
  }

  async getTeamMatches(homeTeamId) {
    return this.matchesDAL.getMatchesByTeamId(homeTeamId)
  }
}

module.exports = matchesBL
