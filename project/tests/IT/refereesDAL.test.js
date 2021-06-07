
const refereesDAL = require('../../routes/DAL/refereesDAL');
const DButils = require("../../routes/utils/DButils");
const refereesDal = new refereesDAL()

// TODO: --detectOpenHandles
// afterAll(async () => {
//     await DButils.closeConnection()
// });

beforeEach(async () => {
    await DButils.execQuery(`DELETE FROM dbo.Referees`)
});

test(`return undefined if referee doesn't exist`, async () => {
    await expect(refereesDal.getRefereeById(152124)).resolves.toBe(null);
});

test(`return referee if exist`, async () => {

    const RefereeName = Math.random().toString(36).substring(7)
    const RefereeRole = 'Main'

    await DButils.execQuery(`
        INSERT INTO dbo.Referees ([RefereeName],[RefereeRole]) VALUES ( '${RefereeName}', '${RefereeRole}')`
    )

    const db_id = await DButils.execQuery(
        `select @@identity`
      );

      const id = db_id[0]['']

    await expect(refereesDal.getRefereeById(id)).resolves.toEqual(
        {
            id,
            RefereeName,
            RefereeRole
        });
});
