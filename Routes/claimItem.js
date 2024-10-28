const router = require('express').Router();
const {isAuthenticated, isAdmin} = require('../Middlewares/auth');
const {
    handleGetClaims,
    handleClaimItem,
    handleClaimVerification,
    handleUserClaims
} = require("../Controllers/claimItem");


router.get('/',isAuthenticated, isAdmin, handleGetClaims);
router.get('/u/', isAuthenticated, handleUserClaims);
router.post('/', isAuthenticated, handleClaimItem);
router.put('/verify',isAuthenticated, isAdmin, handleClaimVerification);

module.exports = router;