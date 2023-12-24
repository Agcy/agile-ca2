import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const ActorSchema = new Schema({
    id: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    profile_path: { type: String },
    popularity: { type: Number },
    gender: { type: Number },
    known_for_department: { type: String },
    biography: { type: String },
    birthday: { type: String },
    deathday: { type: String },
    place_of_birth: { type: String }
});

ActorSchema.statics.findByActorDBId = function (id) {
    return this.findOne({ id: id });
};

export default mongoose.model('Actors', ActorSchema);
