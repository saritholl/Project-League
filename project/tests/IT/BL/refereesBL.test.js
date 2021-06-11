
const { expect } = require('@jest/globals');
const matchesDAL = require('../../../routes/DAL/matchesDAL');
const refereesDAL = require('../../../routes/DAL/refereesDAL');

const refereesBL = require('../../../routes/BL/refereesBL');
const DButils = require("../../../routes/utils/DButils");
const refereesBl = new refereesBL(new refereesDAL(), new matchesDAL())

beforeEach(async () => {
    await DButils.execQuery(`DELETE FROM dbo.Fixtures`)
    await DButils.execQuery(`DELETE FROM dbo.Referees`)
});

const roundId = 240941
const homeTeamId = 180
const awayTeamId = 339
const stadiumId = 5599
const startTime = (new Date((new Date(new Date().setDate(new Date().getDate() + 1)).setHours(16) - (new Date()).getTimezoneOffset() * 60000))).toISOString().slice(0, -1)
const refereeName = 'Sarit'
const refereeRole = 'MAIN'

describe('referees BL', () => {

    test(`add referee`, async () => {

        const id = await refereesBl.addReferee(refereeName, refereeRole)

        const db_refs = await DButils.execQuery(`select * from dbo.Referees where id = ${id}`)
        expect(db_refs[0]).toEqual(
            {
                id,
                refereeName,
                refereeRole
            }
        )
    });

    test(`delete referee`, async () => {

        const id = await refereesBl.addReferee(refereeName, refereeRole)

        await refereesBl.deleteById(id)


        const db_refs = await DButils.execQuery(`select * from dbo.Referees where id = ${id}`)
        expect(db_refs.length).toBe(0)

    });

    test(`set referees`, async () => {
        await DButils.execQuery(`INSERT INTO dbo.Fixtures (roundId, homeTeamId, awayTeamId, stadiumId, startTime)
         VALUES (${roundId}, ${homeTeamId}, ${awayTeamId}, ${stadiumId}, '${startTime}')`)

        const db_id = await DButils.execQuery(
            `select @@identity`
        );

        const matchId = db_id[0]['']

        const refereeId1 = await refereesBl.addReferee(refereeName, refereeRole)
        const refereeId2 = await refereesBl.addReferee(refereeName, refereeRole)
        const refereeId3 = await refereesBl.addReferee(refereeName, refereeRole)
        const refereeId4 = await refereesBl.addReferee(refereeName, refereeRole)

        await expect(refereesBl.setRefereesToMatch(matchId, refereeId1, refereeId2, refereeId3, refereeId4)).resolves.toBe(true)

        const match_with_refs = await DButils.execQuery(`select * from dbo.Fixtures where id = ${matchId}`)
        expect(match_with_refs[0].refereeId1).toBe(refereeId1)
        expect(match_with_refs[0].refereeId2).toBe(refereeId2)
        expect(match_with_refs[0].refereeId3).toBe(refereeId3)
        expect(match_with_refs[0].refereeId4).toBe(refereeId4)

    });
})