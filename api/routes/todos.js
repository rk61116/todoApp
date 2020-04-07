const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const jwtTokenValidation = require('../config/jwtTokenValidation');
const todo = require('../models/todos');
const todoController = require('../controllers/todos');

router.post('/', jwtTokenValidation, todoController.create_todo);

router.get('/', jwtTokenValidation, todoController.get_all_todos);

router.patch('/', jwtTokenValidation, todoController.update_todo);

router.delete('/', jwtTokenValidation, todoController.delete_todo);

module.exports = router;