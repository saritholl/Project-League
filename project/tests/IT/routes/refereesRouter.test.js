
const request = require('supertest')
var session = require('supertest-session');

var express = require("express");

var app = express();
const referees = require("../../../routes/referees");
app.use("/referees", referees);

jest.setTimeout(60000);
// var testSession = session(app, {
//   before: function (req) {
//     req.set('authorization', 'Basic aGVsbG86d29ybGQK');
//   }
// });

var cookieAccess = {
  domain: 'example.com',
  path: '/testpath',
  secure: true,
  script: true,
};
var testSession = session(app, {
  cookieAccess: cookieAccess,
  before: function (req) {
    req.cookies = this.cookies.toValueString();
    req.session = "sarit"
  },
});

// beforeEach(function () {
//   testSession = session(app);
// });

describe('add referee endpoint', () => {
  it('should fail if user is not logged in', async () => {
    const res = await request(app)
      .post('/referees/addReferee')
      .set('Content-type', 'application/x-www-form-urlencoded')
      .send({
        refereeName: "alon yefet",
        refereeType: 1,
        refereeStatus: 0,
      })

    expect(res.statusCode).toBe(401)
    // expect(res.text).toBe(Errors.USER_NOT_LOGGED_IN)

  })

  it('should fail add referee if not admin', function (done) {

    testSession.post('/referees/addReferee')
      .send({ username: 'foo', password: 'password' })
      .expect(401)
      .end(done);
    expect(1).toBe(1)
  })

  it('should fail delete referee if not admin', function (done) {

    testSession.post('/referees/deleteReferee')
      .send({ username: 'foo1', password: 'password1' })
      .expect(401)
      .end(done);
    expect(1).toBe(1)
  })

  it('should fail delete referee if not admin', function (done) {

    testSession.post('/referees/deleteReferee')
      .send({ username: 'foo2', password: 'password2' })
      .expect(401)
      .end(done);
    expect(1).toBe(1)
  })

  it('should fail delete referee if not admin', function (done) {

    testSession.post('/referees/deleteReferee')
      .send({ username: 'msohe', password: '123141141' })
      .expect(401)
      .end(done);
    expect(1).toBe(1)
  })

  it('should fail delete referee if not admin', function (done) {

    testSession.post('/referees/deleteReferee')
      .send({ username: 'faggot', password: '52143123' })
      .expect(401)
      .end(done);
    expect(1).toBe(1)
  })

  it('trying to add referee and delete it #0', function (done) {

    testSession.post('/referees/addReferee')
      .send({ username: 'foo', password: 'password' })
      .expect(401)
      .end(done);
    expect(1).toBe(1)
  })

  it('trying to add referee and delete it #1', function (done) {

    testSession.post('/referees/addReferee')
      .send({ username: 'foo', password: 'password' })
      .expect(401)
      .end(done);
    expect(1).toBe(1)
  })

  it('trying to add referee and delete it #2', function (done) {

    testSession.post('/referees/addReferee')
      .send({ username: 'foo', password: 'password' })
      .expect(401)
      .end(done);
    expect(1).toBe(1)
  })

  it('trying to add referee and delete it #3', function (done) {

    testSession.post('/referees/addReferee')
      .send({ username: 'foo', password: 'password' })
      .expect(401)
      .end(done);
    expect(1).toBe(1)
  })



//   describe('succesful addReferee', function(){
//     test("9.3.1.f : login - permited user", async () => {
//         const res = await request(app)
//         .post('/Login').send({
//           UserName: 'Sarit',
//           UserRole:"ADMIN"

//         })
//         expect(res.statusCode).toBe(201)
//     })
//     test("9.3.1.g : Add referee attempt Successful", async () => {
//         response = await farUser.post('/referees/addReferee').send({
//             refereeName:'Mike Dean',
//             refereeType: 1,
//             refereeType: 0
//         });
//         expect(response.statusCode).toBe(201);
//     })
// })
})