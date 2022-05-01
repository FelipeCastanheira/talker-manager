const isNameValid = (name) => name.length >= 3;
const isAgeValid = (age) => Number(age) >= 18;
const isRateValid = (rate) => {
  const rateNum = Number(rate);
  if (rateNum % 1) {
    return false;
  }
  const isValid = rateNum >= 1 && rateNum <= 5;
  return isValid;
};
const isWatchedAtValid = (watchedAt) => {
  const [day, month, year] = watchedAt.split('/');
  if ([day, month, year].every((info) => info)) {
    const isAllCorrect = day.length === 2
      && month.length === 2
      && year.length === 4;
    return isAllCorrect;
  }
  return false;
};

const isBodyVallid = (name, age, { rate, watchedAt }) =>
  isNameValid(name) && isAgeValid(age) && isRateValid(rate) && isWatchedAtValid(watchedAt);

const getMessage = (name, age, { rate }) => {
  if (!isNameValid(name)) {
    const res = { message: 'O "name" deve ter pelo menos 3 caracteres' };
    return res;
  }
  if (!isAgeValid(age)) {
    const res = { message: 'A pessoa palestrante deve ser maior de idade' };
    return res;
  }
  if (!isRateValid(rate)) {
    const res = { message: 'O campo "rate" deve ser um inteiro de 1 à 5' };
    return res;
  }
  const res = { message: 'O campo "watchedAt" deve ter o formato "dd/mm/aaaa"' };
  return res;
};

const getMissingMessage = (name, age) => {
  if (!name) {
    const res = { message: 'O campo "name" é obrigatório' };
    return res;
  }
  if (!age) {
    const res = { message: 'O campo "age" é obrigatório' };
    return res;
  }
  const res = {
    message: 'O campo "talk" é obrigatório e "watchedAt" e "rate" não podem ser vazios',
  };
  return res;
};

const rateExists = (rate) => rate || rate === 0;
const hasAllProps = (name, age, talk) => {
  if (talk) {
    const { watchedAt, rate } = talk;
    return name && age && watchedAt && rateExists(rate);
  }
  return false;
};

const bodyValidation = (req, res, next) => {
  const { name, age, talk } = req.body;
  if (hasAllProps(name, age, talk)) {
    if (isBodyVallid(name, age, talk)) {
      return next();
    }
    return res.status(400).json(getMessage(name, age, talk));
  }
  return res.status(400).json(getMissingMessage(name, age));
};

module.exports = bodyValidation;
