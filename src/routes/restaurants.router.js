import { Router } from 'express'; //import router from express
import RestaurantsController from '../controllers/restaurants.controller.js';

const router = Router();

//router HTTP requests, accessing the controller methods 
router.get("/", RestaurantsController.getRestaurants);
router.get("/coords", RestaurantsController.getRestaurantsCoords);
router.get("/:id", RestaurantsController.getRestaurantbyid);
router.post("/", RestaurantsController.createRestaurant);
router.put("/:id", RestaurantsController.updateRestaurant);
router.delete("/:id", RestaurantsController.deleteRestaurant);

export default router;