const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        
    },
    phone: {
        type: String,
        required: true,
        
    },
    emergencyContacts: [
    {
       name:{ type: String },
       phone: { type: String},
       relation: { type: String },
       
    },
],
  currentLocation: {
    lat: {type: Number},
    lng:  {type: Number},
    updateAt :{ type: Date },
  } ,
  
},{ timestamps: true});

module.exports = mongoose.model('User', userSchema);
