const router = require("express").Router();
const {handleGetProfile, handleUpdateUser, handleGetUsers} = require("../Controllers/user");
const {isAuthenticated, isAdmin} = require("../Middlewares/auth");


router.get('/all',isAuthenticated,isAdmin, handleGetUsers);
router.get('/',isAuthenticated, handleGetProfile);
router.put('/',isAuthenticated, handleUpdateUser);

module.exports = router;