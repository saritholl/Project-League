
const request = require('supertest')
var session = require('supertest-session');
var express = require("express");
const DBUtills=require("../../../routes/utils/DButils");
var app = express();
const referees = require("../../../routes/referees");
app.use("/referees", referees);
const main = require('../../../main');

jest.setTimeout(60000);
// var testSession = session(app, {

var testSession = null;
beforeEach(function () {
  
  testSession = session(main);
});

// LOGIN TEST
describe('add referee endpoint', () => {
  test('should fail if user is not logged in', async () => {
    const response = await testSession.post('/referees/addReferee')
    .send({
      "refereeName": "tom dugma",
      "refereeType": 1,
      "refereeStatus":0
    })

    expect(response.statusCode).toBe(401)
    await DBUtills.execQuery(`delete from dbo.Referees`);
    // expect(response.text).toBe(Errors.USER_NOT_LOGGED_IN)
  })
})

// ADD REFEREE TEST
describe('add referee endpoint', () => {
  test('succsesful login and adding referee', async () => {
    const response = await testSession.post('/Login')
    .send({
      "UserName":"tom dugma",
      "password": "123456"
    })
    // succssefull login
    expect(response.statusCode).toBe(200)

    const adding_referee = await testSession.post('/referees/addReferee')
    .send({
      "refereeName": "sarit hollander",
      "refereeType": 1,
      "refereeStatus":0
    })
    
    expect(adding_referee.statusCode).toBe(201)
    
    await DBUtills.execQuery(`delete from dbo.Referees where refereeName  ='sarit hollander'`);

  })

  // ADD REFEREE TEST
describe('add referee and check count of table', () => {
  test('succsesful login and adding referee', async () => {
    const response = await testSession.post('/Login')
    .send({
      "UserName":"tom dugma",
      "password": "123456"
    })
    // succssefull login
    expect(response.statusCode).toBe(200)
    const adding_referee = await testSession.post('/referees/addReferee')
    .send({
    
      "refereeName": "Ayalon Keves",
      "refereeType": 1,
      "refereeStatus":0
    })
    
    expect(adding_referee.statusCode).toBe(201)
    // expect(adding_referee.body.message).toBe("referee was added and created succsessfully");
    let count = await DBUtills.execQuery(`select count(*) as referees from dbo.Referees`);
    // excpeted 3 referees, tom sarit and ayalon
    expect(count[0].referees).toBe(1)

    // delete all referees
    await DBUtills.execQuery(`delete from dbo.Referees`);
    let after_count = await DBUtills.execQuery(`select count(*) as referees from dbo.Referees`);
    expect(after_count[0].referees).toBe(0)

  })
})

  describe('add referee', () => {
    test('should fail because user is not admin', async () => {
      const response = await testSession.post('/Login').send({
        "UserName":"Ayalon Keves",
        "password": "11111"
      })
      // succssefull login
      expect(response.statusCode).toBe(200)
      const adding_referee = await testSession.post('/referees/addReferee')
      .send({
        "refereeName": "sarit hollander",
        "refereeType": 1,
        "refereeStatus":0
      })
      // should fail to add because Ayalon is not an admin
      expect(adding_referee.statusCode).toBe(403)
      })
    })
  



})