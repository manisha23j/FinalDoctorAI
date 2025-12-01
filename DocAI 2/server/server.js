const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()

const dbConfig = require('./config/dbConfig')
app.use(express.json());
app.use(cors())
const userRoute = require("./routes/userRoute")
const adminRoute = require("./routes/adminRoute")
const doctorRoute = require("./routes/doctorRoute")
const messageRoute = require("./routes/messageRoute")
const path = require("path");
app.use('/api/user', userRoute);
app.use('/api/admin', adminRoute)
app.use('/api/doctor', doctorRoute);
app.use('/api/message', messageRoute);
const port = process.env.PORT || 5001


app.get("/", (req,res)=>{
    res.json("Server");
});

app.listen(port, () => console.log(`listening on port ${port}`));
