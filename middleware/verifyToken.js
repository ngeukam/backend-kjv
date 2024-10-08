require('dotenv').config();
// Middleware to verify token
const verifyToken = (req, res, next) => {
	const token = req.header("Authorization");
	if (!token) return res.status(401).json({ message: "Accès refusé." });

	jwt.verify(token.split(" ")[1], process.env.JWT_SECRET, (err, decoded) => {
		if (err) return res.status(403).json({ message: "Token invalide." });
		req.userId = decoded.userId;
		next();
	});
};
module.exports = verifyToken;