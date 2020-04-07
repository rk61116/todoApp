const  dbData = require('../../nodemon.json').env;

const DBNAME = process.env.DBNAME || dbData.DBNAME;
const PASSWORD = process.env.PASSWORD || dbData.PASSWORD;
const USERNAME = process.env.USERNAME || dbData.USERNAME;

module.exports = {
    url:`mongodb://${USERNAME}:${PASSWORD}@localhost:27017/${DBNAME}`
}