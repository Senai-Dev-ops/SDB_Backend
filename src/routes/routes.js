const { Router } = require("express");

const router = Router();

const UserController = require("../controller/UserController");
const MaquinaController = require("../controller/MaquinaController");
const { validateToken } = require("../middlewares/middlewares");

//Machine Methods
router.get("/maquina-list", MaquinaController.maquinaList);

//Users Methods
router.get("/user-list", UserController.userList);
router.post("/user-create", validateToken, UserController.createUser);
router.patch("/user-update/:requesting_user/:id",validateToken,UserController.updateUser);
router.delete("/delete-user/:requesting_user/:id",validateToken,UserController.deleteUser);

//Login Methods
router.post("/login", UserController.userAuth);
router.get("/auth", validateToken, UserController.validToken);

module.exports = router;