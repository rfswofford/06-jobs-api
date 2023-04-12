const Fabric = require('../models/Fabrics');
const {StatusCodes} = require('http-status-codes');
const {BadRequestError, NotFound} = require('../errors')

const getAllFabrics = async (req, res)=>{
    const fabrics = await Fabric.find({createdBy:req.user.userId}).sort('createdAt')
    res.status(StatusCodes.OK).json({fabrics, count:fabrics.length})
}

const getFabric = async (req, res)=>{
    res.send('register user')
}

const createFabric = async (req, res)=>{
    req.body.createdBy = req.user.userId
    const fabric = await Fabric.create(req.body)
    res.status(StatusCodes.CREATED).json({fabric})
}

const updateFabric = async (req, res)=>{
    res.send('register user')
}

const deleteFabric = async (req, res)=>{
    res.send('register user')
}


module.exports = {
    getAllFabrics,
    getFabric,
    createFabric, 
    updateFabric, 
    deleteFabric,  
}