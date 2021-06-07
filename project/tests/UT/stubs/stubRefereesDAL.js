class stubRefereesDAL {

  referees = []

  async getRefereeById(refereeId) {
    const referee = this.referees.find(referee => referee.id == refereeId)
    return this.promise(referee)
  }

  givenReferee(referee) {
    this.referees.push(referee)
  }

  reset() {
    this.referees = []
  }

  async promise(value) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(value);
      }, 10);
    });
  }
}


module.exports = stubRefereesDAL