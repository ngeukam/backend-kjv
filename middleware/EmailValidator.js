const emailValidator = (req, res, next) => {
    const { email } = req.body;
  
    // Regular expression for validating an Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
    if (!email || !emailRegex.test(email)) {
      return res.status(400).json({ message: 'Email is invalid.' });
    }
  
    next(); // If valid, proceed to the next middleware or route handler
  };
  
  module.exports = emailValidator;
  