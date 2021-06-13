const refereesBL = require('../../../routes/BL/refereesBL');
const stubMatchesDAL = require('../stubs/stubMatchesDAL');
const stubrefereesDal = require('../stubs/stubRefereesDAL');
const Errors = require("../../../errors");
const { exception } = require('console');

const matchesDal = new stubMatchesDAL()
const refereesDal = new stubrefereesDal()
const bl = new refereesBL(refereesDal, matchesDal)

beforeEach(() => {
    refereesDal.reset()
    matchesDal.reset()

    matchesDal.givenMatch({
        id: matchId,
        roundId: 5,
        homeTeamId: 1,
        awayTeamId: 2,
        stadiumId: 3,
        startTime
    })

    refereesDal.givenMainReferee(refereeId1)
    refereesDal.givenAssitantReferee(refereeId2)
    refereesDal.givenAssitantReferee(refereeId3)
    refereesDal.givenAssitantReferee(refereeId4)
    refereesDal.givenAssitantReferee(refereeId5)
});

const refereeName = Math.random().toString(36).substring(7)
const refereeRole = 'MAIN'
const refereeRoleAssitant = 'ASSISTANT'

const matchId = 151
const refereeId1 = 100
const refereeId2 = 102
const refereeId3 = 103
const refereeId4 = 104
const refereeId5 = 105
const startTime = (new Date((new Date(new Date().setDate(new Date().getDate() + 1)).setHours(18) - (new Date()).getTimezoneOffset() * 60000))).toISOString().slice(0, -1)
const sameDayTime = (new Date((new Date(new Date().setDate(new Date().getDate() + 1)).setHours(16) - (new Date()).getTimezoneOffset() * 60000))).toISOString().slice(0, -1)
const otherDayTime = (new Date((new Date(new Date().setDate(new Date().getDate() - 5)).setHours(16) - (new Date()).getTimezoneOffset() * 60000))).toISOString().slice(0, -1)


describe('referees BL UT - set refs', () => {

    test(`set refs: matchId null`, async () => {
        await expect(bl.setRefereesToMatch(null, refereeId1, refereeId2, refereeId3, refereeId4)).rejects.toEqual(
            {
                "message": Errors.PARAMETER_NULL,
                "code": 400
            })

    });

    test(`set ref: ref id 1 null`, async () => {
        await expect(bl.setRefereesToMatch(matchId, null, refereeId2, refereeId3, refereeId4)).rejects.toEqual(
            {
                "message": Errors.PARAMETER_NULL,
                "code": 400
            })

    });

    test(`set ref: ref id 2 null`, async () => {
        await expect(bl.setRefereesToMatch(matchId, refereeId1, null, refereeId3, refereeId4)).rejects.toEqual(
            {
                "message": Errors.PARAMETER_NULL,
                "code": 400
            })

    });

    test(`set ref: ref id 3 null`, async () => {
        await expect(bl.setRefereesToMatch(matchId, refereeId1, refereeId2, null, refereeId4)).rejects.toEqual(
            {
                "message": Errors.PARAMETER_NULL,
                "code": 400
            })

    });

    test(`set ref: ref id 4 null`, async () => {
        await expect(bl.setRefereesToMatch(matchId, refereeId1, refereeId2, refereeId3, null)).rejects.toEqual(
            {
                "message": Errors.PARAMETER_NULL,
                "code": 400
            })

    });

    test(`set refs: matchId not numeric`, async () => {
        await expect(bl.setRefereesToMatch(true, refereeId1, refereeId2, refereeId3, refereeId4)).rejects.toEqual(
            {
                "message": Errors.WRONG_INSTANCE_OF_PARAMETER,
                "code": 400
            })

    });

    test(`set ref: ref id 1 not numeric`, async () => {
        await expect(bl.setRefereesToMatch(matchId, true, refereeId2, refereeId3, refereeId4)).rejects.toEqual(
            {
                "message": Errors.WRONG_INSTANCE_OF_PARAMETER,
                "code": 400
            })

    });

    test(`set ref: ref id 2 not numeric`, async () => {
        await expect(bl.setRefereesToMatch(matchId, refereeId1, true, refereeId3, refereeId4)).rejects.toEqual(
            {
                "message": Errors.WRONG_INSTANCE_OF_PARAMETER,
                "code": 400
            })

    });

    test(`set ref: ref id 3 not numeric`, async () => {
        await expect(bl.setRefereesToMatch(matchId, refereeId1, refereeId2, true, refereeId4)).rejects.toEqual(
            {
                "message": Errors.WRONG_INSTANCE_OF_PARAMETER,
                "code": 400
            })

    });

    test(`set ref: ref id 4 not numeric`, async () => {
        await expect(bl.setRefereesToMatch(matchId, refereeId1, refereeId2, refereeId3, true)).rejects.toEqual(
            {
                "message": Errors.WRONG_INSTANCE_OF_PARAMETER,
                "code": 400
            })

    });


    test(`set refs: duplicate ref`, async () => {
        await expect(bl.setRefereesToMatch(matchId, refereeId1, refereeId2, refereeId3, refereeId3)).rejects.toEqual(
            {
                "message": Errors.DUPLICATE_REFEREE,
                "code": 400
            })

    });

    test(`set refs: match id doesn't exist`, async () => {
        await expect(bl.setRefereesToMatch(1566, refereeId1, refereeId2, refereeId3, refereeId4)).rejects.toEqual(
            {
                "message": Errors.MATCH_NOT_FOUND,
                "code": 404
            })
    });

    test(`set refs: ref id doesn't exist`, async () => {
        await expect(bl.setRefereesToMatch(matchId, refereeId1, refereeId2, refereeId3, 15)).rejects.toEqual(
            {
                "message": Errors.REFEREE_NOT_FOUND,
                "code": 404
            })
    });

    test(`set refs: no main ref`, async () => {
        await expect(bl.setRefereesToMatch(matchId, refereeId5, refereeId2, refereeId3, refereeId4)).rejects.toEqual(
            {
                "message": Errors.NO_MAIN_REFEREE,
                "code": 400
            })
    });

    test(`set refs: ref 1 already have a match this day`, async () => {

        matchesDal.givenMatch({
            id: 1241,
            roundId: 5,
            homeTeamId: 6,
            awayTeamId: 4,
            stadiumId: 9,
            startTime: sameDayTime,
            refereeId1: refereeId1
        })

        await expect(bl.setRefereesToMatch(matchId, refereeId1, refereeId2, refereeId3, refereeId4)).rejects.toEqual(
            {
                "message": Errors.REFEREE_ALREADY_SET_TO_MATCH_THIS_DAY,
                "code": 400
            })
    });

    test(`set refs: ref 2 already have a match this day`, async () => {

        matchesDal.givenMatch({
            id: 1241,
            roundId: 5,
            homeTeamId: 6,
            awayTeamId: 4,
            stadiumId: 9,
            startTime: sameDayTime,
            refereeId2: refereeId2
        })

        await expect(bl.setRefereesToMatch(matchId, refereeId1, refereeId2, refereeId3, refereeId4)).rejects.toEqual(
            {
                "message": Errors.REFEREE_ALREADY_SET_TO_MATCH_THIS_DAY,
                "code": 400
            })
    });

    test(`set refs: ref 3 already have a match this day`, async () => {

        matchesDal.givenMatch({
            id: 1241,
            roundId: 5,
            homeTeamId: 6,
            awayTeamId: 4,
            stadiumId: 9,
            startTime: sameDayTime,
            refereeId3: refereeId3
        })

        await expect(bl.setRefereesToMatch(matchId, refereeId1, refereeId2, refereeId3, refereeId4)).rejects.toEqual(
            {
                "message": Errors.REFEREE_ALREADY_SET_TO_MATCH_THIS_DAY,
                "code": 400
            })
    });

    test(`set refs: ref 4 already have a match this day`, async () => {

        matchesDal.givenMatch({
            id: 1241,
            roundId: 5,
            homeTeamId: 6,
            awayTeamId: 4,
            stadiumId: 9,
            startTime: sameDayTime,
            refereeId4: refereeId4
        })

        await expect(bl.setRefereesToMatch(matchId, refereeId1, refereeId2, refereeId3, refereeId4)).rejects.toEqual(
            {
                "message": Errors.REFEREE_ALREADY_SET_TO_MATCH_THIS_DAY,
                "code": 400
            })
    });

    test(`set refs: set refs if all good`, async () => {

        matchesDal.givenMatch({
            id: 1241,
            roundId: 5,
            homeTeamId: 6,
            awayTeamId: 4,
            stadiumId: 9,
            startTime: otherDayTime,
            refereeId4: refereeId4
        })

        await expect(bl.setRefereesToMatch(matchId, refereeId1, refereeId2, refereeId3, refereeId4)).resolves.toBe(true)

        const match = matchesDal.getMatchById(matchId)
        expect(match).toEqual({
            id: matchId,
            roundId: 5,
            homeTeamId: 1,
            awayTeamId: 2,
            stadiumId: 3,
            startTime,
            refereeId1,
            refereeId2,
            refereeId3,
            refereeId4
        }
        )
    });
})


describe('referees BL UT - add + delete', () => {

    test(`addReferee: ref name is null`, async () => {
        await expect(bl.addReferee(null, refereeRole)).rejects.toEqual(
            {
                "message": Errors.PARAMETER_NULL,
                "code": 400
            })

    });

    test(`addReferee: ref role is null`, async () => {
        await expect(bl.addReferee(refereeName, null)).rejects.toEqual(
            {
                "message": Errors.PARAMETER_NULL,
                "code": 400
            })

    });

    test(`addReferee: invalid role`, async () => {
        await expect(bl.addReferee(refereeName, 'INVALID')).rejects.toEqual(
            {
                "message": Errors.INVALID_REFEREE_ROLE,
                "code": 400
            })

    });

    test(`addReferee main successufully`, async () => {
        const id = await bl.addReferee(refereeName, refereeRole)

        await expect(refereesDal.getRefereeById(id)).resolves.toEqual(
            {
                id,
                refereeName,
                refereeRole
            }
        )
    });

    test(`addReferee assistant successufully`, async () => {
        const id = await bl.addReferee(refereeName, refereeRoleAssitant)

        await expect(refereesDal.getRefereeById(id)).resolves.toEqual(
            {
                id,
                refereeName,
                refereeRole: refereeRoleAssitant
            }
        )
    });

    test(`addReferee main lower case successufully`, async () => {
        const id = await bl.addReferee(refereeName, refereeRole.toLowerCase())

        await expect(refereesDal.getRefereeById(id)).resolves.toEqual(
            {
                id,
                refereeName,
                refereeRole
            }
        )
    });

    test(`addReferee assistant successufully`, async () => {
        const id = await bl.addReferee(refereeName, refereeRoleAssitant.toLowerCase())

        await expect(refereesDal.getRefereeById(id)).resolves.toEqual(
            {
                id,
                refereeName,
                refereeRole: refereeRoleAssitant
            }
        )
    });

    test(`can't delete referee already set to a match`, async () => {

        matchesDal.givenMatch({
            id: 1241,
            roundId: 5,
            homeTeamId: 6,
            awayTeamId: 4,
            stadiumId: 9,
            startTime,
            refereeId4: refereeId4
        })

        await expect(bl.deleteById(refereeId4)).rejects.toEqual(
            {
            "message": Errors.REFEREE_IS_SET_TO_A_MATCH,
            "code": 400
        })
    });

    test(`deleteReferee successufully`, async () => {
        const id = await bl.addReferee(refereeName, refereeRole)

        await expect(refereesDal.getRefereeById(id)).resolves.toEqual(
            {
                id,
                refereeName,
                refereeRole
            }
        )

        await bl.deleteById(id)

        await expect(refereesDal.getRefereeById(id)).resolves.toBe(undefined)
    });
})
