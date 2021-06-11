const request = require('supertest')
const Errors = require("../../../errors");
const DButils = require("../../../routes/utils/DButils");

const main = require('../../../main');
var app = request.agent(main.app);

require('dotenv').config();

const roundId = 240941
const homeTeamId = 180
const awayTeamId = 339
const stadiumId = 5599
const startTime = (new Date((new Date(new Date().setDate(new Date().getDate() + 1)).setHours(16) - (new Date()).getTimezoneOffset() * 60000))).toISOString().slice(0, -1)
const refereeName = 'Sarit'
const refereeRole = 'MAIN'

// TODO: add, delete, set
beforeEach(async () => {
  await DButils.execQuery(`DELETE FROM dbo.Referees`)
  await DButils.execQuery(`DELETE FROM dbo.Fixtures`)
  await DButils.execQuery(`DELETE FROM dbo.Users`)
});

describe('add ref endpoint', () => {
  it('should fail if user is not logged in', async () => {
    const res = await app
      .post('/referees/add')
      .send({
        refereeName,
        refereeRole,
      })

    expect(res.statusCode).toBe(403)
    expect(res.text).toBe(Errors.USER_NOT_LOGGED_IN)
  })

  it(`should fail for invalid user id`, async () => {

    const res = await app
      .post('/referees/add')
      .set({ 'user_id': 54645 })
      .send({
        refereeName,
        refereeRole,
      })

    expect(res.statusCode).toBe(403)
    expect(res.text).toBe(Errors.USER_NOT_LOGGED_IN)
  })

  it(`should fail if user is not admin`, async () => {

    await DButils.execQuery(`insert into dbo.Users (UserName, UserRole) values ('Sarit', 'User')`)

    const db_id = await DButils.execQuery(
      `select @@identity`
    );

    const res = await app
      .post('/referees/add')
      .set({ 'user_id': db_id[0][''] })
      .send({
        refereeName,
        refereeRole,
      })

    expect(res.statusCode).toBe(403)
    expect(res.text).toBe(Errors.USER_MUST_BE_ADMIN)
  })

  it(`should add ref if user is an admin`, async () => {

    await DButils.execQuery(`insert into dbo.Users (UserName, UserRole) values ('Sarit', 'ADMIN')`)

    const user_db_id = await DButils.execQuery(
      `select @@identity`
    );

    const res = await app
      .post('/referees/add')
      .set({ 'user_id': user_db_id[0][''] })
      .send({
        refereeName,
        refereeRole,
      })

    expect(res.statusCode).toBe(201)

    const ref_db_id = await DButils.execQuery(
      `select @@identity`
    );

    expect(res.body).toEqual({
      id: ref_db_id[0][''],
      refereeName,
      refereeRole,
    })
  })
})