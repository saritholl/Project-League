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