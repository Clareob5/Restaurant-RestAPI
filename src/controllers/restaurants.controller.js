import Restaurant from '../models/restaurant.model.js' 
import User from "../models/user.model.js";

export default class RestaurantsController {
    //async method for retreiving all restaurants 
    static async getRestaurants(req, res) {

        const each_page= 20;
        //getting all restaurants but haveing a page limit 
        const restaurantsList = await Restaurant.find({}).limit(each_page).exec();
        //reponse with filters
        let response = {
            restaurants: restaurantsList,
            page: 0,
            entries_per_page: each_page
        }
        res.json(response);
  
}
    //get restaurant by id 
    static async getRestaurantbyid(req, res) {
         try {
            //get the id from the url
            let id = req.params.id || {};
            //using mongoose model find the respective restaurant
            let restaurant = await Restaurant.findById(id).exec();
            //return a not found error if id doesnt exist
            if (!restaurant) {
                res.status(404).json({ error: "Not found" });
                return;
            }
            res.status(200).json({ restaurant });
        } 
        catch (e){
        res.status(500).json({ error: e.message })

        }
    }

    //creating a restuarant 
    static async createRestaurant(req, res) {

        try {
            //check to see if user is authenticated
            const token = req.get("Authorization").slice("Bearer ".length);
            const user = await User.decodeToken(token);
            //returns not authorised if not 
            let { error } = user;
            if (error) {
                res.status(401).json({ error });
                return;
            }

            //placing the body of the request into a const
            const restaurantData = req.body;
            //creating new restuarant by accessing the model which inputs it to the database
            const restaurant = new Restaurant(restaurantData);
            await restaurant.save();
            
            res.json({ Status: "success", restaurant });
        } 
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    //update restaurant method
    static async updateRestaurant(req, res, next) {
       try {
            let id = req.params.id || {};
            const token = req.get("Authorization").slice("Bearer ".length);
            const user = await User.decodeToken(token);
            var { error } = user;
            if (error) {
                console.log('running if error')
                res.status(401).json({ error });
                return;
            }

            Restaurant.findOneAndUpdate({ _id: id}, req.body, { new: true, useFindAndModify: false }, (err, restaurant) => {
                res.json(restaurant);
                });
        }
        catch (e) {
           res.status(500).json({ error: e.message });

        }    
    }

    //static delete restaurant method 
    static async deleteRestaurant(req, res) {
        try {
            const token = req.get("Authorization").slice("Bearer ".length);
            const user = await User.decodeToken(token);
            var { error } = user;
            if (error) {
                res.status(401).json({ error });
                return;
            }
            //the id in the url will be used fr the request
            let id = req.params.id || {};
            await Restaurant.findByIdAndDelete({_id: id});           
            res.status(200).json({ success: "Restaurent is deleted" })
    
        }
        catch (e) {
            res.status(500).json({ error: e.message });
        }
       
}

}