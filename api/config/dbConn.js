var mongoose = require('mongoose');

let dbURL = 'mongodb://adminTODO:ToDo^DB3579@localhost:27017/todo_DB';
let dbURL_test = 'mongodb://localhost:27017/todo_DB_unit_test';
mongoose.Promise = global.Promise;

function connect(){
    return new Promise(function(resolve, reject){
        if(process.env.NODE_ENV === 'test'){
            mongoose.connect(dbURL_test, {useNewUrlParser: true, useCreateIndex:true, useUnifiedTopology: true})
            .then((res, err) => {
                if(err){
                    console.log("err:",err);
                    return reject(err);
                }
                resolve();
            });
        }else{
            mongoose.connect(dbURL, {useNewUrlParser: true, useCreateIndex:true, useUnifiedTopology: true})
            .then((res, err) => {
                if(err){
                    console.log("err:",err);
                    return reject(err);
                }
        
                resolve();
            });
        };
    });
}
    
function close(){
    //Dropping test DB after testing.
    mongoose.connection.db.dropDatabase();
    return mongoose.disconnect();
}

module.exports = {connect, close};