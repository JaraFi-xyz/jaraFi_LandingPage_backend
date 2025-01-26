
const express = require('express')
require("dotenv").config()
const cors = require('cors')
const { corsOptions } = require('./config/cors')
const connectDB = require('./config/mongodb')
const errorHandler  = require('./middlewares/errorHandlingMiddleware')
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
const cookieParser = require("cookie-parser")
const waitlistUserRoute =  require("./routes/waitlist_user")



const app = express()
const PORT = process.env.PORT || 3500;
const author = process.env.AUTHOR;
const host = process.env.LOCAL_DEV_APP_HOST

app.use(cors(corsOptions))
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get('/', (req, res) => {
  res.send("You are welcome jaraFi landing page backend")
})

app.use('/waitlist', waitlistUserRoute)

console.log('1. Connecting to MongoDB Cloud Atlas...')
connectDB()

app.use(errorHandler)


mongoose.connection.once("open", () => {
  console.log("Database Connected");

 if (process.env.BUILD_MODE === 'production') {
  
  app.listen(process.env.PORT, () => {
      console.log(`2. Production: Hi ${process.env.AUTHOR}, Back-end Server is running successfully at Port: ${process.env.PORT}`)
    })
  } else {
    app.listen(PORT, () => {
      console.log(`2. Local DEV: Hi ${author}, Back-end Server is running successfully at Host: ${host} and Port: ${PORT}`)
    })
  }
})



