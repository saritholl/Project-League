
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

describe('add referee endpoint', () => {
  test('should fail if user is not logged in', async () => {
    const response = await testSession.post('/referees/addReferee')
    .send({
      "refereeName": "tom dugma",
      "refereeType": 1,
      "refereeStatus":0
    })

    expect(response.statusCode).toBe(401)
    // expect(response.text).toBe(Errors.USER_NOT_LOGGED_IN)
  })
})


describe('add referee endpoint', () => {
  test('succsesful login and adding referee', async () => {
    const response = await testSession.post('/Login')
    .send({
      "UserName":"tom dugma",
      "password": "123456"
    })
    const adding_referee = await testSession.post('/referees/addReferee')
    .send({
      "refereeName": "sarit hollander",
      "refereeType": 1,
      "refereeStatus":0
    })
    
    expect(adding_referee.statusCode).toBe(201)
    // expect(response.text).toBe(Errors.USER_NOT_LOGGED_IN)
    
    await DBUtills.execQuery(`delete from dbo.Referees where refereeName  ='sarit hollander'`);

  })


})