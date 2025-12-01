const mongoose = require('mongoose')
mongoose.connect("mongodb://127.0.0.1:27017/doc");
const connection = mongoose.connection

connection.on("connected", ()=>{
    console.log('MongoDB is connected')
})

connection.on("error", ()=>{
    console.log('Error in connection!')
})

module.exports = mongoose;