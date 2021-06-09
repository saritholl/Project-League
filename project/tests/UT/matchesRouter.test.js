const request = require('supertest')
// var session = require('supertest-session');
const Errors = require("../../errors");

const main = require('../../main');
var server = request.agent(main.app);

// jest.setTimeout(4000);

require('dotenv').config();

// var testSession = session(app, {
//   before: function (req) {
//     req.set('authorization', 'Basic aGVsbG86d29ybGQK');
//   }
// });



// var cookieAccess = {
//   domain: 'example.com',
//   path: '/testpath',
//   secure: true,
//   script: true,
// };
// var testSession = session(app, {
//   cookieAccess: cookieAccess,
//   before: function (req) {
//     req.cookies = this.cookies.toValueString();
//     req.session = "sarit"
//   },
// });

// beforeEach(function () {
//   testSession = session(app);
// });

const roundId = 240941
const homeTeamId = 2394
const awayTeamId = 180
const stadiumId = 5599
const startTime = "12412"

// TODO: tests:
// 1 - works
// 2 - no user
// 3 user 404
// 4 - no admin
describe('add match endpoint', () => {
  it('should fail if user is not logged in', async () => {
    const res = await server
      .post('/matches/add')
      .send({
        roundId,
        homeTeamId,
        awayTeamId,
        stadiumId,
        startTime
      })

    expect(res.statusCode).toBe(403)
    expect(res.text).toBe(Errors.USER_NOT_LOGGED_IN)
  })

  it(`should fail if user is doesn't exists`, async () => {
    const res = await server
      .post('/matches/add')
      .send({
        roundId,
        homeTeamId,
        awayTeamId,
        stadiumId,
        startTime
      })

    expect(res.statusCode).toBe(403)
    expect(res.text).toBe(Errors.USER_NOT_LOGGED_IN)
  })
})