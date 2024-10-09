const mongoose = require('mongoose')

function connectdb(){

    mongoose.connect(process.env.MONGO_URI,{
        useNewUrlParser: true,
        useUnifiedTopology: true
      })
      .then(()=>{
        console.log('mongo db connected')
      })
      .catch((error)=>{
        console.log('mongo db not connected',error)
      }
    
      
      )


  }

  module.exports = connectdb