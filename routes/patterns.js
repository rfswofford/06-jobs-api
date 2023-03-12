const express = require('express')
const router = express.Router()

const {getAllPatterns,
    getPattern,
    createPattern, 
    updatePattern, 
    deletePattern} = require('../controllers/patterns')


router.route('/').post(createPattern).get(getAllPatterns)
router.route('/:id').get(getPattern).delete(deletePattern).patch(updatePattern)
    
module.exports = router