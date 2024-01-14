const router = require('express').Router();
const { validateUser, checkForUsername, checkIfUserExists } = require('../middleware/user-middleware')
const bcrypt = require('bcryptjs')
const Users = require('../users/users-model')
const jwt = require('jsonwebtoken')
const { JWT_SECRET } = require('../secrets/index')


router.post('/register', validateUser, checkForUsername, async (req, res, next) => {
  
  const { username, password } = req.body
  const  hash  = bcrypt.hashSync(password,8)
  // Users.add({username, password: hash})
  //   .then(saved => {
  //     console.log(saved)
  //     res.status(201).json(saved)
  //   })
  //   .catch(next)
  console.log(password, hash)
    const addUser = {username, password: hash}
    Users.add(addUser)
        .then(user => {
          console.log(user)
            res.status(201).json(user)
        })
        .catch(next)
  // try {
  //   const { username, password } = req.body
  //   const { hash } = bcrypt.hashSync(password, 8)
  //   //const newUser = { username, password: hash }
  //   const result = await Users.add({ username, password: hash })
  //   console.log(result)
  //   res.status(200).json(result)
  // } catch(err){
  //   next(err)
  // }


  // res.end('implement register, please!');
  /*
    IMPLEMENT
    You are welcome to build additional middlewares to help with the endpoint's functionality.
    DO NOT EXCEED 2^8 ROUNDS OF HASHING!

    1- In order to register a new account the client must provide `username` and `password`:
      {
        "username": "Captain Marvel", // must not exist already in the `users` table
        "password": "foobar"          // needs to be hashed before it's saved
      }

  X  2- On SUCCESSFUL registration,
      the response body should have `id`, `username` and `password`:
      {
        "id": 1,
        "username": "Captain Marvel",
        "password": "2a$08$jG.wIGR2S4hxuyWNcBf9MuoC4y0dNy7qC/LbmtuFBSdIhWks2LhpG"
      }

   X 3- On FAILED registration due to `username` or `password` missing from the request body,
      the response body should include a string exactly as follows: "username and password required".

   X 4- On FAILED registration due to the `username` being taken,
      the response body should include a string exactly as follows: "username taken".
  */

});

function buildToken(user){
  const payload = {
    subject: user.id,
    username: user.username
  }
  const options = {
    expiresIn: '1d'
  } 
  return jwt.sign(payload,JWT_SECRET,options)
}

router.post('/login', validateUser, checkIfUserExists, async (req, res, next) => {
  //res.end('implement login, please!');
  /*
    IMPLEMENT
    You are welcome to build additional middlewares to help with the endpoint's functionality.

   X 1- In order to log into an existing account the client must provide `username` and `password`:
      {
        "username": "Captain Marvel",
        "password": "foobar"
      }

   X 2- On SUCCESSFUL login,
      the response body should have `message` and `token`:
      {
        "message": "welcome, Captain Marvel",
        "token": "eyJhbGciOiJIUzI ... ETC ... vUPjZYDSa46Nwz8"
      }

   X 3- On FAILED login due to `username` or `password` missing from the request body,
      the response body should include a string exactly as follows: "username and password required".

    TO DO : 4- On FAILED login due to `username` not existing in the db, or `password` being incorrect,
      the response body should include a string exactly as follows: "invalid credentials".
  */
 let { username, password } = req.body
 Users.findBy({ username })
      .then(([user]) => {
        if( user && bcrypt.compareSync(password,  user.password)) {
          const token = buildToken(user)
          console.log('token: ' , token)
          res.status(200).json({ message: `welcome, ${username}`, token})
        } else {
          console.log('router: invalid credentials')
          next({ status: 401, message: 'invalid credentials' })
        }
      })
      .catch(err=>{
        console.log(err)
        next(err)
      })
});


module.exports = router;
