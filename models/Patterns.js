const mongoose  = require('mongoose')

const PatternSchema = new mongoose.Schema({

    name:{
        type: String, 
        maxLength: 100, 
        required: [true, 'Please provide Pattern name'], 
    },

    patternCompany:{
        type: String, 
        maxLength: 100,
    },

    garmentType: {
        type: String, 
        enum: ['pants','top', 'skirt', 'jumpsuit', 'dress', 'outerwear', 'accessory', 'swimwear', 'activewear','lingerie']
    },
  
    fabricTypeNeeded:{
        type: String,
        enum:['knit', 'woven'],
        required:[true, 'Please provide fabric type required by pattern'], 

    },

    fabricWeightNeeded:{
        type:String, 
        enum:['lightweight', 'midweight', 'heavyweight'],
        required:[true, 'Please provide fabric weight required by pattern'], 


    }, 

    fabricLengthNeeded:{
        type: Number, 
        required:[true, 'Please provide fabric length needed for pattern'], 

    },

    fabricAssigned:{
        type:Boolean, 
        default: false, 
        required: [true, 'Please note if this pattern has been assigned to a fabric'],

    },

    createdBy:{
        type: mongoose.Types.ObjectId, 
        ref: 'User',
        required:[true, 'Please provide user'], 
    }

}, {timestamps:true})

module.exports = mongoose.model('Pattern', PatternSchema)