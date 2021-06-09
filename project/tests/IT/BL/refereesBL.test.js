const { expect } = require('@jest/globals');

const refereesDAL = require('../../../routes/DAL/refereesDAL');

const refereesBL = require('../../../routes/BL/refereesBL');
const DButils = require("../../../routes/utils/DButils");
const refereesBl = new refereesBL(new refereesDAL())

beforeEach(async () => {
    await DButils.execQuery(`DELETE FROM dbo.Referees`)
});

const refereeName = "tom dugma"
const refereesType = 1
const refereesStatus = 0 // init by default to 0 when added.

describe('referees BL', () => {

    test(`add referee`, async () => {

        const id = await refereesBl.addReferee(
            refereeName,
            refereesType,
            refereesStatus,
        )

        const db_Referees = await DButils.execQuery(`select * from dbo.Referees where id = ${id}`)
        expect(db_Referees[0]).toEqual(
            {
                id,
                refereeName,
                refereesType,
                refereesStatus,
            }
        )
    });
})