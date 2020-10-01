const mongoose = require("mongoose");
const Service = require("../models/Services.model.js");


const DB_NAME = "btrack";
mongoose.connect(`mongodb://localhost/${DB_NAME}`, {
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
