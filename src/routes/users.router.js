import { Router } from 'express'; //importing a router form express
import UsersController from '../controllers/users.controller.js'; //importing users controller to connect the routes their respective methods

//setting router as the express router
const router = Router();

//router urls for the user methods
router.get("/logout", UsersController.logout);
router.get("/", UsersController.getUsers);
router.get("/:id", UsersController.getUserById);
router.post("/register", UsersController.register);
router.post("/login", UsersController.login);
router.delete("/:id", UsersController.delete);
router.put("/:id", UsersController.update);
router.put("/", UsersController.updateMany);

//exporting the routes
export default router;