class stubRoundsDAL {

  rounds = []

  async getRoundById(roundId) {
    const round = this.rounds.find(round => round.id == roundId)
    return this.promise(round)
  }

  givenRound(round) {
    this.rounds.push(round)
  }

  reset() {
    this.rounds = []
  }

  async promise(value) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(value);
      }, 10);
    });
  }
}


module.exports = stubRoundsDAL