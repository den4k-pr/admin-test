import Post from './Post.js';
import PostService from './PostService.js';

class PostController {
    async create(req, res) {
        try {
            const post = await PostService.create();
            res.json(post);
        } catch (e) {
            res.status(500).json({ message: e.message });
        }
    }

    async getAll(req, res) {
        try {
            const posts = await PostService.getAll();
            return res.json(posts);
        } catch (e) {
            res.status(500).json(e);
        }
    }

    async getOne(req, res) {
        try {
            const post = await PostService.getOne(req.params.id);
            return res.json(post);
        } catch (e) {
            res.status(500).json(e);
        }
    }

    async update(req, res) {
        try {
            const updatedPost = await PostService.update(req.params.id, req.body.home);
            return res.json(updatedPost);
        } catch (e) {
            res.status(500).json({ message: e.message });
        }
    }

    async updateLogo(req, res) {
        try {
            const { id } = req.params;
            const { imageUrl } = req.body;

            const updatedPost = await PostService.updateLogo(id, imageUrl);
            return res.json(updatedPost);
        } catch (e) {
            res.status(500).json({ message: e.message });
        }
    }
}

export default new PostController();
