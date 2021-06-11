const Errors = require("../../errors");


class refereesBL {
  constructor(refereesDAL, matchesDAL) {
    this.refereesDAL = refereesDAL
    this.matchesDAL = matchesDAL
  }

  async addReferee(refereeName, refereeRole) {
    if (!refereeName || !refereeRole) {
      throw {
        "message": Errors.PARAMETER_NULL,
        "code": 400
      }
    }

    const roleUpperCase = refereeRole.toUpperCase()
    
    if (roleUpperCase != 'MAIN' && roleUpperCase != 'ASSISTANT') {
      throw {
        "message": Errors.INVALID_REFEREE_ROLE,
        "code": 400
      }
    }

    return this.refereesDAL.addReferee({
      refereeName,
      refereeRole: roleUpperCase
    })
  }

  async deleteById(id) {
    if (id == null) {
      throw {
        "message": Errors.PARAMETER_NULL,
        "code": 400
      }
    }

    this.refereesDAL.deleteRefereeById(id)
  }

  async setRefereesToMatch(matchId, refereeId1, refereeId2, refereeId3, refereeId4) {

    if (!matchId || !refereeId1 || !refereeId2 || !refereeId3 || !refereeId4) {
      throw {
        "message": Errors.PARAMETER_NULL,
        "code": 400
      }
    }

    if (!(Number.isInteger(matchId)) || !(Number.isInteger(refereeId1)) || !(Number.isInteger(refereeId2)) || !(Number.isInteger(refereeId3)) || !(Number.isInteger(refereeId4))) {
      throw {
        "message": Errors.WRONG_INSTANCE_OF_PARAMETER,
        "code": 400
      }
    }

    const refereesId = [refereeId1, refereeId2, refereeId3, refereeId4]
    if ((new Set(refereesId)).size !== refereesId.length) {
      throw {
        "message": Errors.DUPLICATE_REFEREE,
        "code": 400
      }
    }

    const match = await this.matchesDAL.getMatchById(matchId)
    if (!match) {
      throw {
        "message": Errors.MATCH_NOT_FOUND,
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
    if (referees.every(ref => ref.refereeRole != 'MAIN')) {
      throw {
        "message": Errors.NO_MAIN_REFEREE,
        "code": 400
      }
    }

    const referee1_matches = await this.matchesDAL.getMatchesByRefereeId(refereeId1)
    const referee2_matches = await this.matchesDAL.getMatchesByRefereeId(refereeId2)
    const referee3_matches = await this.matchesDAL.getMatchesByRefereeId(refereeId3)
    const referee4_matches = await this.matchesDAL.getMatchesByRefereeId(refereeId4)
    const match_day = new Date(match.startTime)
    if (this.#refereeHasMatchInDate(referee1_matches, match_day) ||
      this.#refereeHasMatchInDate(referee2_matches, match_day) ||
      this.#refereeHasMatchInDate(referee3_matches, match_day) ||
      this.#refereeHasMatchInDate(referee4_matches, match_day)) {
      throw {
        "message": Errors.REFEREE_ALREADY_SET_TO_MATCH_THIS_DAY,
        "code": 400
      }
    }

    await this.matchesDAL.setReferees(matchId, refereeId1, refereeId2, refereeId3, refereeId4)
    return true
  }

  #refereeHasMatchInDate = (matches, date) =>
    matches.some(match => this.#datesAreOnSameDay(new Date(match.startTime), date))

  #datesAreOnSameDay = (first, second) =>
    first.getFullYear() === second.getFullYear() &&
    first.getMonth() === second.getMonth() &&
    first.getDate() === second.getDate();
}

module.exports = refereesBL
