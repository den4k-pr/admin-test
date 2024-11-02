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

mongoose.connect(DB_URL)
    .then(() => console.log('MongoDB підключено'))
    .catch(err => console.error('Помилка підключення до MongoDB:', err));

app.use(cors({
    origin: CLIENT_ORIGIN,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
}));

app.use((req, res, next) => {
    res.setHeader("Content-Security-Policy", `
        default-src 'self';
        script-src 'self' https://vercel.live;
        style-src 'self' 'unsafe-inline';
        frame-src 'self' https://vercel.live;
        object-src 'none';
    `);
    next();
});

app.use(express.json());
app.use(express.static('static'));
app.use('/api', router);

app.get('/', (req, res) => {
    res.send('Сервер працює!');
});

app.use((req, res, next) => {
    res.status(404).json({ message: "Resource not found" });
});

if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Сервер запущено на http://localhost:${PORT}`);
    });
}

export default app;
