const matchesBL = require('../../routes/BL/matchesBL');
const stubMatchesDAL = require('./stubs/stubMatchesDAL');
const stubTeamsDAL = require('./stubs/stubTeamsDAL');
const stubStadiumsDAL = require('./stubs/stubStadiumsDAL');
const stubRoundsDAL = require('./stubs/stubRoundsDAL');
const Errors = require("../../errors");


// הנתונים תקינים מבחינת הטיפוס
//  Test params not null

const matchesDal = new stubMatchesDAL()
const teamsDal = new stubTeamsDAL()
const stadiumsDal = new stubStadiumsDAL()
const roundsDal = new stubRoundsDAL()
const bl = new matchesBL(matchesDal, teamsDal, stadiumsDal, roundsDal)

const roundId = randomNumber()
const homeTeamId = getRandomInt(1, 500)
const awayTeamId = getRandomInt(501, 1000)
const stadiumId = randomNumber()
const leagueId = randomNumber()
const tomorrowDate = (new Date((new Date(new Date().setDate(new Date().getDate() + 1)).setHours(16) - (new Date()).getTimezoneOffset() * 60000))).toISOString().slice(0, -1)
const badTime = (new Date((new Date(tomorrowDate).setHours(3) - (new Date()).getTimezoneOffset() * 60000))).toISOString().slice(0, -1)
const pastTime = new Date(new Date(new Date().setDate(new Date().getDate() - 1)).setHours(18) - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, -1)
const startTime = (new Date((new Date(new Date().setDate(new Date().getDate() + 1)).setHours(18) - (new Date()).getTimezoneOffset() * 60000))).toISOString().slice(0, -1)

roundsDal.givenRound({
    id: roundId
})

teamsDal.givenTeam({
    id: homeTeamId,
    name: `Hapoel ${randomNumber()}`,
    leagueId
})

teamsDal.givenTeam({
    id: awayTeamId,
    name: `Maccabi ${randomNumber()}`,
    leagueId
})

stadiumsDal.givenStadium({
    id: stadiumId,
    name: `stadium ${randomNumber()}`,
})

beforeEach(() => {
    matchesDal.reset()
});

test(`insert valid match details`, async () => {
    await expect(bl.addMatch(roundId, homeTeamId, awayTeamId, stadiumId, tomorrowDate)).resolves.toBe(1);

    expect(matchesDal.getMatchById(1)).toEqual(
        {
            id: 1,
            roundId,
            homeTeamId,
            awayTeamId,
            stadiumId,
            startTime: tomorrowDate
        }
    )
});

test(`can't add match in same day home team already plays`, async () => {

    matchesDal.givenMatch({
        id: randomNumber(),
        roundId: randomNumber(),
        homeTeamId,
        awayTeamId: randomNumber(),
        stadiumId: randomNumber(),
        startTime: startTime
    })

    await expect(bl.addMatch(roundId, homeTeamId, awayTeamId, stadiumId, tomorrowDate)).rejects.toEqual(
        {
            "message": Errors.TEAM_ALREADY_PLAYS_THIS_DAY,
            "code": 400
        })
});


test(`can't add match in same day away team already plays`, async () => {

    matchesDal.givenMatch({
        id: randomNumber(),
        roundId: randomNumber(),
        homeTeamId: randomNumber(),
        awayTeamId,
        stadiumId: randomNumber(),
        startTime: startTime
    })

    await expect(bl.addMatch(roundId, homeTeamId, awayTeamId, stadiumId, tomorrowDate)).rejects.toEqual(
        {
            "message": Errors.TEAM_ALREADY_PLAYS_THIS_DAY,
            "code": 400
        })
});

test(`can't have same team against itself`, async () => {
    await expect(bl.addMatch(roundId, homeTeamId, homeTeamId, stadiumId, tomorrowDate)).rejects.toEqual(
        {
            "message": Errors.TEAM_AGAINST_ITSELFS,
            "code": 400
        })
});

test(`can't add match in an unresonable time`, async () => {

    await expect(bl.addMatch(roundId, homeTeamId, awayTeamId, stadiumId, badTime)).rejects.toEqual(
        {
            "message": Errors.BAD_MATCH_TIME,
            "code": 400
        })
});

test(`can't add match in a past time`, async () => {

    await expect(bl.addMatch(roundId, homeTeamId, awayTeamId, stadiumId, pastTime)).rejects.toEqual(
        {
            "message": Errors.PAST_TIME,
            "code": 400
        })
});

test(`can't add match already exists`, async () => {

    matchesDal.givenMatch({
        id: randomNumber(),
        roundId: randomNumber(),
        homeTeamId,
        awayTeamId,
        stadiumId: randomNumber(),
        startTime: pastTime
    })

    await expect(bl.addMatch(roundId, homeTeamId, awayTeamId, stadiumId, tomorrowDate)).rejects.toEqual(
        {
            "message": Errors.MATCH_ALREADY_EXISTS,
            "code": 400
        })
});

test(`same teams in a match different home and away`, async () => {

    matchesDal.givenMatch({
        id: randomNumber(),
        roundId: randomNumber(),
        homeTeamId: awayTeamId,
        awayTeamId: homeTeamId,
        stadiumId: randomNumber(),
        startTime: pastTime
    })

    await expect(bl.addMatch(roundId, homeTeamId, awayTeamId, stadiumId, tomorrowDate)).resolves.toEqual(1)

    expect(matchesDal.getMatchById(1)).toEqual(
        {
            id: 1,
            roundId,
            homeTeamId,
            awayTeamId,
            stadiumId,
            startTime: tomorrowDate
        }
    )
});

test(`home team already played this round`, async () => {

    matchesDal.givenMatch({
        id: randomNumber(),
        roundId,
        homeTeamId,
        awayTeamId: randomNumber(),
        stadiumId: randomNumber(),
        startTime: pastTime
    })

    await expect(bl.addMatch(roundId, homeTeamId, awayTeamId, stadiumId, tomorrowDate)).rejects.toEqual(
        {
            "message": Errors.TEAM_ALREADY_PLAYED_THIS_ROUND,
            "code": 400
        })
});

test(`away team already played this round`, async () => {

    matchesDal.givenMatch({
        id: randomNumber(),
        roundId,
        homeTeamId: randomNumber(),
        awayTeamId,
        stadiumId: randomNumber(),
        startTime: pastTime
    })

    await expect(bl.addMatch(roundId, homeTeamId, awayTeamId, stadiumId, tomorrowDate)).rejects.toEqual(
        {
            "message": Errors.TEAM_ALREADY_PLAYED_THIS_ROUND,
            "code": 400
        })
});

test(`can't add match with not existing round`, async () => {
    await expect(bl.addMatch(randomNumber(), homeTeamId, awayTeamId, stadiumId, tomorrowDate)).rejects.toEqual(
        {
            "message": Errors.ROUND_NOT_FOUND,
            "code": 404
        })
});

test(`can't add match of non existing away team`, async () => {
    await expect(bl.addMatch(roundId, homeTeamId, randomNumber(), stadiumId, tomorrowDate)).rejects.toEqual(
        {
            "message": Errors.TEAM_NOT_FOUND,
            "code": 404
        })
});

test(`can't add match of teams not in same league`, async () => {
    const anotherAwayTeamId = randomNumber()

    teamsDal.givenTeam({
        id: anotherAwayTeamId,
        name: 'another league team',
        leagueId: randomNumber()
    })

    await expect(bl.addMatch(roundId, homeTeamId, anotherAwayTeamId, stadiumId, tomorrowDate)).rejects.toEqual(
        {
            "message": Errors.DIFFERENT_LEAGUES_TEAMS,
            "code": 400
        })
});

test(`can't add match with not existing stadium`, async () => {
    await expect(bl.addMatch(roundId, homeTeamId, awayTeamId, randomNumber(), tomorrowDate)).rejects.toEqual(
        {
            "message": Errors.STADIUM_NOT_FOUND,
            "code": 404
        })
});


function randomNumber() {
    min = 1
    max = 10000
    return getRandomInt(min, max)
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}