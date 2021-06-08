class stubTeamsDAL {

  teams = []

  async getTeamById(teamId) {
    const team = this.teams.find(team => team.id == teamId)
    return this.promise(team)
  }

  givenTeam(team) {
    this.teams.push(team)
  }

  reset() {
    this.teams = []
  }

  async promise(value) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(value);
      }, 10);
    });
  }
}


module.exports = stubTeamsDAL