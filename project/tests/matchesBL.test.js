const matchesBL = require('../routes/BL/matchesBL');
const stubMatchesDAL = require('./stubMatchesDAL');
const Errors = require("../errors");

// קבוצות מאותה ליגה
// קבוצות קיימות 
// שופט קיים
// שופט פנוי
// מחזור קיים
// לוודא שהמשחק בתאריכים של המחזור

// שעה תקינה הגיונית. לא 4 בבוקר.
// Can't create past match
// הנתונים תקינים מבחינת הטיפוס
// הקבוצות לא שיחקו כבר העונה ביתית מול חוץ
// if home vs away. and db has away vs home - test good.
// במחזור הקבוצות לא משחקות עדיין - home + away

const matchesDal = new stubMatchesDAL()
const bl = new matchesBL(matchesDal)

const roundId = randonNumberStr()
const homeTeamId = getRandomInt(1, 500).toString()
const awayTeamId = getRandomInt(501, 1000).toString()
const refereeId = randonNumberStr()
const tomorrowDate = new Date(new Date().setDate(new Date().getDate() + 1)).toISOString()

beforeEach(() => {
    matchesDal.reset()
});

test(`insert valid match details`, async () => {
    await expect(bl.addMatch(roundId, homeTeamId, awayTeamId, refereeId, tomorrowDate)).resolves.toBe(1);
});

test(`can't add match in same the home team already plays`, async () => {

    matchesDal.givenMatch({
        id: randonNumberStr(),
        roundId: randonNumberStr(),
        homeTeamId,
        awayTeamId: randonNumberStr(),
        refereeId: randonNumberStr(),
        startTime: new Date(new Date(tomorrowDate).setHours(1)).toISOString()
    })

    await expect(bl.addMatch(roundId, homeTeamId, awayTeamId, refereeId, tomorrowDate)).rejects.toEqual(
        {
            "message": Errors.TEAM_ALREADY_PLAYS_THIS_DAY,
            "code": 402
        })
});


test(`can't add match in same the away team already plays`, async () => {

    matchesDal.givenMatch({
        id: randonNumberStr(),
        roundId: randonNumberStr(),
        homeTeamId: randonNumberStr(),
        awayTeamId,
        refereeId: randonNumberStr(),
        startTime: new Date(new Date(tomorrowDate).setHours(1)).toISOString()
    })

    await expect(bl.addMatch(roundId, homeTeamId, awayTeamId, refereeId, tomorrowDate)).rejects.toEqual(
        {
            "message": Errors.TEAM_ALREADY_PLAYS_THIS_DAY,
            "code": 402
        })
});

test(`can't have same team against itself`, async () => {
    await expect(bl.addMatch(roundId, homeTeamId, homeTeamId, refereeId, tomorrowDate)).rejects.toEqual(
        {
            "message": Errors.TEAM_AGAINST_ITSELFS,
            "code": 409
        })
});

function randonNumberStr() {
    min = 1
    max = 10000
    return getRandomInt(min, max).toString();
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}