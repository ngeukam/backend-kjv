require('dotenv').config();
const jwt = require('jsonwebtoken'); // Utilisez jwt si vous utilisez des tokens JWT
// Middleware pour vérifier si l'utilisateur est admin
const adminMiddleware = (req, res, next) => {
  // Vérifiez si le token est présent dans les en-têtes d'autorisation
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(401).json({ message: "Accès non autorisé, aucun token fourni" });
  }

  // Vérifiez et décodez le token
  jwt.verify(token.split(" ")[1], process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Token invalide ou expiré" });
    }
    
    // Vérifiez le rôle de l'utilisateur dans le token décodé
    if (decoded.role !== 'admin') {
      return res.status(403).json({ message: "Accès refusé, vous n'êtes pas un admin" });
    }
    // Si l'utilisateur est admin, passer au middleware suivant
    req.userId = decoded.userId;
    next();
  });
};

module.exports = adminMiddleware;
