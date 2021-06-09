const { expect } = require('@jest/globals');
const refereesDAL = require('../../routes/DAL/refereesDAL');
const DButils = require("../../routes/utils/DButils");
const refereesDAL = new refereesDAL()

beforeEach(async () => {
    await DButils.execQuery(`DELETE FROM dbo.Referees`)
});

const refereeName = "alon yefet"
const refereeType = 1 // 1 - main referee, 0 - "referee assistent"
const refereeStatus = 0  //on defualt referee status equal to zero when added to database. 0 - referee isnt set to game, 1 - referee is "occupy"

test(`add referee`, async () => {

    const id = await refereesDal.addReferee({
        refereeName,
        refereeType,
        refereeStatus,
    })

    const db_id = await DButils.execQuery(
        `select @@identity`
    );

    expect(id).toBe(db_id[0][''])


    const db_referees = await DButils.execQuery(`select * from dbo.Referees where refereeId = ${id}`)
    expect(db_referees[0]).toEqual(
        {
        refereeName,
        refereeType,
        refereeStatus,
        }
    )
});

test(`return referee name by id`, async () => {

    await DButils.execQuery(`
        INSERT INTO dbo.Referees (roundId,homeTeamId,awayTeamId,stadiumId,startTime)
         VALUES ( '${refereeName}', ${refereeType} , ${refereeStatus})`
    )

    await DButils.execQuery(`
        INSERT INTO dbo.Referees (roundId,homeTeamId,awayTeamId,stadiumId,startTime)
         VALUES ( '${"tom dugma"}', ${refereeType} , ${refereeStatus})`
    )

    await DButils.execQuery(`
        INSERT INTO dbo.Referees (roundId,homeTeamId,awayTeamId,stadiumId,startTime)
         VALUES ('${"sarit hollander"}', ${refereeType} , ${refereeStatus})`
    )

    const db_referees = await refereesDAL.getRefereesById(refereeId)
    expect(db_referees.refereeName).toBe("alon yefet")
});

test(`return referee type by id`, async () => {

    await DButils.execQuery(`
        INSERT INTO dbo.Referees (roundId,homeTeamId,awayTeamId,stadiumId,startTime)
         VALUES ( '${refereeName}', ${0} , ${refereeStatus})`
    )

    await DButils.execQuery(`
        INSERT INTO dbo.Referees (roundId,homeTeamId,awayTeamId,stadiumId,startTime)
         VALUES ( '${"tom dugma"}', ${refereeType} , ${refereeStatus})`
    )

    await DButils.execQuery(`
        INSERT INTO dbo.Referees (roundId,homeTeamId,awayTeamId,stadiumId,startTime)
         VALUES ('${"sarit hollander"}', ${refereeType} , ${refereeStatus})`
    )

    const db_referees = await refereesDAL.getRefereesById(refereeId)
    expect(db_referees.refereeName).toBe("0")
});


test(`return referee status by id`, async () => {

    await DButils.execQuery(`
        INSERT INTO dbo.Referees (roundId,homeTeamId,awayTeamId,stadiumId,startTime)
         VALUES (  '${refereeName}', ${refereeType} , ${1})`
    )

    await DButils.execQuery(`
        INSERT INTO dbo.Referees (roundId,homeTeamId,awayTeamId,stadiumId,startTime)
         VALUES ( '${"tom dugma"}', ${refereeType} , ${refereeStatus})`
    )

    await DButils.execQuery(`
        INSERT INTO dbo.Referees (roundId,homeTeamId,awayTeamId,stadiumId,startTime)
         VALUES (  '${"sarit hollander"}', ${refereeType} , ${refereeStatus})`
    )

    const db_referees = await refereesDAL.getRefereesById(refereeId)
    expect(db_referees.refereeStatus).toBe("1")
});

test(`delete referee by id`, async () => {

    await DButils.execQuery(`
        INSERT INTO dbo.Referees (roundId,homeTeamId,awayTeamId,stadiumId,startTime)
         VALUES (  '${refereeName}', ${refereeType} , ${1})`
    )

    await DButils.execQuery(`
        INSERT INTO dbo.Referees (roundId,homeTeamId,awayTeamId,stadiumId,startTime)
         VALUES ( '${"tom dugma"}', ${refereeType} , ${refereeStatus})`
    )

    await DButils.execQuery(`
        INSERT INTO dbo.Referees (roundId,homeTeamId,awayTeamId,stadiumId,startTime)
         VALUES (  '${"sarit hollander"}', ${refereeType} , ${refereeStatus})`
    )

    const db_referees = await refereesDAL.deleteRefereeById(refereeId)
    expect(db_referees).toBeTruthy() // delete sql returns true if operation succssedd
});