import bcrypt from "bcryptjs"; //used for hashing the passwords
import User from "../models/user.model.js"; //connected to the user schema and the methods in the model
import Session from "../models/session.model.js"; //used to create a session 



//creating a user session with the jwt token
const loginUser = async (email, token) => {
    try {
        //if statement to avoid null entries
        if (email != undefined && token != undefined){
        //find one and update inserts the new email and token into the session collection
        await Session.findOneAndUpdate(
            { user_id: email },
            { jwt: token },
            { new: true, upsert: true }
        );
        return { success: true }; //returns success if session is added
        } else {
            return { error: "internal error while logging in user" }
        }
    } 
    catch (error) {
        //returns the specifc error message for the error
        return { error: error.message };
    }
}

const logoutUser = async (email) => {
        try {
            //deletes the session by finding the email 
            await Session.deleteOne({ user_id: email });
            return { success: true };
        }
        catch (error) {
            console.error(`Error occurred while logging out user, ${e}`);
            return { error: error };
        }
    }

  export default class UsersController {

  //register async method using express middleware
  static async register(req, res) {

        try {
            //using bcrypt to hash the password
            const hashPassword = async password => await bcrypt.hash(password, 10);
            const userFromBody = req.body; //putting the body of the request into a const
            
            //a list of manually set errors to check the inputs
            let errors = {};
            if (userFromBody && userFromBody.name.length < 3) {
                 errors.name = "You must specify a name of at least 3 characters.";
            }                   
            if (userFromBody && userFromBody.email.length < 6) {
                 errors.email = "You must specify an email of at least 6 characters.";
            }
            if (userFromBody && userFromBody.password.length < 8) {
                 errors.password = "Your password must be at least 8 characters.";
            }  
             if (Object.keys(errors).length > 0) {
                 return res.status(400).json(errors);
            }

            //to crosscheck for trhe same email within the database
            const userFromDB = await User.findOne({"email": userFromBody.email}).exec();          
            if (userFromDB) {
                 return res.status(400).json({ message: "An account with this email already exists" });
            }    
            
            //sets the data from user body but with the hashed password as user info
            const userInfo = {
             ...userFromBody,
             password: await hashPassword(userFromBody.password),
             };
             //create new user
             const user = new User(userInfo);
             //waits for the user to save before executing more code
             await user.save();

            //responds with the auth_token and info
            res.json({
                auth_token: user.encodeToken(),
                info: user.toJson(),
            });

        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    //async login function using Express middleware 
    static async login(req, res) {
        try {
            //sets the body of the request as email and password respectively
            const { email, password } = req.body;
            //error handling for login checking format 
            if (!email || typeof email !== "string") {
                res.status(400).json({ error: "Bad email format, expected string." });
                return;
            }
            if (!password || typeof password !== "string") {
                res.status(400).json({ error: "Bad password format, expected string." });
                return;
            }
            //checking that the email exists in the database and if it doesn't throws an email is incorrect error
            //uses the mongoose findOne query to find an email equal to the inputted email
            let user = await User.findOne({ "email" : email }).exec();
            if (!user) {
                res.status(401).json({ error: "Make sure your email is correct." });
                return;
            }
            //using the password check method in user model to cross check the saved password with the entered password
            if (!(await user.passwordCheck(password))) {
                res.status(401).json({ error: "Make sure your password is correct." });
                return;
            }

            //calling the loginUser fucntion to creat the user session with the emial and encoded token 
            const loginResponse = await loginUser(email, user.encodeToken());
            if (!loginResponse.success) {
                res.status(500).json({ error: loginResponse.error });
                return;
            }
            //responds with the user info and their unique JWT token
            res.json({ auth_token: user.encodeToken(), info: user.toJson() });
        }
        catch (error) {
            res.status(500).json({ error: error.message });
            return;
        }
    }

    //async logout method
    static async logout(req, res) {
        
        try {
            //getting the token from auth section insomnia
            const token = req.get("Authorization").slice("Bearer ".length);
            //decoding the token into the users information
            const userDecode = await User.decodeToken(token);
            
            //error handler for if the token is either invalid or there is no token inputted
            if (!userDecode) {
                //401 unauthorised error
                  res.status(401).json({ Error: "Not Authorised" });
                  return;
            }
            //user remove ie remove from session 
            const userRemove = await logoutUser(userDecode.email);
            //if the logout user function fails send an error 
             if (!userRemove) {
                 res.status(400).json({ Error: "Unable to log out user" });
                 return;
             }
             //success response
             res.status(200).json({ userRemove, Message: "Successfully Logged out" });
        }
        catch (e) {
            res.status(500).json({ error: e.message });
            return;
        }
    }

    //my delete user method
    static async delete(req, res) {
      try {
           //id is set to the id in the url
            let id = req.params.id || {};
            //gets the jwt token from the authorization in the request      
            const token = req.get("Authorization").slice("Bearer ".length);
            const userAuth = await User.decodeToken(token); //decodes the token into the user info
            //sets an error array 
            var { error } = userAuth;
            if (error) {
                //returns the error if there was an auth issue
                res.status(401).json({ error });
                return;
            }
            //checking if user is an admin
            if (userAuth.role == 'admin'){
            //using mongoose method to find the use and delete them 
            const deletedUser = await User.findByIdAndDelete({_id : id});
                //manually set error messages done with send instead of json
                //send shows a webpage instead of the json string, json can be earier to read but send does the same thing
                if(deletedUser != null){
                    res.status(200).send("User deleted successfully");
                }
                else {
                    res.status(404).send("User doesn't exist");
                }
            }
            else{
                res.status(401).json('Admin role required to delete user');
            }
        } 
        catch (error) {
            //internal error message
            res.status(500).json({ error: error.message });
        }
    }

    //static async method with req and res (no need for next as there is only one middleware used)
    static async update(req, res) {
       try {
           //id is set to the id in the url
            let id = req.params.id || {};
            //gets the jwt token from the authorization in the request      
            const token = req.get("Authorization").slice("Bearer ".length);
            const userAuth = await User.decodeToken(token); //decodes the token into the user info
            //sets an error array 
            var { error } = userAuth;
            if (error) {
                //returns the error if there was an auth issue
                res.status(401).json({ error });
                return;
            }

            console.log(userAuth.role);
            // let currentUser = await User.findById(id).exec();
            
            // console.log(currentUser.role);
            //checking if currently logged in user is an admin
            if (userAuth.role == 'admin'){
            //finding the user that we want to update sending to change and geting the user info as a response 
            User.findOneAndUpdate({ _id: id}, req.body, { new: true, useFindAndModify: false }, (err, user) => {  res.json(user);
            });
            }
            else{
                //not authorised error
                  res.status(401).json({ error: "Admin role required to update user" });
            }
      
        }
        catch (e) {
            //internal error with status
           res.status(500).json({ error: e.message });

        }    
    }


    //one time updateMany method, used when I added the role field to the users table
    //gave all users the customer role 
     static async updateMany(req, res) {
       try {     
           //gets the jwt token from the authorization in the request      
            const token = req.get("Authorization").slice("Bearer ".length);
            const userAuth = await User.decodeToken(token); //decodes the token into the user info
            //sets an error array 
            var { error } = userAuth;
            if (error) {
                //returns the error if there was an auth issue
                res.status(401).json({ error });
                return;
            }
            //requestinf the role name from the body of the request
            const updateQuery = req.body.role;
            //using the updateMany with no filter to set all users with same role
            await User.updateMany({}, { $set: { role: updateQuery } });

            res.json({ success: "all users updated" })
        }
        catch (e) {
           res.status(500).json({ error: e.message });

        }    
    }


   
}