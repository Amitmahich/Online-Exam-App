const authorizeRoles = (allowedRoles) => {
  return (req, res, next) => {
    try {
      //check if user found or not
      if (!req.user) {
        return res.status(401).send({
          success: false,
          message: "Unauthorized:User not authenticated!",
        });
      }
      const Role = req.user.role;
      //role exist or not in token
      if (!Role) {
        return res.status(400).send({
          success: false,
          message: "User role is not found in token!",
        });
      }
      //check if role exist in allowed roles
      if (!allowedRoles.includes(Role)) {
        return res.status(403).send({
          success: false,
          message: `Access denied.Required roles-${allowedRoles}`,
        });
      }
      // if everything is fine
      next();
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "Error in Role authorization",
        error,
      });
    }
  };
};
module.exports = authorizeRoles;
