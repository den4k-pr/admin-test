import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema({
    home: {
        type: [mongoose.Schema.Types.Mixed],
        required: true,
        default: [],
    },
});

export default mongoose.model('Post', PostSchema);
