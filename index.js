import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const DB_URL = process.env.DB_URL;
const PORT = process.env.PORT || 5000;

// Модель поста
const PostSchema = new mongoose.Schema({
    home: {
        type: [mongoose.Schema.Types.Mixed],
        required: true,
        default: [],
    },
});

const Post = mongoose.model('Post', PostSchema);

// Підключення до MongoDB
mongoose.connect(DB_URL)
    .then(() => console.log('MongoDB підключено'))
    .catch(err => console.error('Помилка підключення до MongoDB:', err));

// Налаштування CORS
app.use(cors({
    origin: "*",
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
}));

// Налаштування заголовка Content-Security-Policy
app.use((req, res, next) => {
    res.setHeader("Content-Security-Policy", "default-src 'self'; script-src 'self' https://vercel.live; style-src 'self' 'unsafe-inline'; frame-src 'self' https://vercel.live; object-src 'none';");
    next();
});

// Налаштування парсингу JSON
app.use(express.json());
app.use(express.static('static'));

// Контролер поста
class PostController {
    async create(req, res) {
        try {
            const createdPost = await Post.create({ home: [] });
            res.json(createdPost);
        } catch (e) {
            res.status(500).json({ message: e.message });
        }
    }

    async getAll(req, res) {
        try {
            const posts = await Post.find();
            return res.json(posts);
        } catch (e) {
            res.status(500).json(e);
        }
    }

    async getOne(req, res) {
        try {
            const post = await Post.findById(req.params.id);
            return res.json(post);
        } catch (e) {
            res.status(500).json(e);
        }
    }

    async update(req, res) {
        try {
            const post = await Post.findById(req.params.id);
            if (!post) throw new Error("Документ не знайдено");

            post.home = req.body.home;

            const updatedPost = await post.save();
            return res.json(updatedPost);
        } catch (e) {
            res.status(500).json({ message: e.message });
        }
    }

    async updateLogo(req, res) {
        try {
            const { id } = req.params;
            const { imageUrl } = req.body;

            const post = await Post.findById(id);
            if (!post) throw new Error("Документ не знайдено");

            const logoEntry = post.home.find(item => item.logo !== undefined);
            if (logoEntry) {
                logoEntry.logo = imageUrl;
                const updatedPost = await post.save();
                return res.json(updatedPost);
            } else {
                throw new Error("Не знайдено об'єкт з полем logo");
            }
        } catch (e) {
            res.status(500).json({ message: e.message });
        }
    }
}

const postController = new PostController();

// Маршрути
app.post('/api/posts', postController.create.bind(postController));
app.get('/api/posts', postController.getAll.bind(postController));
app.get('/api/posts/:id', postController.getOne.bind(postController));
app.put('/api/posts/:id', postController.update.bind(postController));
app.put('/api/posts/logo/:id', postController.updateLogo.bind(postController));

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
