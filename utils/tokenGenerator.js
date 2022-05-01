const generateToken = (length) => {
  const NUMBERS = '0123456789';
  const LOWER = 'abcdefghijklmnopqrstuvwxyz';
  const UPPER = LOWER.toUpperCase();
  const SYMBOLS = '!@#$%*(.)+-{><}';
  const charsOfAll = LOWER + NUMBERS + SYMBOLS + UPPER;
  let password = '';
  const charLength = charsOfAll.length;
  while (password.length < length) {
    password += charsOfAll[Math.floor(Math.random() * charLength)];
  }
  return password;
};

module.exports = generateToken;
