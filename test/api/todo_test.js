let chai = require("chai");
let expect = chai.expect;
let chaiHttp = require("chai-http");
let should = chai.should();
const faker = require('faker');


let token;
let listData = [];
let confiData = require('../../nodemon.json').env;

process.env = confiData;
process.env.NODE_ENV = 'test';

//Loading app file from root direcotry
const app = require('../../app');
//DB connection
const conn = require('../../api/config/dbConn');

chai.use(chaiHttp);

describe("TODOs Module Unit Testing", function(){   
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

    describe ("CURD operations on TODO", function(){
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

        let todos = [
            {"todo":"Attend meeting with foreign delegates "+faker.name.findName()+" and "+faker.name.findName()},
            {"todo":"Attend meeting with foreign delegates "+faker.name.findName()+" and "+faker.name.findName()},
            {"todo":"Attend meeting with foreign delegates "+faker.name.findName()+" and "+faker.name.findName()},
            {"todo":"Attend meeting with foreign delegates "+faker.name.findName()+" and "+faker.name.findName()},
            {"todo":"Attend meeting with foreign delegates "+faker.name.findName()+" and "+faker.name.findName()},
            {"todo":"Attend meeting with foreign delegates "+faker.name.findName()+" and "+faker.name.findName()},
            {"todo":"Attend meeting with foreign delegates "+faker.name.findName()+" and "+faker.name.findName()}
        ]

        it("Should create new todo", (done) => {
            chai.request(app)
                .post("/todo/")
                .set('Content-Type', 'application/json')
                .set('Authorization', token)
                .send(todos[0])
                .then((res) => {
                    const body =res.body;
                    res.should.have.status(201);
                    expect(body).to.contain.property("message");
                    expect(body.message).to.equal("TODO created successfully.");
                    expect(body).to.contain.property("data");
                    expect(body.data).to.contain.property("status");
                    expect(body.data).to.contain.property("isDeleted");
                    expect(body.data).to.contain.property("todo");
                    expect(body.data).to.contain.property("_id");
                    expect(body.data).to.contain.property("status");
                    expect(body.data.isDeleted).to.equal(false);
                    expect(body.data.status).to.equal(false);
                    done()
                })
                .catch(err =>{
                    done(err);
                });
        });

        it("Should List todo items", (done) => {
            chai.request(app)
                .get("/todo/")
                .set('Content-Type', 'application/json')
                .set('Authorization', token)
                .send({})
                .then((res) => {
                    const body =res.body;
                    listData = body.data;
                    res.should.have.status(200);
                    expect(body).to.contain.property("data");
                    expect(body.data[0]).to.contain.property("status");
                    expect(body.data[0]).to.contain.property("isDeleted");
                    expect(body.data[0]).to.contain.property("todo");
                    expect(body.data[0]).to.contain.property("_id");
                    expect(body.data[0]).to.contain.property("status");
                    expect(body.data[0].isDeleted).to.equal(false);
                    done()
                })
                .catch(err =>{
                    done(err);
                });
        });

        it("Should Update todo item", (done) => {
            const updateObj = {
                _id:listData[0]._id,
                status: false
            }
            chai.request(app)
                .patch("/todo/")
                .set('Content-Type', 'application/json')
                .set('Authorization', token)
                .send(updateObj)
                .then((res) => {
                    const body =res.body;
                    res.should.have.status(200);
                    expect(body).to.contain.property("message");
                    expect(body.message).to.equal('TODO item is updated successfully.');
                    done()
                })
                .catch(err =>{
                    done(err);
                });
        });

        it("Should Delete todo item", (done) => {
            const updateObj = {
                _id:listData[0]._id,
                isDeleted: true
            }
            chai.request(app)
                .delete("/todo/")
                .set('Content-Type', 'application/json')
                .set('Authorization', token)
                .send(updateObj)
                .then((res) => {
                    const body =res.body;
                    res.should.have.status(200);
                    expect(body).to.contain.property("message");
                    expect(body.message).to.equal('TODO item deleted successfully.');
                    done()
                })
                .catch(err =>{
                    done(err);
                });
        });
    });
})