const refereesBL = require('../../routes/BL/refereesBL');
const stubRefereesDAL = require('./stubs/stubRefereesDAL');
const Errors = require("../../errors");

const refereesDal = new stubRefereesDAL()
const bl = new refereesBL(refereesDal)

names = ["alon yefet", "tom dugma", "sarit hollander"];
const refereeName = names[Math.floor(Math.random() * names.length)]; // choose random name from names
const refereeType = 1; //both binary types (0 or 1)
const refereeStatus = 0; //both binary types (0 or 1)


beforeEach(() => {
    refereesDal.reset()
});

test(`insert valid referee details`, async () => {
    await expect(bl.addReferee(refereeName, refereeType, refereeStatus)).resolves.toBe(1);

    expect(refereesDal.getRefereeById(1)).toEqual(
        {
            refereeId: 1,
            refereeName,
            refereeType,
            refereeStatus
        }
    )
});

test(`can't add referee with the same name`, async () => {

    refereesDal.givenReferee1({
        refereeId: randomNumber(),
        refereeName,
        refereeType,
        refereeStatus
    })

    await expect(bl.addReferee(refereeName,refereeType,refereeStatus)).rejects.toEqual(
        {
            "message": Errors.REFEREE_NAME_ALREADY_EXISTS,
            "code": 400
        })
});

test(`can't add referee with invalid name`, async () => {

    refereesDal.givenReferee1({
        refereeId: randomNumber(),
        refereeName,
        refereeType,
        refereeStatus
    })

    await expect(bl.addReferee("invalidname",refereeType,refereeStatus)).rejects.toEqual(
        {
            "message": Errors.INVALID_REFEREE_NAME,
            "code": 400
        })
});

test(`can't add referee with invalid name #2`, async () => {

    refereesDal.givenReferee1({
        refereeId: randomNumber(),
        refereeName,
        refereeType,
        refereeStatus
    })

    await expect(bl.addReferee("",refereeType,refereeStatus)).rejects.toEqual(
        {
            "message": Errors.INVALID_REFEREE_NAME,
            "code": 400
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

