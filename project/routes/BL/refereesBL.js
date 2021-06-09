const { Int } = require("mssql");
const Errors = require("../../errors");



class refereesBL {
  constructor(refereesDAL) {
    this.refereesDAL = refereesDAL
  }

  

  async addReferee(refereeName,refereeType,refereeStatus) {

    if (refereeName == null || refereeType == null || refereeStatus == null ) {
      throw {
        "message": Errors.PARAMETER_NULL,
        "code": 404
      }
    }

    if (!(Number.isInteger(refereeType)) || !(Number.isInteger(refereeStatus))  || !(typeof refereeName === 'string')){
      throw {
        "message": Errors.WRONG_INSTANCE_OF_PARAMETER,
        "code": 400
      }
    }

    if (refereeType < 0 || refereeStatus < 0 ) {
      throw {
        "message": Errors.INVALID_PARAMETER,
        "code": 400
      }
    }


    if (!(refereeName.split(" ").length == 2)) {
      throw {
        "message": Errors.INVALID_REFEREE_NAME,
        "code": 404
      }
    }

    if (!(refereeType == 0) || !(refereeType == 1)) {
      throw {
        "message": Errors.REFEREE_TYPE_NOT_LEGAL,
        "code": 404
      }
    }

    const refereeName = await this.refereesDAL.getRefereesByName(refereeName)
    if (!refereeName) {
      throw {
        "message": Errors.REFEREE_NAME_NOT_FOUND,
        "code": 404
      }
    }

    return this.refereesDAL.addReferee({refereeName,refereeType,refereeStatus})
  }
}

module.exports = refereesBL