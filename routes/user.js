const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/auth');
const authorizeRoles = require('../middleware/authorize');

// All routes require authentication and admin access
router.use(authMiddleware, authorizeRoles('admin'));

router.get('/', userController.getAllUsers);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

module.exports = router;