const Pattern = require('../models/Patterns'); 
const {StatusCodes} = require('http-status-codes'); 
const {BadRequestError, NotFound} = require('../errors')

const getAllPatterns = async (req, res)=>{
    const patterns = await Pattern.find({createdBy:req.user.userId}).sort('createdAt')
    res.status(StatusCodes.OK).json({patterns, count:patterns.length})
}

const getPattern = async (req, res)=>{
    res.send('register user')
}

const createPattern = async (req, res)=>{
    req.body.createdBy = req.user.userId
    const pattern = await Pattern.create(req.body)
    res.status(StatusCodes.CREATED).json({pattern})
}

const updatePattern = async (req, res)=>{
    res.send('register user')
}

const deletePattern = async (req, res)=>{
    res.send('register user')
}


module.exports = {
    getAllPatterns,
    getPattern,
    createPattern, 
    updatePattern, 
    deletePattern,  
}