const request = require('supertest');
const main = require('../../../main');
const DButils = require("../../../routes/utils/DButils");

var app = request.agent(main.app);

const userName = 'tester2020';
const userPassword = '123456a';
const wrongPassword = 'afasfas';

beforeEach(async () => {
    await DButils.execQuery(`DELETE FROM dbo.Users`)
});

describe('POST /login', function () {
    it("3: Successful login ", async () => {

        await DButils.execQuery(`insert into dbo.Users (userPassword, userName, userRole) values ('${userPassword}', '${userName}', 'User')`)

        const user_db_id = await DButils.execQuery(
            `select @@identity`
        );

        const res = await app.post('/login').send({
            userName,
            userPassword,

        });

        expect(res.statusCode).toBe(200);
        expect(res.headers['user_id']).toBe(user_db_id[0][''].toString());

    })

    test("3.1: Unsuccessful login - wrong parameters", async () => {
        const res = await app.post("/login").send({
            userName,
            userPassword: wrongPassword,
        });
        expect(res.statusCode).toBe(401);
    })

    test("Unsuccessful login - not doesn't exist", async () => {
        const res = await app.post("/login").send({
            userName: 'sarit',
            userPassword
        });
        expect(res.statusCode).toBe(401);
    })

    // test("2.3.c: Unsuccessful login - 'wrong' parameters", async () => {
    //     response = await request(app).post("/login").send({
    //         username: 'tester2 !0',
    //         userPassword: ' 1 1 2 3 2 ~ ~ ~'
    //     });
    //     expect(response.statusCode).toBe(401);
    //
    // })
});