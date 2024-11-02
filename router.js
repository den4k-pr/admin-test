import express from 'express';
import PostController from './PostController.js';

const router = express.Router();

router.post('/posts', PostController.create);
router.get('/posts', PostController.getAll);
router.get('/posts/:id', PostController.getOne);
router.put('/posts/:id', PostController.update);
router.put('/posts/logo/:id', PostController.updateLogo);

export default router;
