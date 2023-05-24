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
    const patternName = pattern.patternName


    const fabrics = await Fabric.find({createdBy:req.user.userId}).sort('createdAt')

    let fabMatchesArray = []
    for (let i = 0; i < fabrics.length; i++){
        if (fabrics[i].fabricType === reqFabricType && fabrics[i].fabricWeight === reqFabricWeight){
            fabMatchesArray.push(fabrics[i]);
            }
    }
    console.log(fabMatchesArray)

    res.status(StatusCodes.OK).json({fabMatchesArray, patternName})

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
    for (let i = 0; i < patterns.length; i++){
        if (patterns[i].reqFabricType === fabricType && patterns[i].reqFabricWeight === fabricWeight){
            patMatchesArray.push(patterns[i]);
            }
    }


    res.status(StatusCodes.OK).json({fabricName, patMatchesArray})
    
}

module.exports = {
    getAllFabMatch, 
    getAllPatternMatch,
}