// wishlistRoutes.js

const express = require('express');
const router = express.Router();
const {
    addToWishlist,
    removeFromWishlist,
    getAllWishlistedCourses,
    getAllWishlists,
    adminDeleteAll
} = require('../controllers/wishlistController'); // Adjust the path as necessary

// Route to add an item to the wishlist
router.post('/add', addToWishlist);

// Route to remove an item from the wishlist
router.delete('/remove', removeFromWishlist);

router.delete('/adminDeleteAll', adminDeleteAll);

router.get('/getAllWishlistedCourses/:userId', getAllWishlistedCourses);

// Route to get all wishlists(Admin APIs)
router.get('/getAllWishlists', getAllWishlists);

module.exports = router;
