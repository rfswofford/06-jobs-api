const express = require('express')
const router = express.Router()

const { getAllFabrics,
    getFabric,
    createFabric, 
    updateFabric, 
    deleteFabric 
} = require('../controllers/fabrics')


router.route('/').post(createFabric).get(getAllFabrics)
router.route('/:id').get(getFabric).delete(deleteFabric).patch(updateFabric)

module.exports = router