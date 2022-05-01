const authMiddleware = (req, res, next) => {
  // const { Authorization } = req.headers;
  const authorization = req.headers ? req.headers.authorization : false;
  if (!authorization) {
    return res.status(401).json({
      message: 'Token não encontrado',
    });
  }
  // const { token } = authorization;
  const token = authorization;
  if (token.length !== 16) {
    return res.status(401).json({
      message: 'Token inválido',
    });
  }
  next();
};

module.exports = authMiddleware;
