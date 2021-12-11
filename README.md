# Node.js Express and Mongoose application

This applicaiton was created as part of a CA to create a REST API. A prequisite to run thsi applciaotn is to have a MongoDB account, so you can import the collections the  

To use this application first clone the repository onto your machine.

Next go into the cloned repository and from there run the following in the command line or Git Bash

```bash
npm ci 
```
After this change the example.env to .env and cconnect to your MongoDN Cluster by going onto mongo and selecting the connect vu=ia applicaion option.
If you are using the sample_restaurants database, import the collections from the sample_restaurants folder as I have alsterd the basic layout of the database.

You will need to generate a secret key to put in the .env file this can be done on the command line.

After that to import the collections as I mentioned you will need mongoDBCompass and once you are in the database there is an option to import documents. 

Onc eall that is done just run the below command and everything should run

```bash
npm run server
```
I recommend downloading insomnia for testing the API.
