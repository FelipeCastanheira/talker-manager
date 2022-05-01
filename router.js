const express = require('express');
const fs = require('fs').promises;
const generateToken = require('./utils/tokenGenerator');
const emailValidation = require('./middlewares/emailValidation');
const pwValidation = require('./middlewares/pwValidation');
const authMiddleware = require('./middlewares/authHandler');
const bodyValidation = require('./middlewares/bodyValidation');

const router = express.Router();

const jsonFilePath = './talker.json';

router.get('/talker', async (_req, res, next) => {
  try {
    const data = await fs.readFile(jsonFilePath, 'utf-8');
    return res.status(200).json(JSON.parse(data));
  } catch (error) {
    next(error);
  }
});

router.get('/talker/search', authMiddleware, async (req, res, next) => {
  try {
    const data = await fs.readFile(jsonFilePath, 'utf-8');
    const { q } = req.query;
    const talkersList = JSON.parse(data);
    const talkers = talkersList.filter(({ name }) => name.includes(q));
    if (talkers && talkers.length) {
      return res.status(200).json(talkers);
    }
    return res.status(200).json([]);
  } catch (error) {
    next(error);
  }
});

router.get('/talker/:id', async (req, res, next) => {
  try {
    const data = await fs.readFile(jsonFilePath, 'utf-8');
    const id = +req.params.id;
    const talkersList = JSON.parse(data);
    const talker = talkersList.find((person) => person.id === id);
    if (talker) {
      return res.status(200).json(talker);
    }
    return res.status(404).json({
      message: 'Pessoa palestrante não encontrada',
    });
  } catch (error) {
    next(error);
  }
});

router.post('/login', emailValidation, pwValidation, (req, res) =>
  res.status(200).json({ token: generateToken(16) }));

router.post('/talker', authMiddleware, bodyValidation, async (req, res, next) => {
  try {
    const data = await fs.readFile(jsonFilePath, 'utf-8');
    const { name, age, talk } = req.body;
    const talkersList = JSON.parse(data);
    const id = talkersList.length + 1;
    const talkerInfo = { id, name, age, talk };
    talkersList.push(talkerInfo);
    await fs.writeFile(jsonFilePath, JSON.stringify(talkersList));
    return res.status(201).json(talkerInfo);
  } catch (error) {
    next(error);
  }
});

router.put('/talker/:id', authMiddleware, bodyValidation, async (req, res, next) => {
  try {
    const data = await fs.readFile(jsonFilePath, 'utf-8');
    const { name, age, talk } = req.body;
    const id = +req.params.id;
    const talkersList = JSON.parse(data);
    const talkerIndex = talkersList.findIndex((person) => person.id === id);
    if (talkerIndex >= 0) {
      const talkerInfo = { id, name, age, talk };
      talkersList[talkerIndex] = talkerInfo;
      await fs.writeFile(jsonFilePath, JSON.stringify(talkersList));
      return res.status(200).json(talkerInfo);
    }
    return res.status(404).json({
      message: 'Pessoa palestrante não encontrada',
    });
  } catch (error) {
    next(error);
  }
});

router.delete('/talker/:id', authMiddleware, async (req, res, next) => {
  try {
    const data = await fs.readFile(jsonFilePath, 'utf-8');
    const id = +req.params.id;
    const talkersList = JSON.parse(data);
    const talkerIndex = talkersList.findIndex((person) => person.id === id);
    if (talkerIndex >= 0) {
      talkersList.splice(talkerIndex, 1);
      await fs.writeFile(jsonFilePath, JSON.stringify(talkersList));
      return res.status(204).end();
    }
    return res.status(404).json({
      message: 'Pessoa palestrante não encontrada',
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
