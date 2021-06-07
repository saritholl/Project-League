const matchesBL = require('../../routes/BL/matchesBL');
const stubMatchesDAL = require('./stubs/stubMatchesDAL');
const stubRefereesDAL = require('./stubs/stubRefereesDAL');
const stubTeamsDAL = require('./stubs/stubTeamsDAL');
const Errors = require("../../errors");


// stadium id
// מחזור קיים

// שופט פנוי
// לוודא שהמשחק בתאריכים של המחזור
// הנתונים תקינים מבחינת הטיפוס
// referees - get 4. validate at least one is Main
// referees - get 4 - validate all exists.  
// referees - get 4 - validate different ons
//  Test params not null

const matchesDal = new stubMatchesDAL()
const refereesDal = new stubRefereesDAL()
const teamsDal = new stubTeamsDAL()
const bl = new matchesBL(matchesDal, refereesDal, teamsDal)

const roundId = randonNumber()
const homeTeamId = getRandomInt(1, 500)
const awayTeamId = getRandomInt(501, 1000)
const refereeId = randonNumber()
const leagueId = randonNumber()
const tomorrowDate = (new Date((new Date(new Date().setDate(new Date().getDate() + 1)).setHours(16) - (new Date()).getTimezoneOffset() * 60000))).toISOString().slice(0, -1)
const badTime = (new Date((new Date(tomorrowDate).setHours(3) - (new Date()).getTimezoneOffset() * 60000))).toISOString().slice(0, -1)
const pastTime = new Date(new Date(new Date().setDate(new Date().getDate() - 1)) - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, -1)
const startTime = (new Date((new Date(new Date().setDate(new Date().getDate() + 1)).setHours(18) - (new Date()).getTimezoneOffset() * 60000))).toISOString().slice(0, -1)

refereesDal.givenReferee({
    id: refereeId,
    RefereeName: 'Yossi',
    RefereeRole: 'Main'
})


teamsDal.givenTeam({
    id: homeTeamId,
    name: `Hapoel ${randonNumber()}`,
    leagueId
})

teamsDal.givenTeam({
    id: awayTeamId,
    name: `Maccabi ${randonNumber()}`,
    leagueId
})

beforeEach(() => {
    matchesDal.reset()
});

test(`insert valid match details`, async () => {
    await expect(bl.addMatch(roundId, homeTeamId, awayTeamId, refereeId, tomorrowDate)).resolves.toBe(1);

    expect(matchesDal.getMatchById(1)).toEqual(
        {
            id: 1,
            roundId, 
            homeTeamId, 
            awayTeamId, 
            refereeId, 
            startTime: tomorrowDate
        }
    )
});

test(`can't add match in same day home team already plays`, async () => {

    matchesDal.givenMatch({
        id: randonNumber(),
        roundId: randonNumber(),
        homeTeamId,
        awayTeamId: randonNumber(),
        refereeId: randonNumber(),
        startTime: startTime
    })

    await expect(bl.addMatch(roundId, homeTeamId, awayTeamId, refereeId, tomorrowDate)).rejects.toEqual(
        {
            "message": Errors.TEAM_ALREADY_PLAYS_THIS_DAY,
            "code": 400
        })
});


test(`can't add match in same day away team already plays`, async () => {

    matchesDal.givenMatch({
        id: randonNumber(),
        roundId: randonNumber(),
        homeTeamId: randonNumber(),
        awayTeamId,
        refereeId: randonNumber(),
        startTime: startTime
    })

    await expect(bl.addMatch(roundId, homeTeamId, awayTeamId, refereeId, tomorrowDate)).rejects.toEqual(
        {
            "message": Errors.TEAM_ALREADY_PLAYS_THIS_DAY,
            "code": 400
        })
});

test(`can't have same team against itself`, async () => {
    await expect(bl.addMatch(roundId, homeTeamId, homeTeamId, refereeId, tomorrowDate)).rejects.toEqual(
        {
            "message": Errors.TEAM_AGAINST_ITSELFS,
            "code": 400
        })
});

test(`can't add match in an unresonable time`, async () => {

    await expect(bl.addMatch(roundId, homeTeamId, awayTeamId, refereeId, badTime)).rejects.toEqual(
        {
            "message": Errors.BAD_MATCH_TIME,
            "code": 400
        })
});

test(`can't add match in a past time`, async () => {

    await expect(bl.addMatch(roundId, homeTeamId, awayTeamId, refereeId, pastTime)).rejects.toEqual(
        {
            "message": Errors.PAST_TIME,
            "code": 400
        })
});

test(`can't add match already exists`, async () => {

    matchesDal.givenMatch({
        id: randonNumber(),
        roundId: randonNumber(),
        homeTeamId,
        awayTeamId,
        refereeId: randonNumber(),
        startTime: pastTime
    })

    await expect(bl.addMatch(roundId, homeTeamId, awayTeamId, refereeId, tomorrowDate)).rejects.toEqual(
        {
            "message": Errors.MATCH_ALREADY_EXISTS,
            "code": 400
        })
});

test(`same teams in a match different home and away`, async () => {

    matchesDal.givenMatch({
        id: randonNumber(),
        roundId: randonNumber(),
        homeTeamId: awayTeamId,
        awayTeamId: homeTeamId,
        refereeId: randonNumber(),
        startTime: pastTime
    })

    await expect(bl.addMatch(roundId, homeTeamId, awayTeamId, refereeId, tomorrowDate)).resolves.toEqual(1)

    expect(matchesDal.getMatchById(1)).toEqual(
        {
            id: 1,
            roundId, 
            homeTeamId, 
            awayTeamId, 
            refereeId, 
            startTime: tomorrowDate
        }
    )
});

test(`home team already played this round`, async () => {

    matchesDal.givenMatch({
        id: randonNumber(),
        roundId,
        homeTeamId,
        awayTeamId: randonNumber(),
        refereeId: randonNumber(),
        startTime: pastTime
    })

    await expect(bl.addMatch(roundId, homeTeamId, awayTeamId, refereeId, tomorrowDate)).rejects.toEqual(
        {
            "message": Errors.TEAM_ALREADY_PLAYED_THIS_ROUND,
            "code": 400
        })
});

test(`away team already played this round`, async () => {

    matchesDal.givenMatch({
        id: randonNumber(),
        roundId,
        homeTeamId: randonNumber(),
        awayTeamId,
        refereeId: randonNumber(),
        startTime: pastTime
    })

    await expect(bl.addMatch(roundId, homeTeamId, awayTeamId, refereeId, tomorrowDate)).rejects.toEqual(
        {
            "message": Errors.TEAM_ALREADY_PLAYED_THIS_ROUND,
            "code": 400
        })
});

test(`can't add match with not existing referee`, async () => {
    await expect(bl.addMatch(roundId, homeTeamId, awayTeamId, randonNumber(), tomorrowDate)).rejects.toEqual(
        {
            "message": Errors.REFEREE_NOT_FOUND,
            "code": 404
        })
});

test(`can't add match of non existing home team`, async () => {
    await expect(bl.addMatch(roundId, randonNumber(), awayTeamId, refereeId, tomorrowDate)).rejects.toEqual(
        {
            "message": Errors.TEAM_NOT_FOUND,
            "code": 404
        })
});

test(`can't add match of non existing away team`, async () => {
    await expect(bl.addMatch(roundId, homeTeamId, randonNumber(), refereeId, tomorrowDate)).rejects.toEqual(
        {
            "message": Errors.TEAM_NOT_FOUND,
            "code": 404
        })
});

test(`can't add match of teams not in same league`, async () => {
    const anotherAwayTeamId = randonNumber()

    teamsDal.givenTeam({
        id: anotherAwayTeamId,
        name: 'another league team',
        leagueId: randonNumber()
    })

    await expect(bl.addMatch(roundId, homeTeamId, anotherAwayTeamId, refereeId, tomorrowDate)).rejects.toEqual(
        {
            "message": Errors.DIFFERENT_LEAGUES_TEAMS,
            "code": 400
        })
});

function randonNumber() {
    min = 1
    max = 10000
    return getRandomInt(min, max)
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}