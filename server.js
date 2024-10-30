const express = require('express');
const cors = require('cors'); // Импортируем CORS

const app = express();
const PORT = 3000; // Порт для сервера

// Разрешаем CORS для всех запросов
app.use(cors());

// Раздаём статические файлы из папки 'public'
app.use(express.static('public'));

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});
