import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import {MovieSchema} from "../movies/movieModel"

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: {type: String, unique: true, required: true},
    email: {
        type: String,
        unique: true,
        required: 'Email address is required',
        validate: {
            validator: function (email) {
                const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return regex.test(email);
            },
            message: props => `${props.value} is not a valid email address!`
        },
    },
    password: {
        type: String,
        required: 'Password is required',
        validate: {
            validator: function (password) {
                // 这个正则表达式检查密码至少有8个字符，至少包含一个字母、一个数字和一个特殊字符
                const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
                return regex.test(password);
            },
            message: props => `${props.value} is not a valid password!`
        },
    },
    favorites: [Number],
    marked: [Number],
    follow: [Number]
});

UserSchema.methods.comparePassword = async function (passw) {
    return await bcrypt.compare(passw, this.password);
}

UserSchema.statics.findByUserName = function (username) {
    return this.findOne({username: username});
};

UserSchema.statics.findByEmail = function (email) {
    return this.findOne({email: email});
};

UserSchema.pre('save', async function (next) {
    const saltRounds = 10; // You can adjust the number of salt rounds
    //const user = this;
    if (this.isModified('password') || this.isNew) {
        try {
            const hash = await bcrypt.hash(this.password, saltRounds);
            this.password = hash;
            next();
        } catch (error) {
            next(error);
        }

    } else {
        next();
    }
});

export default mongoose.model('User', UserSchema);
