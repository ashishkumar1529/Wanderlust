const mongoose = require('mongoose');
const initData = require('./data.js');
const Listing = require('../models/listings.js');

const MONGO_URL = Public.env.ATLASDB_TOKEN;

async function main() {
    await mongoose.connect(MONGO_URL);
}

main()
.then(() => {
    console.log("Connected to DB")
}).catch(err => 
    console.log( err));


const initDB = async () => {
     await Listing.deleteMany({});

    // initData.data = initData.data.map((obj) => ({...obj,
    //      owner: new ObjectId("6a2bb501578d4b3579d6ddce"),
    //     }));
    // await Listing.insertMany(initData.data);
    const dataWithOwner = initData.data.map((obj) => ({
        ...obj,
        owner: new mongoose.Types.ObjectId("6a34280e90b5f7a8497fadb1")
    }));

    await Listing.insertMany(dataWithOwner);
    console.log("Database initialized.");
 };
initDB();