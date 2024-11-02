import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import router from './router.js';

dotenv.config();

const app = express();
const DB_URL = process.env.DB_URL;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN;
const PORT = process.env.PORT || 5000;

// Підключення до MongoDB
mongoose.connect(DB_URL)
    .then(() => console.log('MongoDB підключено'))
    .catch(err => console.error('Помилка підключення до MongoDB:', err));

// Налаштування CORS
app.use(cors({
    origin: CLIENT_ORIGIN,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
}));

// Налаштування заголовка Content-Security-Policy
app.use((req, res, next) => {
    res.setHeader("Content-Security-Policy", `
        default-src 'self';
        script-src 'self' https://vercel.live;
        style-src 'self' 'unsafe-inline';
        frame-src 'self' https://vercel.live;
        object-src 'none';
    `.replace(/\s+/g, ' ').trim()); // Видаляє зайві пробіли
    next();
});

// Налаштування парсингу JSON
app.use(express.json());
app.use(express.static('static'));
app.use('/api', router);

// Головний маршрут
app.get('/', (req, res) => {
    res.send('Сервер працює!');
});

// Обробка помилки 404
app.use((req, res) => {
    res.status(404).json({ message: "Resource not found" });
});

// Запуск сервера в режимі розробки
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Сервер запущено на http://localhost:${PORT}`);
    });
}

export default app;
