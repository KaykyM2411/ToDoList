const jwt = require('jsonwebtoken');

const secretKey = process.env.JWT_SECRET;

const authMiddleware = (req, res, next) => {
  const tokenHeader = req.header('Authorization');

  if (!tokenHeader) {
    return res.status(401).json({ message: 'Acesso negado. Token não fornecido.' });
  }

  const token = tokenHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, secretKey);

    // Alinhar com o payload do token
    req.userId = decoded.userId; // ✅ aqui era decoded.userId antes

    next();
  } catch (error) {
    res.status(401).json({ message: 'Token inválido.' });
  }
};

module.exports = authMiddleware;
