const Pattern = require('../models/Patterns'); 
const {StatusCodes} = require('http-status-codes'); 
const {BadRequestError, NotFound} = require('../errors')

const getAllPatterns = async (req, res)=>{
    const patterns = await Pattern.find({createdBy:req.user.userId}).sort('createdAt')
    res.status(StatusCodes.OK).json({patterns, count:patterns.length})
}

const getPattern = async (req, res)=>{
    const {user:{userId}, params:{id:patternId}} = req
    
    const pattern = await Pattern.findOne({
        _id:patternId, createdBy:userId
    })
    if(!pattern){
        throw new NotFoundError (`No fabric with id ${patternId}`)
    }
    res.status(StatusCodes.OK).json({pattern})
}

const createPattern = async (req, res)=>{
    req.body.createdBy = req.user.userId
    const pattern = await Pattern.create(req.body)
    res.status(StatusCodes.CREATED).json({pattern})
}

const updatePattern = async (req, res)=>{
    const {
        body:{name, garmentType, fabricTypeNeeded, fabricWeightNeeded, fabricLengthNeeded, fabricAssigned},
        user:{userId}, 
        params:{id:patternId}
    } = req

    if (name === ''|garmentType === ''| fabricTypeNeeded ===''| fabricWeightNeeded===''| fabricLengthNeeded ===''| fabricAssigned ===''){
        throw new BadRequestError ('name, garment type, fabric type needed, fabric length needed, and fabric assignment status fields cannot be empty')
    }
    const pattern = await Pattern.findOneAndUpdate({_id:patternId, createdBy:userId}, req.body, {new:true, runValidators:true})
    if(!pattern){
        throw new NotFoundError (`No fabric with id ${patternId}`)
    }
    res.status(StatusCodes.OK).json({pattern})
}

const deletePattern = async (req, res)=>{
    const {
        body:{name, garmentType, fabricTypeNeeded, fabricWeightNeeded, fabricLengthNeeded, fabricAssigned},
        user:{userId}, 
        params:{id:patternId}
    } = req

    const pattern = await Pattern.findOneAndRemove({
        _id:patternId, 
        createdBy:userId
    })
    if(!pattern){
        throw new NotFoundError (`No fabric with id ${patternId}`)
    }
    res.status(StatusCodes.OK).send()
}


module.exports = {
    getAllPatterns,
    getPattern,
    createPattern, 
    updatePattern, 
    deletePattern,  
}