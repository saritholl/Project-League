const stadiumsDAL = require('../../../routes/DAL/stadiumsDAL');
const stadiumsDal = new stadiumsDAL()

describe('stadiums DAL', () => {

    test(`return undefined if stadium doesn't exist`, async () => {
        await expect(stadiumsDal.getStadiumById(-1)).resolves.toBe(null);
    });

    test(`return stadium if exist`, async () => {

        const id = 10
        await expect(stadiumsDal.getStadiumById(id)).resolves.toEqual(
            {
                id,
                name: "Reebok Stadium"
            });
    });

})