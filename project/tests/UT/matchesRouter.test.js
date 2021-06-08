const request = require('supertest')
var session = require('supertest-session');

var express = require("express");
const Errors = require("../../errors");

var app = express();
const matches = require("../../routes/matches");
app.use("/matches", matches);

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
    req.session = "tom"
  },
});

// beforeEach(function () {
//   testSession = session(app);
// });

describe('add match endpoint', () => {
  it('should fail if user is not logged in', async () => {
    const res = await request(app)
      .post('/matches/add')
      .set('Content-type', 'application/x-www-form-urlencoded')
      .send({
        roundId: 1,
        homeTeamId: 22,
        awayTeamId: 54,
        refereeId: 13,
        startTime: "1"
      })

    expect(res.statusCode).toBe(403)
    expect(res.text).toBe(Errors.USER_NOT_LOGGED_IN)

  })

  it('should fail create match if not admin', function (done) {

    testSession.post('/matches/add')
      .send({ username: 'foo', password: 'password' })
      .expect(403)
      .end(done);

    // const res = await request(app)
    //   .post('/matches/add')
    //   .set('Content-type', 'application/x-www-form-urlencoded')
    //   .send({
    //     roundId: 1,
    //     homeTeamId: 22,
    //     awayTeamId: 54,
    //     refereeId: 13,
    //     startTime: "1"
    //   })

    expect(1).toBe(1)
    // expect(res.text).toBe(Errors.USER_MUST_BE_ADMIN)
  })
})