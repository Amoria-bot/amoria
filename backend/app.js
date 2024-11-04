require('dotenv').config();

const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Добро пожаловать в Amoria API!');
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});

const jwt = require('jsonwebtoken');

// Маршрут для тестовой генерации токена
app.get('/token', (req, res) => {
    const payload = { userId: 1 }; // простой пример полезной нагрузки
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  });

  const sequelize = require('./models/index');
const User = require('./models/User');

async function syncDatabase() {
  try {
    await sequelize.authenticate();
    console.log('Соединение с базой данных установлено успешно.');

    await sequelize.sync();
    console.log('Синхронизация модели User завершена.');
  } catch (error) {
    console.error('Ошибка при синхронизации базы данных:', error);
  }
}

syncDatabase();
