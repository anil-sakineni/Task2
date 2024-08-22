const mongoose = require('mongoose')
const dotenv = require('dotenv')

dotenv.config()

const connectDB = async () => {
    mongoose.connect(process.env.Mongo_URI)

    const db = mongoose.connection;

    db.once('error', () => {
        console.log('mongo db connection error');

    })

    db.on('open', () => {
        console.log('connected to data base');

    })
}

module.exports = connectDB
