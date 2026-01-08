const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

// 1. Register & Login
router.post('/register', authController.register);
router.post('/login', authController.login);

// 2. GET ALL USERS (This was missing! Fixes Admin "Loading...")
router.get('/users', authMiddleware, authController.getAllUsers);

// 3. DELETE USER
router.delete('/users/:id', authMiddleware, authController.deleteUser);



// Inside your route handler (e.g., authRoutes.js)
router.delete('/users/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const db = await connectDB();
        await db.run("DELETE FROM users WHERE id = ?", [id]); // This is the command
        res.json({ message: "User deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
