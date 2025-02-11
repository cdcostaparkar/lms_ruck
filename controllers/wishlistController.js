const Wishlist = require('../models//Wishlist'); 
const Course = require('../models/Course');

// Add to Wishlist
const addToWishlist = async (req, res) => {
    const { userId, courseId } = req.body; // Assuming you're sending these in the body
    try {
        const existingItem = await Wishlist.findOne({ user_id: userId, course_id: courseId });
        if (existingItem) {
            return res.status(400).json({ success: false, message: 'Item already in wishlist' });
        }

        const wishlistItem = new Wishlist({ user_id: userId, course_id: courseId });
        await wishlistItem.save();
        return res.status(201).json({ success: true, message: 'Item added to wishlist' });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// Remove from Wishlist
const removeFromWishlist = async (req, res) => {
    const { userId, courseId } = req.body; // Assuming you're sending these in the body
    try {
        const result = await Wishlist.deleteOne({ user_id: userId, course_id: courseId });
        if (result.deletedCount === 0) {
            return res.status(404).json({ success: false, message: 'Item not found in wishlist' });
        }
        return res.status(200).json({ success: true, message: 'Item removed from wishlist' });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// Get all wishlisted courses for a user
const getAllWishlistedCourses = async (req, res) => {
    const { userId } = req.params;

    try {
        // Step 1: Get all course IDs from the wishlist
        const wishlists = await Wishlist.find({
            user_id: userId
        }).select('course_id');

        const wishlistedCourseIds = wishlists.map(wishlist => wishlist.course_id);

        // Step 2: Get all courses from the wishlist
        // const wishlistedCourses = await Course.find({
        //     _id: { $in: wishlistedCourseIds },
        //     isDeleted: false // Ensure we only get non-deleted courses
        // }).populate('trainer_id', 'name'); // Populate trainer's name

        res.status(200).json(wishlistedCourseIds);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching wishlisted courses', error });
    }
};


// Admin API
// Get All Wishlists
const getAllWishlists = async (req, res) => {
    try {
        const wishlists = await Wishlist.find().populate('user_id').populate('course_id');
        return res.status(200).json({ success: true, data: wishlists });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// Delete All Wishlists
const adminDeleteAll = async (req, res) => {
    try {
        await Wishlist.deleteMany({});
        return res.status(200).json({ success: true, message: 'All wishlists have been deleted' });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// Exporting the functions
module.exports = {
    addToWishlist,
    removeFromWishlist,
    getAllWishlistedCourses,
    getAllWishlists,
    adminDeleteAll
};
