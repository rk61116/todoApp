const jwt = require('jsonwebtoken');
const user = require('../models/users');
const configData = require('../../nodemon.json').env;

const secret = process.env.JWT_KEY||configData.JWT_KEY;

module.exports = (req, res, next) => {
    try{
        // console.log(req.headers.authorization);
        if(req.headers.authorization){
            var details = req.headers.authorization.split(" ");
            const decoded = jwt.verify(details[1], secret);
            user.findOne({_id:decoded.userId, status:'Active'})
            .select('email, _id')
            .exec()
            .then(userData => {
                if(userData && userData._id == decoded.userId){
                    req.userData = decoded; 
                    next();
                }else{
                    return res.status(401).json({message: 'Auth field.'});    
                }
            })
            .catch(error => {
                return res.status(401).json({message: 'Auth field.'});
            });
        }else{
            return res.status(401).json({message: 'Auth field.'});
        }
    }catch(e){
        return res.status(401).json({message: 'Auth field.'});
    }    
};