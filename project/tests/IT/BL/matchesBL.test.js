
const { expect } = require('@jest/globals');

const matchesDAL = require('../../../routes/DAL/matchesDAL');
const stadiumsDAL = require('../../../routes/DAL/stadiumsDAL');
const roundsDAL = require('../../../routes/DAL/roundsDAL');
const teamsDAL = require('../../../routes/DAL/teamsDAL');

const matchesBL = require('../../../routes/BL/matchesBL');
const DButils = require("../../../routes/utils/DButils");
const matchesBl = new matchesBL(new matchesDAL(), new teamsDAL(), new stadiumsDAL(), new roundsDAL())

beforeEach(async () => {
    await DButils.execQuery(`DELETE FROM dbo.Fixtures`)
});

const roundId = 240941
const homeTeamId = 180
const awayTeamId = 339
const stadiumId = 5599
const startTime = (new Date((new Date(new Date().setDate(new Date().getDate() + 1)).setHours(16) - (new Date()).getTimezoneOffset() * 60000))).toISOString().slice(0, -1)

describe('matches BL', () => {

    test(`add match`, async () => {

        const id = await matchesBl.addMatch(
            roundId,
            homeTeamId,
            awayTeamId,
            stadiumId,
            startTime
        )

        const db_fixture = await DButils.execQuery(`select * from dbo.Fixtures where id = ${id}`)
        expect(db_fixture[0]).toEqual(
            {
                id,
                roundId,
                homeTeamId,
                awayTeamId,
                stadiumId,
                startTime,
                refereeId1: null,
                refereeId2: null,
                refereeId3: null,
                refereeId4: null,
            }
        )
    });
})