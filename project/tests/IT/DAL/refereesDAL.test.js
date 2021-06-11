const refereesDAL = require('../../../routes/DAL/refereesDAL');
const DButils = require("../../../routes/utils/DButils");
const refereesDal = new refereesDAL()

beforeEach(async () => {
    await DButils.execQuery(`DELETE FROM dbo.Referees`)
});

const refereeName = Math.random().toString(36).substring(7)
const refereeRole = 'MAIN'

describe('referees DAL', () => {
    test(`return undefined if referee doesn't exist`, async () => {
        await expect(refereesDal.getRefereeById(152124)).resolves.toBe(null);
    });

    test(`return referee if exist`, async () => {

        await DButils.execQuery(`
        INSERT INTO dbo.Referees ([refereeName],[refereeRole]) VALUES ( '${refereeName}', '${refereeRole}')`
        )

        const db_id = await DButils.execQuery(
            `select @@identity`
        );

        const id = db_id[0]['']

        await expect(refereesDal.getRefereeById(id)).resolves.toEqual(
            {
                id,
                refereeName,
                refereeRole
            });
    });

    test(`add referee and delete`, async () => {
        const ref_id = await refereesDal.addReferee({ refereeName, refereeRole })

        await expect(refereesDal.getRefereeById(ref_id)).resolves.toEqual(
            {
                id: ref_id,
                refereeName,
                refereeRole
            });

        await refereesDal.deleteRefereeById(ref_id)

        await expect(refereesDal.getRefereeById(ref_id)).resolves.toBe(null);
    });

})