const mongoose  = require('mongoose');

const connectDB = async () => {
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log('mongoDB Connected');
    }catch(error){
        console.error('mongoDb connected failed:',  error.message);
        process.exit(1);
    }
};
module.exports = connectDB;