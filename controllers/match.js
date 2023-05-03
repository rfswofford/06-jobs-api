const Pattern = require('../models/Patterns'); 
const Fabric = require('../models/Fabrics')
const {StatusCodes} = require('http-status-codes'); 
const {BadRequestError, NotFoundError} = require('../errors')

const getAllFabMatch = async (req, res) =>{
    const {
        user:{userId}, 
        params:{id:patternId}
    } = req

    const pattern = await Pattern.findOne({
        _id:patternId, 
        createdBy:userId,

    })

    if(!pattern){
        throw new NotFoundError (`No pattern with id ${patternId}`)
    }

    const reqFabricType = pattern.reqFabricType
    const reqFabricWeight = pattern.reqFabricWeight

    const fabrics = await Fabric.find({createdBy:req.user.userId}).sort('createdAt')

    let fabMatchesArray = []
    for (let i = 0; i < fabrics.length-1; i++){
        if (fabrics[i].fabricType === reqFabricType && fabrics[i].fabricWeight === reqFabricWeight){
            fabMatchesArray.push(fabrics[i]);
            }
    }

    if(fabMatchesArray.length === 0){
        throw new NotFoundError (`No fabrics match this pattern`)
    } else if (fabMatchesArray.length > 0){
        res.status(StatusCodes.OK).json(fabMatchesArray)
    }
}


const getAllPatternMatch = async (req, res)=>{
    const {
        user:{userId}, 
        params:{id:fabricId}
    } = req
    
    const fabric = await Fabric.findOne({
        _id:fabricId, 
        createdBy:userId
    })

    if(!fabric){
        throw new NotFoundError (`No fabric with id ${fabricId}`)
    }

    const fabricType = fabric.fabricType
    const fabricWeight = fabric.fabricWeight
    const fabricName = fabric.fabricName

    const patterns = await Pattern.find({createdBy:req.user.userId}).sort('createdAt')

    let patMatchesArray = []
    for (let i = 0; i < patterns.length-1; i++){
        if (patterns[i].reqFabricType === fabricType && patterns[i].reqFabricWeight === fabricWeight){
            patMatchesArray.push(patterns[i]);
            }
    }

    if(patMatchesArray.length === 0){
        throw new NotFoundError (`No patterns match this fabric`)
    } else if (patMatchesArray.length > 0){
        res.status(StatusCodes.OK).json({fabricName, patMatchesArray})
    }
}

module.exports = {
    getAllFabMatch, 
    getAllPatternMatch,
}