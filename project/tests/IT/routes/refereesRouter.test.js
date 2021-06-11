const request = require('supertest')
const Errors = require("../../../errors");
const DButils = require("../../../routes/utils/DButils");

const main = require('../../../main');
var app = request.agent(main.app);

require('dotenv').config();

const matchId = 180
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

    const ref_id = ref_db_id[0]['']

    expect(res.body).toEqual({
      id: ref_id,
      refereeName,
      refereeRole,
    })

    const ref = await DButils.execQuery(`SELECT * FROM dbo.Referees WHERE id = ${ref_id}`)

    expect(ref.length).toBe(1)
  })
})

describe('delete ref endpoint', () => {
  it('should fail if user is not logged in', async () => {
    const res = await app.delete('/referees/delete')
      .send({
        id: '1'
      })

    expect(res.statusCode).toBe(403)
    expect(res.text).toBe(Errors.USER_NOT_LOGGED_IN)
  })

  it(`should fail for invalid user id`, async () => {

    const res = await app.delete('/referees/delete')
      .set({ 'user_id': 54645 })
      .send({
        id: '1'
      })

    expect(res.statusCode).toBe(403)
    expect(res.text).toBe(Errors.USER_NOT_LOGGED_IN)
  })

  it(`should fail if user is not admin`, async () => {

    await DButils.execQuery(`insert into dbo.Users (UserName, UserRole) values ('Sarit', 'User')`)

    const db_id = await DButils.execQuery(
      `select @@identity`
    );

    const res = await app.delete('/referees/delete')
      .set({ 'user_id': db_id[0][''] })
      .send({
        id: '1'
      })

    expect(res.statusCode).toBe(403)
    expect(res.text).toBe(Errors.USER_MUST_BE_ADMIN)
  })

  it(`should delete ref if user is an admin`, async () => {

    await DButils.execQuery(`insert into dbo.Users (UserName, UserRole) values ('Sarit', 'ADMIN')`)

    const user_db_id = await DButils.execQuery(
      `select @@identity`
    );

    await DButils.execQuery(`insert into dbo.Referees (refereeName, refereeRole) values ('Sarit', 'MAIN')`)

    const ref_db_id = await DButils.execQuery(
      `select @@identity`
    );

    const ref_id = ref_db_id[0]['']

    const existing_ref = await DButils.execQuery(`SELECT * FROM dbo.Referees WHERE id = ${ref_id}`)

    expect(existing_ref.length).toBe(1)

    const res = await app
      .delete('/referees/delete')
      .set({ 'user_id': user_db_id[0][''] })
      .send({
        id: ref_id
      })

    expect(res.statusCode).toBe(200)

    const removed_ref = await DButils.execQuery(`SELECT * FROM dbo.Referees WHERE id = ${ref_id}`)

    expect(removed_ref.length).toBe(0)
  })
})

describe('set refs endpoint', () => {
  it('should fail if user is not logged in', async () => {
    const res = await app.put('/referees/settingReferees')
      .send({
        matchId,
        refereeId: 1,
        refereeId: 2,
        refereeId: 3,
        refereeId: 4,
      })

    expect(res.statusCode).toBe(403)
    expect(res.text).toBe(Errors.USER_NOT_LOGGED_IN)
  })

  it(`should fail for invalid user id`, async () => {

    const res = await app.put('/referees/settingReferees')
      .set({ 'user_id': 54645 })
      .send({
        matchId,
        refereeId: 1,
        refereeId: 2,
        refereeId: 3,
        refereeId: 4,
      })

    expect(res.statusCode).toBe(403)
    expect(res.text).toBe(Errors.USER_NOT_LOGGED_IN)
  })

  it(`should fail if user is not admin`, async () => {

    await DButils.execQuery(`insert into dbo.Users (UserName, UserRole) values ('Sarit', 'User')`)

    const db_id = await DButils.execQuery(
      `select @@identity`
    );

    const res = await app.put('/referees/settingReferees')
      .set({ 'user_id': db_id[0][''] })
      .send({
        matchId,
        refereeId: 1,
        refereeId: 2,
        refereeId: 3,
        refereeId: 4,
      })

    expect(res.statusCode).toBe(403)
    expect(res.text).toBe(Errors.USER_MUST_BE_ADMIN)
  })

  it(`should set refs if user is an admin`, async () => {

    await DButils.execQuery(`insert into dbo.Users (UserName, UserRole) values ('Sarit', 'ADMIN')`)

    const user_db_id = await DButils.execQuery(
      `select @@identity`
    );

    await DButils.execQuery(`insert into dbo.Fixtures (roundId, homeTeamId, awayTeamId, stadiumId, startTime)
     values (1,2,3,4, '${startTime}')`)

    const match_db_id = await DButils.execQuery(
      `select @@identity`
    );
    
    const matchId = match_db_id[0]['']

    await DButils.execQuery(`insert into dbo.Referees (refereeName, refereeRole) values ('Sarit', 'ASSISTANT')`)
    const ref1_db_id = await DButils.execQuery(
      `select @@identity`
    );
    const refereeId1 = ref1_db_id[0]['']

    await DButils.execQuery(`insert into dbo.Referees (refereeName, refereeRole) values ('Sarit2', 'ASSISTANT')`)
    const ref2_db_id = await DButils.execQuery(
      `select @@identity`
    );
    const refereeId2 = ref2_db_id[0]['']

    await DButils.execQuery(`insert into dbo.Referees (refereeName, refereeRole) values ('Sarit3', 'MAIN')`)
    const ref3_db_id = await DButils.execQuery(
      `select @@identity`
    );
    const refereeId3 = ref3_db_id[0]['']

    await DButils.execQuery(`insert into dbo.Referees (refereeName, refereeRole) values ('Sarit4', 'ASSISTANT')`)
    const ref4_db_id = await DButils.execQuery(
      `select @@identity`
    );
    const refereeId4 = ref4_db_id[0]['']

    const res = await app.put('/referees/settingReferees')
      .set({ 'user_id': user_db_id[0][''] })
      .send({
        matchId,
        refereeId1,
        refereeId2,
        refereeId3,
        refereeId4,
      })

    expect(res.statusCode).toBe(200)
  })
})