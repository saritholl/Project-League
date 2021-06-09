class stubStadiumsDAL {

  stadiums = []

  async getStadiumById(stadiumId) {
    const stadium = this.stadiums.find(stadium => stadium.id == stadiumId)
    return this.promise(stadium)
  }

  givenStadium(stadium) {
    this.stadiums.push(stadium)
  }

  reset() {
    this.stadiums = []
  }

  async promise(value) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(value);
      }, 10);
    });
  }
}


module.exports = stubStadiumsDAL