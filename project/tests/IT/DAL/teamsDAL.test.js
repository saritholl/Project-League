const teamsDAL = require('../../routes/DAL/teamsDAL');
const teamsDal = new teamsDAL()

test(`return undefined if team doesn't exist`, async () => {
    await expect(teamsDal.getTeamById(-1)).resolves.toBe(null);
});

test(`return team if exist`, async () => {

    const id = 2394
    await expect(teamsDal.getTeamById(id)).resolves.toEqual(
        {
            id,
            name: 'Nordsjælland',
            leagueId: 320,
        });
});
