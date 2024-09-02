const mongoose = require('mongoose');

const connectDB = (MONGO_URI) => {
  mongoose.connect(MONGO_URI || 'mongodb://mongodb:27017/test_assesment', { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
  })
    .then(() => console.log("MongoDB conectado correctamente"))
    .catch(err => console.error("Error conectando a MongoDB:", err));
};

module.exports = { connectDB };

