// app.js
require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');
const { sequelize, User, Subscription, Transaction, Chat, Message, TapGameProgress, FortuneWheelProgress, AmocoinBalance, AmocoinTransaction, Character } = require('./models/index');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware для обработки JSON
app.use(express.json());

// Настройки Swagger
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Amoria API',
      version: '1.0.0',
      description: 'API для приложения Amoria',
    },
    servers: [{ url: `http://localhost:${PORT}` }],
  },
  apis: ['./routes/*.js'], // Путь к файлам маршрутов
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Импортируем маршруты
const userRoutes = require('./routes/userRoutes');
const subscriptionRoutes = require('./routes/subscriptionRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const chatRoutes = require('./routes/chatRoutes');
const messageRoutes = require('./routes/messageRoutes');
const tapGameProgressRoutes = require('./routes/tapGameRoutes');
const fortuneWheelRoutes = require('./routes/fortuneWheelRoutes');
const amocoinBalanceRoutes = require('./routes/amocoinBalanceRoutes');
const amocoinTransactionRoutes = require('./routes/amocoinTransactionRoutes');
const botTestRoutes = require('./routes/botTest');
const telegramWebhookRoutes = require('./routes/telegramWebhook');
const characterRoutes = require('./routes/characterRoutes'); // Маршрут для Character

// Подключаем маршруты
app.use('/api', userRoutes);
app.use('/api', subscriptionRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/chats', chatRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/tapgame', tapGameProgressRoutes);
app.use('/api/fortune-wheel', fortuneWheelRoutes);
app.use('/api/amocoin-balance', amocoinBalanceRoutes);
app.use('/api', amocoinTransactionRoutes);
app.use('/api', botTestRoutes);
app.use('/api', telegramWebhookRoutes);
app.use('/api/characters', characterRoutes); // Подключаем маршрут для Character

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
