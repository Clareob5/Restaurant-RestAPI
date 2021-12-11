//import mongoose for mongoose schema
import mongoose from 'mongoose';
import bcrypt from "bcryptjs"; //password encryption
import jwt from "jsonwebtoken"; //for  our JWT web token

const { Schema } = mongoose;

//created mongoose schema for users
const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
    },
    preferences: {
        type: Schema.Types.Mixed
    }
});

//the model static method this decodes the auth_token into the .Json format in the method below 
//will send an error if token has expired or invalid for any other reason
userSchema.statics.decodeToken = async function (userJwt) {
    return jwt.verify(userJwt, process.env.SECRET_KEY, (error, res) => {
        if (error) {
            return { error };
        }
        return res;
    });
};
//to encode the auth_token for a user 
userSchema.methods.encodeToken = function () {
    return jwt.sign(
        {
            //sets the expiration of the auth_token
            exp: Math.floor(Date.now() / 1000) + 60 * 60 * 4,
            ...this.toJson(), //payload part of the key 
        },
        process.env.SECRET_KEY //the secret key
    );
};

//used to verify that the password entered is the same as the saved encrypted password
userSchema.methods.passwordCheck = async function(password) {
    return await bcrypt.compare(password, this.password);
};

//returns the chosen user information in json format 
userSchema.methods.toJson = function() {
    return { name: this.name, email: this.email, role: this.role, preferences: this.preferences };
};

//User for the user model
const User = mongoose.model('User', userSchema);
//exporting user model
export default User;