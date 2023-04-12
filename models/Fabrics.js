const mongoose  = require('mongoose')

const FabricSchema = new mongoose.Schema({

    name:{
        type: String, 
        maxLength: 100, 
        required: [true, 'Please provide fabric name'], 
    },
  
    fabricType:{
        type: String,
        enum:['knit', 'woven'],
        required:[true, 'Please provide fabric type'], 

    },

    weight:{
        type:String, 
        enum:['lightweight', 'midweight', 'heavyweight'],
        required:[true, 'Please provide fabric weight'], 


    }, 

    fabricLength:{
        type: Number, 
        required:[true, 'Please provide fabric length'], 

    },

    fabricContent:{
        type: String, 
    },

    fabricColor:{
        type: String, 
        maxLength: 25, 

    }, 

    fabricStore:{
        type: String, 
        maxLength: 40,
    },

    fabricProjectAssignment:{
        type:Boolean, 
        default: false, 
        required: [true, 'Please note if this fabric has been assigned to a project'],

    },

    createdBy:{
        type: mongoose.Types.ObjectId, 
        ref: 'User',
        required:[true, 'Please provide user'], 
    }

}, {timestamps:true})

module.exports = mongoose.model('Fabric', FabricSchema)