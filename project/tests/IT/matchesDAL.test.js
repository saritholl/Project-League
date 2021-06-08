
const { expect } = require('@jest/globals');
const matchesDAL = require('../../routes/DAL/matchesDAL');
const DButils = require("../../routes/utils/DButils");
const matchesDal = new matchesDAL()

beforeEach(async () => {
    await DButils.execQuery(`DELETE FROM dbo.Fixtures`)
});

const roundId = 1
const homeTeamId = 1
const awayTeamId = 2
const stadiumId = 7
const refereeId1 = 3
const refereeId2 = 4
const refereeId3 = 5
const refereeId4 = 6
const startTime = (new Date((new Date(new Date().setDate(new Date().getDate() + 1)).setHours(16) - (new Date()).getTimezoneOffset() * 60000))).toISOString().slice(0, -1)

test(`add match`, async () => {

    const id = await matchesDal.addMatch({
        roundId,
        homeTeamId,
        awayTeamId,
        stadiumId,
        refereeId1,
        refereeId2,
        refereeId3,
        refereeId4,
        startTime
    })

    const db_id = await DButils.execQuery(
        `select @@identity`
    );

    expect(id).toBe(db_id[0][''])


    const db_fixture = await DButils.execQuery(`select * from dbo.Fixtures where id = ${id}`)
    expect(db_fixture[0]).toEqual(
        {
            id,
            roundId,
            homeTeamId,
            awayTeamId,
            stadiumId,
            refereeId1,
            refereeId2,
            refereeId3,
            refereeId4,
            startTime
        }
    )
});

test(`return matches by team`, async () => {

    await DButils.execQuery(`
        INSERT INTO dbo.Fixtures (roundId,homeTeamId,awayTeamId,stadiumId,refereeId1,refereeId2,refereeId3,refereeId4,startTime)
         VALUES ( ${roundId}, ${homeTeamId} , ${awayTeamId}, ${stadiumId}, ${refereeId1}, ${refereeId2}, ${refereeId3}, ${refereeId4}, '${startTime}')`
    )

    await DButils.execQuery(`
        INSERT INTO dbo.Fixtures (roundId,homeTeamId,awayTeamId,stadiumId,refereeId1,refereeId2,refereeId3,refereeId4,startTime)
         VALUES ( ${roundId}, ${253453} , ${homeTeamId}, ${stadiumId}, ${refereeId1}, ${refereeId2}, ${refereeId3}, ${refereeId4}, '${startTime}')`
    )

    await DButils.execQuery(`
        INSERT INTO dbo.Fixtures (roundId,homeTeamId,awayTeamId,stadiumId,refereeId1,refereeId2,refereeId3,refereeId4,startTime)
         VALUES ( ${roundId}, ${45346} , ${142356}, ${stadiumId}, ${refereeId1}, ${refereeId2}, ${refereeId3}, ${refereeId4}, '${startTime}')`
    )

    const db_fixtures = await matchesDal.getMatchesByTeamId(homeTeamId)
    expect(db_fixtures.length).toBe(2)
});

test(`return matches by referee`, async () => {

    await DButils.execQuery(`
        INSERT INTO dbo.Fixtures (roundId,homeTeamId,awayTeamId,stadiumId,refereeId1,refereeId2,refereeId3,refereeId4,startTime)
         VALUES ( ${roundId}, ${homeTeamId} , ${awayTeamId}, ${stadiumId}, ${refereeId1}, ${refereeId2}, ${refereeId3}, ${refereeId4}, '${startTime}')`
    )

    await DButils.execQuery(`
        INSERT INTO dbo.Fixtures (roundId,homeTeamId,awayTeamId,stadiumId,refereeId1,refereeId2,refereeId3,refereeId4,startTime)
         VALUES ( ${roundId}, ${253453} , ${homeTeamId}, ${stadiumId}, ${refereeId1}, ${16}, ${refereeId3}, ${refereeId4}, '${startTime}')`
    )

    await DButils.execQuery(`
        INSERT INTO dbo.Fixtures (roundId,homeTeamId,awayTeamId,stadiumId,refereeId1,refereeId2,refereeId3,refereeId4,startTime)
         VALUES ( ${roundId}, ${45346} , ${142356}, ${stadiumId}, ${refereeId1}, ${refereeId2}, ${refereeId3}, ${refereeId4}, '${startTime}')`
    )

    const db_fixtures = await matchesDal.getMatchesByRefereeId(refereeId2)
    expect(db_fixtures.length).toBe(2)
});