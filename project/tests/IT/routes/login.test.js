require("dotenv").config();
const { response } = require("express");
const request = require('supertest');
const main = require('../../../main');
var app = request.agent(main.app);

const UserName = 'tester2020';
const PASSWORD = '123456a';
const worng_PASSWORD = 'afasfas';
 
describe('POST /Login', function() {
    it("3: Successful login ", async () => {     
        res = await app.post('/Login').send({
            UserName,
            PASSWORD,
            
        });
        expect(res.statusCode).toBe(200);
    })
  
    test("3.1: Unsuccessful login -wrong parameters", async () => {
        const res = await app.post("/Login").send({
            UserName,
            worng_PASSWORD,
        });
        expect(res.statusCode).toBe(401);
    })

    // test("2.3.c: Unsuccessful login - 'wrong' parameters", async () => {
    //     response = await request(app).post("/Login").send({
    //         username: 'tester2 !0',
    //         password: ' 1 1 2 3 2 ~ ~ ~'
    //     });
    //     expect(response.statusCode).toBe(401);
    //
    // })
});