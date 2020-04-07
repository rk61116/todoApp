const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const todo = require('../models/todos');

exports.create_todo = (req, res, next) => {
    let data = req.body;
    let result = {message:'', data:{}, errors:[] };
    if(!data.todo){
        result.errors.push('Required todo');
    }else{
        data.todo = data.todo.trim();
    };
    
    data.createdBy = req.userData.userId;
    
    if(result.errors.length){
        result.message = "Validation Errors.";
        return res.status(500).json(result);
    }else{
        const todoData =  new todo(data);
        todoData.save()
        .then(resData => {
            result.message = "TODO created successfully.";
            delete result.errors;
            result.data = {
                status: todoData.status,
                isDeleted: todoData.isDeleted,
                todo: todoData.todo,
                _id: todoData._id
            };
            return res.status(201).json(result);
        })
        .catch(err => { 
            result.errors.push(err);
            return res.status(500).json(result);
        });
    };
};

exports.get_all_todos = (req, res, next) => {
    let result = {data:[]}
    let data = req.query;
    let limit = 0;
    let outputFields = {};
    let orderBy = {};
    let page = 0;
    
    if(data.limit){
        limit = parseInt(data.limit);
        delete data.limit;
    }
    if(data.outputFields){
        outputFields = data.outputFields;
        delete data.outputFields;
    }
    if(data.sortBy){
        orderBy = data.sortBy;
        delete data.sortBy;
    }
    if(data.page && parseInt(data.page) >= 0){
        page = parseInt(data.page-1)*parseInt(limit);
        delete data.page;
    }

    if(data.startDate && data.endDate){
        data.createdAt = {$gte:new Date(data.startDate), $lt:new Date(data.endDate)};
        delete data.startDate;
        delete data.endDate;
    }

    if(!data.isDeleted){
        data.isDeleted = false;
    }
    
    todo.find(data)
    .select(outputFields)
    .sort(orderBy)
    .limit(limit)
    .skip(page)
    .exec()
    .then(todoArr => {
        result.data = todoArr;
        return res.status(200).json(result);
    })
    .catch( err => {
        return res.status(500).json({errors:err});
    });
};

exports.update_todo = (req, res, next) => {
    let result = { message:"", errors:[] }
    let data = req.body;
    let query = {};
    
    if(!data._id){
        result.errors.push('Required _id');
    }else{
        query._id = data._id;
        delete data._id;
    };
    query.createdBy = req.userData.userId;
    query.isDeleted = false;

    if(result.errors.length){
        result.message = "Validation Error."
        return res.status(500).json(result);
    }else{
        delete result.errors;
        data.updatedAt = new Date();
        data.updatedBy = req.userData.userId;
        todo.updateOne(query, {$set:data})
        .exec()
        .then(resObj => {
            result.message = "TODO item is updated successfully.";
            return res.status(200).json(result);
        })
        .catch(err => {
            return res.status(500).json({errors:err});
        });
    };
};

exports.delete_todo = (req, res, next) => {
    let result = { message:"", errors:[]};
    let data = req.body;
    let query = {};
    
    if(!data._id){
        result.errors.push('Required _id');
    }else{
        query._id = data._id;
        delete data._id;
    };
    query.createdBy = req.userData.userId;
    query.isDeleted = false;

    if(result.errors.length){
        result.message = "Validation Error."
        return res.status(500).json(result);
    }else{
        let obj = {
            isDeleted: true,
            isDeletedBy:req.userData.userId,
            isDeletedAt: new Date()
        };

        delete result.errors;
        
        todo.updateOne(query, {$set:obj})
        .exec()
        .then(resObj => {
            result.message = "TODO item deleted successfully.";
            return res.status(200).json(result);
        })
        .catch(err => {
            return res.status(500).json({errors:err});
        });
    };
};