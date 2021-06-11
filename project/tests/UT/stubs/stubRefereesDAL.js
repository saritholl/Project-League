class stubRefereesDAL {

  current_id = 0

  referees = []

  async addReferee(referee) {
    this.current_id += 1
    referee.id = this.current_id
    this.referees.push(referee)
    return this.promise(this.current_id)
  }

  async deleteRefereeById(refereeId) {
    this.referees = this.referees.filter(function (ref) {
      return ref.id !== refereeId;
    });
  }

  async getRefereeById(refereeId) {
    const referee = this.referees.find(referee => referee.id == refereeId)
    return this.promise(referee)
  }
  
  givenMainReferee(id) {
    this.referees.push({
      id,
      RefereeName: 'Yossi',
      RefereeRole: 'MAIN'
    })
  }

  givenAssitantReferee(id) {
    this.referees.push({
      id,
      RefereeName: 'Dan',
      RefereeRole: 'ASSITANT'
    })
  }

  reset() {
    this.referees = []
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


module.exports = stubRefereesDAL