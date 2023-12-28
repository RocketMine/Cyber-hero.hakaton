const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const app = express();
const PORT = 22833; // Ваш порт
const STATIC_IP = 'localhost'; // Замените на ваш статический IP

app.use(cors());
app.use(express.json()); // Добавляем middleware для обработки JSON

// Предоставление статических файлов из директории public
app.use(express.static(path.join(__dirname, 'public')));

// Открытие main.html при переходе по IP
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'main.html'));
});

app.post('/saveResult', (req, res) => {
  const { userName, score } = req.body;

  if (!userName || !score) {
    return res.status(400).json({ error: 'Необходимо указать имя пользователя и баллы' });
  }

  // Сохраняем результаты в файл
  const results = JSON.parse(fs.readFileSync('public/json/results.json', 'utf8'));
  results.push({ userName, score });
  fs.writeFileSync('public/json/results.json', JSON.stringify(results, null, 2));

  res.json({ success: true });
});

// Запуск сервера
app.listen(PORT, STATIC_IP, () => {
  console.log(`Server is running at http://${STATIC_IP}:${PORT}`);
});

