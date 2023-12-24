import mongoose from 'mongoose';

const { Schema } = mongoose;

const ReviewSchema = new Schema({
    movieId: { type: Number, required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    author: { type: String, required: true },
    review: { type: String, required: true },
    rating: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Review', ReviewSchema);
