const db = require('../../data/dbConfig')

function find(){
    return db('users')
}

function findBy(filter) {
    return db('users')
        .where(filter)
}

function findById(id) {
    return db('users')
        .where('id',id)
}

async function add({username, password}){
    const [id] = await db('users').insert({username, password})
    return await findById(id).first()
}

module.exports = {
    find,
    findBy,
    findById,
    add
}