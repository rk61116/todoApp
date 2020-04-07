let chai = require("chai");
let expect = chai.expect;
let chaiHttp = require("chai-http");
let should = chai.should();

let token;
let confiData = require('../../nodemon.json').env;

process.env = confiData;
process.env.NODE_ENV = 'test';

//Loading app file from root direcotry
const app = require('../../app');
//DB connection
const conn = require('../../api/config/dbConn');

chai.use(chaiHttp);

describe("USER Module Unit Testing", function(){   
    describe ("Drop Old DB", function(){
        before( (done) => {
            conn.connect()
            .then(() => {
                conn.close()
                .then(() => {
                    done()
                })
                .catch((err) => {
                    done(err)
                });
            })
            .catch((err) => {
                done(err)
            });
        });
    });

    describe ("Testing /signup, /login and /delete  operations", function(){
        before( (done) => {
            conn.connect()
            .then(() => {
                done()
            })
            .catch((err) => {
                done(err)
            });
        });

        after( (done) => {
            conn.close()
            .then(() => {
                done()
            })
            .catch((err) => {
                done(err)
            });
        });
        var users = [{
            "firstName": "Ramakrishna",
            "lastName" : "Palakurti",
            "email": "ramakrishna_1209@yahoo.co",
            "password": "Ram@123",
            "gender": "Male",
            "DOB": "01-07-1987"
        }, {
            "firstName": "Ramakrishna",
            "lastName" : "Palakurti",
            "email": "ramakrishna_12@yahoo.co",
            "password": "Ram@123",
            "gender": "Male",
            "DOB": "01-07-1987"
        }]
        
        it("Should add user in DB", (done) => {
            chai.request(app)
                .post("/user/signup/")
                .send(users[0])
                .then((res) => {
                    const body =res.body;
                    res.should.have.status(201);
                    expect(body).to.contain.property("message");
                    expect(body.message).to.equal("Account successfully created.");
                    done()
                })
                .catch(err =>{
                    done(err);
                });
        });

        it("Faild to add duplicate user in DB", (done) => {
            chai.request(app)
                .post("/user/signup/")
                .send(users[0])
                .then((res) => {
                    const body =res.body;
                    res.should.have.status(422);
                    expect(body).to.contain.property("message");
                    expect(body.message).to.equal("Duplicate email ID.");
                    done()
                })
                .catch(err =>{
                    done(err);
                });
        });

        it("Should login user", (done) => {
            chai.request(app)
                .post("/user/login/")
                .send(users[0])
                .then((res) => {
                    const body =res.body;
                    res.should.have.status(201);
                    expect(body).to.contain.property("token");
                    token = body.token;
                    done()
                })
                .catch(err =>{
                    done(err);
                });
        });

        it("Faild login Without User deatils", (done) => {
            const userLogin = {email:users[0].email}
            chai.request(app)
                .post("/user/login/")
                .send(userLogin)
                .then((res) => {
                    const body =res.body;
                    res.should.have.status(500);
                    expect(body).to.contain.property("token");
                    expect(body.token).to.equal("");
                    expect(body).to.contain.property("errors");
                    expect(body).to.contain.property("message");
                    expect(body.message).to.equal("Validation Error");
                    token = body.token;
                    done()
                })
                .catch(err =>{
                    done(err);
                });
        });

        it("Should login user", (done) => {
            chai.request(app)
                .post("/user/login/")
                .send(users[0])
                .then((res) => {
                    const body =res.body;
                    res.should.have.status(201);
                    expect(body).to.contain.property("token");
                    token = body.token;
                    done()
                })
                .catch(err =>{
                    done(err);
                });
        });

        it("Should delete user", (done) => {
            chai.request(app)
                .delete("/user/")
                .set('Content-Type', 'application/json')
                .set('Authorization', token)
                .then((res) => {
                    const body =res.body;
                    res.should.have.status(200);
                    expect(body).to.contain.property("message");
                    expect(body.message).to.equal("User deleted successful.");
                    done()
                })
                .catch(err =>{
                    done(err);
                });
        });
    });
})