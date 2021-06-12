class stubMatchesDAL {

  current_id = 0
  matches = []

  async addMatch(match) {
    this.current_id += 1
    match.id = this.current_id
    this.matches.push(match)

    return this.promise(this.current_id)
  }

  async getMatchesByTeamId(team_id) {
    const matches_of_team = this.matches.filter(match => match.homeTeamId == team_id || match.awayTeamId == team_id)
    return this.promise(matches_of_team)
  }

  async getMatchesByRefereeId(referee_id) {
    const matches_of_referee = this.matches.filter(match => match.refereeId1 == referee_id || match.refereeId2 == referee_id || match.refereeId3 == referee_id || match.refereeId4 == referee_id)
    return this.promise(matches_of_referee)
  }

  async setReferees(matchId, refereeId1, refereeId2, refereeId3, refereeId4) {

    const matchIndex = this.matches.findIndex((match => match.id == matchId));
    this.matches[matchIndex].refereeId1 = refereeId1
    this.matches[matchIndex].refereeId2 = refereeId2
    this.matches[matchIndex].refereeId3 = refereeId3
    this.matches[matchIndex].refereeId4 = refereeId4
  }

  givenMatch(match) {
    this.matches.push(match)
  }

  getMatchById(matchId) {
    return this.matches.find(match => match.id == matchId)
  }

  reset() {
    this.matches = []
    this.current_id = 0
  }

  async promise(value) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(value);
      }, 10);
    });
  }
}


module.exports = stubMatchesDAL