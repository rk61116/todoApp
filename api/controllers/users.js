const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const user = require('../models/users');

exports.signup_user = (req, res, next) => {
    let data = req.body;
    let result = {token:'', errors:[]};
    if(!data.email){
        result.errors.push('Required email');
    }else{
        data.email = data.email.trim();
    };

    if(!data.password){
        result.error.push('Require password');
    }else{
        data.password = data.password.toString().trim();
    };

    if(!data.gender){
        result.error.push('Required gender');
    }else{
        data.gender = data.gender.trim();
    }

    if(result.errors.length){

    }else{
        user.find({email:req.body.email})
        .exec()
        .then(userRes => {
            if(userRes.length){
                return res.status(422).json({
                    message:"Duplicate email ID."
                });
            }else{
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if(err){
                        return res.status(500).json({error:err});
                    }else{
                        data.status = 'Active';
                        data.password = hash;
                        const userData = new user(data);
                        userData.save()
                        .then(resultData => {
                            return res.status(201).json({
                                message:"Account successfully created."
                            });
                        })
                        .catch(err => {
                            console.log("error on create user:", err);
                            return res.status(400).json({error:err});
                        });
                    }
                });
            }
        });
    };
};

exports.login_user = (req, res, next) => {
    let data = req.body;
    let result = {token:'', errors:[]};

    if(!data.email){
        result.errors.push('Required email');
    }else{
        data.email = data.email.trim();
    };

    if(!data.password){
        result.errors.push('Required password');
    }else{
        data.password = data.password.toString().trim();
    }

    if(result.errors.length){
        result.message = "Validation Error";
        return res.status(500).json(result);
    }else{
        user.find({email:data.email, status:"Active"})
        .exec()
        .then(userRes => {
            if(userRes.length){
                bcrypt.compare(data.password, userRes[0].password, (err, pwdStatus) => {
                    if(err){
                        return res.status('401').json({
                            message:'Auth field.'
                        });
                    }
                    if(pwdStatus){
                        const token = jwt.sign(
                            {
                                email: userRes[0].email,
                                userId: userRes[0]._id
                            },
                            process.env.JWT_KEY,
                            {
                                expiresIn:"4h"
                            }
                        );
                        delete result.errors;
                        result.token = 'token '+token;
                        return res.status(201).json(result);
                    }else{
                        return res.status('401').json({
                            message:'Auth field.'
                        });
                    }
                });
            }else{
                return res.status('401').json({
                    message:'Auth field.'
                });
            }
        })
        .catch(err => {
            console.log("error on create user:", err);
            return res.status(500).json({error:err});
        });
    };
};

exports.delete_user = (req, res, next) => {
    user.updateOne({_id: req.userData.userId},{$set:{status:"In-Active", deletedAt: new Date()}})
    .exec()
    .then(result => {
        return res.status(200).json({
            message: "User deleted successful.",

        })
    })
    .catch(err => {
        console.log("error on create user:", err);
        return res.status(500).json({error:err});
    });
};