const mongoose = require("mongoose");
const Service = require("../models/Services.model.js");

// Connecting to MongodDB
// Get the address of connection from Environment variable or use the default one
// Heroku is configured to inject DB_CONNECTION automatically
// https://dashboard.heroku.com/apps/btrack-wm/settings -> Reveaul Configs Vars
const DB_NAME = "btrack";
mongoose.connect(process.env.DB_CONNECTION || `mongodb://localhost/${DB_NAME}`, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true 
})
.then(() => {
    console.log("is connected")
})
.catch(err => console.log("DB is not connected") )
const services=[
  {
  name:'service IT',
  phone:'01.06.44.66.34',
  email: 'service.it@service.com'
},
{
  name:'service RH',
  phone:'01.06.44.77.88',
  email: 'service.rh@service.com'
},
{
  name:'service Com',
  phone:'01.06.44.88.99',
  email: 'service.com@service.com'
}]
Service.create(services)
   .then((servicesFromDB) => {
     console.log(`services: ${servicesFromDB}`)
     mongoose.connection.close()
   })
   .catch(err => console.log(`oops ${err}`))
