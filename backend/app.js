// app.js
require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');
const { sequelize, User, Subscription, Transaction, Chat, Message, TapGameProgress, FortuneWheelProgress, AmocoinBalance, AmocoinTransaction } = require('./models/index');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware для обработки JSON
app.use(express.json());

// Импортируем маршруты
const userRoutes = require('./routes/userRoutes');
const subscriptionRoutes = require('./routes/subscriptionRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const chatRoutes = require('./routes/chatRoutes');
const messageRoutes = require('./routes/messageRoutes');
const tapGameProgressRoutes = require('./routes/tapGameRoutes');
const fortuneWheelRoutes = require('./routes/fortuneWheelRoutes');
const amocoinBalanceRoutes = require('./routes/amocoinBalanceRoutes');
const amocoinTransactionRoutes = require('./routes/amocoinTransactionRoutes'); // Импортируем маршруты для AmocoinTransaction
const botTestRoutes = require('./routes/botTest'); // Новый маршрут для проверки подписки
const telegramWebhookRoutes = require('./routes/telegramWebhook'); // Маршрут для webhook Telegram

// Подключаем маршруты
app.use('/api', userRoutes);
app.use('/api', subscriptionRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/chats', chatRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/tapgame', tapGameProgressRoutes);
app.use('/api/fortune-wheel', fortuneWheelRoutes);
app.use('/api/amocoin-balance', amocoinBalanceRoutes);
app.use('/api', amocoinTransactionRoutes); // Обновленный путь для AmocoinTransaction
app.use('/api', botTestRoutes); // Подключаем маршрут botTest для проверки подписки
app.use('/api', telegramWebhookRoutes); // Подключаем маршрут для обработки webhook Telegram

// Маршрут приветствия
app.get('/', (req, res) => {
  res.send('Добро пожаловать в Amoria API!');
});

// Маршрут для тестовой генерации токена
app.get('/token', (req, res) => {
  const payload = { userId: 1 };
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.json({ token });
});

// Функция для синхронизации базы данных
async function syncDatabase() {
  try {
    await sequelize.authenticate();
    console.log('Соединение с базой данных установлено успешно.');
    await sequelize.sync({ alter: true });
    console.log('Синхронизация всех моделей завершена.');
  } catch (error) {
    console.error('Ошибка при синхронизации базы данных:', error);
  }
}

// Запускаем синхронизацию базы данных
syncDatabase();

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});

module.exports = app;
