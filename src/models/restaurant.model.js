import mongoose from 'mongoose';

//schema for the restaurants collections using  mongoose
const { Schema } = mongoose;

var restaurants = new Schema({
    address: new Schema({
        building: {
            type: String
        },
        coord: [
            {
                type: Number
            }
        ],
        street: {
            type: String
        },
        zipcode: {
            type: String
        }
    }),
    borough: {
        type: String,
        required: true
    },
    cuisine: {
        type: String,
        required: true
    },
    grades: [
        new Schema({
            date: {
                type: Date,
                required: true
            },
            grade: {
                type: String,
                required: true
            },
            score: {
                type: Number,
                required: true
            }
        })
    ],
    name: {
        type: String,
        required: true
    },
    restaurant_id: {
        type: String,
        required: true
    }
});

//giving the mongoose model a name - needs to be passed a name and a schema definition
const Restaurant = mongoose.model('Restaurant', restaurants);

//exporting the Restaurant model 
export default Restaurant;