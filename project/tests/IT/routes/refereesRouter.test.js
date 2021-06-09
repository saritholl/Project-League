// const request = require('supertest')
// var session = require('supertest-session');

// var express = require("express");
// const Errors = require("../../errors");

// var app = express();
// const matches = require("../../routes/referees");
// app.use("/referees", matches);

// // var testSession = session(app, {
// //   before: function (req) {
// //     req.set('authorization', 'Basic aGVsbG86d29ybGQK');
// //   }
// // });

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

// // beforeEach(function () {
// //   testSession = session(app);
// // });

// describe('add referee endpoint', () => {
//   it('should fail if user is not logged in', async () => {
//     const res = await request(app)
//       .post('/referees/addReferee')
//       .set('Content-type', 'application/x-www-form-urlencoded')
//       .send({
//         refereeName: "alon yefet",
//         refereeType: 1,
//         refereeStatus: 0,
//       })

//     expect(res.statusCode).toBe(403)
//     expect(res.text).toBe(Errors.USER_NOT_LOGGED_IN)

//   })

//   it('should fail add referee if not admin', function (done) {

//     testSession.post('/referees/addReferee')
//       .send({ username: 'foo', password: 'password' })
//       .expect(403)
//       .end(done);
//     expect(1).toBe(1)
//   })

//   it('should fail delete referee if not admin', function (done) {

//     testSession.post('/referees/deleteReferee')
//       .send({ username: 'foo', password: 'password' })
//       .expect(403)
//       .end(done);
//     expect(1).toBe(1)
//   })
// })