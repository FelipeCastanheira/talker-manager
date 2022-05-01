const pwValidation = (req, res, next) => {
  const { password } = req.body;
  if (!password) {
    return res.status(400).json({ message: 'O campo "password" é obrigatório' });
  }
  const minPasswordLength = 6;
  const isPasswordValid = password.length >= minPasswordLength;
  if (!isPasswordValid) {
    return res.status(400).json({ message: 'O "password" deve ter pelo menos 6 caracteres' });
  }
  next();
};

module.exports = pwValidation;
