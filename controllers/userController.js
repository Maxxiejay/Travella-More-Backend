const userModel = require('../models/userModel'); // adjust path if needed

exports.getAllUsers = async (req, res) => {
  try {
    const users = await userModel.getAllUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch users', error });
  }
};

exports.updateUser = async (req, res) => {
  const { id } = req.params;
  try {
    const updated = await userModel.updateUser(id, req.body);
    if (!updated) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User updated', user: updated });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update user', error });
  }
};

exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await userModel.deleteUser(id);
    if (!deleted) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete user', error });
  }
};