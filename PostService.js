import Post from './Post.js';

class PostService {
    async create() {
        const createdPost = await Post.create({ home: [] });
        return createdPost;
    }

    async getAll() {
        const posts = await Post.find();
        return posts;
    }

    async getOne(id) {
        if (!id) {
            throw new Error('не указан ID');
        }
        const post = await Post.findById(id);
        return post;
    }

    async update(id, newHomeData) {
        if (!id) throw new Error("не указан ID");

        const post = await Post.findById(id);
        if (!post) throw new Error("Документ не знайдено");

        post.home = newHomeData;

        return await post.save();
    }

    async updateLogo(id, logoUrl) {
        if (!id) throw new Error("не указан ID");

        const post = await Post.findById(id);
        if (!post) throw new Error("Документ не знайдено");

        const logoEntry = post.home.find(item => item.logo !== undefined);

        if (logoEntry) {
            logoEntry.logo = logoUrl;
            return await this.update(id, post.home);
        } else {
            throw new Error("Не знайдено об'єкт з полем logo");
        }
    }
}

export default new PostService();
