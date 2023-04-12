const Fabric = require('../models/Fabrics');
const {StatusCodes} = require('http-status-codes');
const {BadRequestError, NotFoundError} = require('../errors')

const getAllFabrics = async (req, res)=>{
    const fabrics = await Fabric.find({createdBy:req.user.userId}).sort('createdAt')
    res.status(StatusCodes.OK).json({fabrics, count:fabrics.length})
}

const getFabric = async (req, res)=>{
    const {
        user:{userId}, 
        params:{id:fabricId}
    } = req
    
    const fabric = await Fabric.findOne({
        _id:fabricId, createdBy:userId
    })
    if(!fabric){
        throw new NotFoundError (`No fabric with id ${fabricId}`)
    }
    res.status(StatusCodes.OK).json({fabric})
}

const createFabric = async (req, res)=>{
    req.body.createdBy = req.user.userId
    const fabric = await Fabric.create(req.body)
    res.status(StatusCodes.CREATED).json({fabric})
}

const updateFabric = async (req, res)=>{
    const {
        body:{fabricName, fabricType, fabricWeight, fabricLength,fabricContent, fabricColor, fabricStore, fabricAssignment},
        user:{userId}, 
        params:{id:fabricId}
    } = req

    if (fabricName === ''|fabricType === ''| fabricWeight ===''| fabricLength ===''| fabricAssignment ===''){
        throw new BadRequestError ('name, fabric type, weight, fabric length, and fabric project assignment fields cannot be empty')
    }
    const fabric = await Fabric.findOneAndUpdate({_id:fabricId, createdBy:userId}, req.body, {new:true, runValidators:true})
    if(!fabric){
        throw new NotFoundError (`No fabric with id ${fabricId}`)
    }
    res.status(StatusCodes.OK).json({fabric})
}

const deleteFabric = async (req, res)=>{
    const {
        body:{fabricName, fabricType, fabricWeight, fabricLength, fabricAssignment},
        user:{userId}, 
        params:{id:fabricId}
    } = req

    const fabric = await Fabric.findOneAndRemove({
        _id:fabricId, 
        createdBy:userId
    })
    if(!fabric){
        throw new NotFoundError (`No fabric with id ${fabricId}`)
    }
    res.status(StatusCodes.OK).json({msg: "The entry was deleted."})
}


module.exports = {
    getAllFabrics,
    getFabric,
    createFabric, 
    updateFabric, 
    deleteFabric,  
}