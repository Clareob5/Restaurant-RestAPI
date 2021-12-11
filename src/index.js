import dotenv from 'dotenv'; //importing the environment variables
import mongoose from 'mongoose';

import app from "./server.js"; //importing express app from the server.js 

dotenv.config();

//const PORT pointing to our env where define port, variable needed for online hosting or localhosting
const port = process.env.PORT;
//cosnt dbURI points to the link to connect to mongoDB
const dbUri = process.env.DB_URI;

try {

     //listening on the set port
    app.listen(port, () => {
        console.log(`listening on port ${port}`)
    });

    // await for connecting to mongoose to connect to mongoDB with the db I am using
    await mongoose.connect(dbUri, {
        'dbName' : 'sample_restaurants'
    }); 
   
}
catch(error) {
    console.error(error.stack);
    process.exit(1);
}

