const mongoose = require('mongoose');
const productionDB = process.env.MONGODB_URI;
const developmentDB = process.env.DEV_MONGODB_URI;

const connectDb = async () => {
    try {
        await mongoose.connect(developmentDB, {
            useNewUrlParser: true,
            useCreateIndex: true,
            useFindAndModify: false,
            useUnifiedTopology: true
        });
        console.log('Database has been penetrated!');
    } catch (err) {
        console.error(err.message);
        console.log('DB Error');
        process.exit(1);
    }
};

module.exports = connectDb;