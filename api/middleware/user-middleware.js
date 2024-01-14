const Users = require('../users/users-model')

function validateUser(req,res,next){
    console.log('you have reached validate user middleware')
    const { username, password } = req.body
    if(!username || !username.trim() || !password || !password.trim()){
        res.status(400).json({
            message: `username and password required`
        })
    } else {
        next()
    }
}

async function checkForUsername (req,res,next){
    console.log('you have reached checkforusername middleware')
    const { username } = req.body
    const  [userToSearch] = await Users.findBy({ username })

    if(userToSearch){
        res.status(400).json({message: `username taken`})
    } else {
        next()
    }
}

async function checkIfUserExists(req,res,next){
    console.log('you have reached checkifuserexists middleware')
    const { username } = req.body
    const [searchUser] = await Users.findBy({ username })
    if(!searchUser){
        next({ status: 401 , message: `check for existing user: invalid credentials`})
    } else {
        next()
    }
}

module.exports = {
    validateUser,
    checkForUsername,
    checkIfUserExists
}