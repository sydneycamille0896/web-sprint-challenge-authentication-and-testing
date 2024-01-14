const router = require('express').Router()
const Users = require('./users-model')

router.get('/', async (req,res,next) => {
    Users.find()
        .then(users => {
            res.status(200).json(users)
        })
        .catch(next)
 }
)

router.get('/:id', async (req,res,next) => {
    Users.findById(req.params.id)
        .then(user => {
            res.json(user)
        })
        .catch(next)
})

router.post('/', async (req,res,next) => {
    Users.add(req.body)
        .then(user => {
            res.status(201).json(user)
        })
        .catch(next)
})  

module.exports = router