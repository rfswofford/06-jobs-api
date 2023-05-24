const express = require('express'); 
const router = express.Router(); 

const{getAllFabMatch, getAllPatternMatch} = require('../controllers/match')

router.route('/matchFabric/:id').get(getAllFabMatch)
router.route('/matchPattern/:id').get(getAllPatternMatch)

module.exports=router