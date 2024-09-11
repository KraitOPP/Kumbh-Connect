const router = require('express').Router();
const {isAuthenticated, isAdmin} = require('../Middlewares/auth');
const {
    handleAddItem, 
    handleUpdateItem, 
    handleUpdateItemStatus, 
    handleDeleteItem,
    handleGetItems,
    handleGetItemsByCategory,
    handleGetItemsOfACategory
} = require("../Controllers/item");


router.get('/', handleGetItems);
router.get('/category', handleGetItemsByCategory);
router.get('/category/:id', handleGetItemsOfACategory);
router.post('/', isAuthenticated, isAdmin, handleAddItem);
router.put('/status/:id', isAuthenticated, isAdmin, handleUpdateItemStatus);
router.put('/:id', isAuthenticated, isAdmin, handleUpdateItem);
router.delete('/:id', isAuthenticated, isAdmin, handleDeleteItem);

module.exports = router;