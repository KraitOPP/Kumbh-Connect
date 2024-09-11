const router = require("express").Router();
const {handleGetProfile, handleUpdateUser} = require("../Controllers/user");
const {isAuthenticated} = require("../Middlewares/auth");


router.get('/',isAuthenticated, handleGetProfile);
router.put('/',isAuthenticated, handleUpdateUser);

module.exports = router;