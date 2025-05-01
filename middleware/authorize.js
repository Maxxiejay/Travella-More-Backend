module.exports = function authorizeRoles(...allowedRoles) {
  return (req, res, next) => {
    const userRole = req.user?.role;
    console.log('User role:', userRole); // Log the role to check if it's "admin"
    
    if (!userRole || !allowedRoles.includes(userRole)) {
      return res.status(403).json({ message: 'Access denied: insufficient permissions' });
    }
    
    next();
  };
};