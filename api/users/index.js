import express from 'express';
import User from './userModel';
import asyncHandler from "express-async-handler";
import jwt from 'jsonwebtoken';

const router = express.Router(); // eslint-disable-line

// Get all users
router.get('/', async (req, res) => {
    const users = await User.find();
    res.status(200).json(users);
});

// register(Create)/Authenticate User
router.post('/', asyncHandler(async (req, res) => {
    try {
        const { username, email, account, password } = req.body;

        if (req.query.action === 'register') {
            if (!username || !email || !password) {
                return res.status(400).json({ success: false, msg: 'Username, email and password are required for registration.' });
            }
            await registerUser(req, res);
        } else {
            if (!account || !password) {
                return res.status(400).json({ success: false, msg: 'Account and password are required for login.' });
            }
            await authenticateUser(req, res);
        }
    } catch (error) {
        if (error.name === 'ValidationError') {
            console.info(req.body.account)
            console.info(req.body.password)
            return res.status(400).json({success: false, msg: 'something got wrong'});
        }
        // Log the error and return a generic error message
        console.error(error);
        res.status(500).json({success: false, msg: 'Internal server error.'});
    }
}));

// Update a user
router.put('/:id', async (req, res) => {
    if (req.body._id) delete req.body._id;
    const result = await User.updateOne({
        _id: req.params.id,
    }, req.body);
    if (result.matchedCount) {
        res.status(200).json({code: 200, msg: 'User Updated Sucessfully'});
    } else {
        res.status(404).json({code: 404, msg: 'Unable to Update User'});
    }
});

// get all favorite movies
router.get('/tmdb/:id/favorites', asyncHandler(async (req, res) => {
    const { id } = req.params;
    console.info(id)
    console.info(typeof id)
    try {
        const user = await User.findById(id).populate('favorites');
        // if (!user) {
        //     return res.status(400).json({ message: 'User not found' });
        // }

        res.status(200).json(user.favorites);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
}));


// add to favorite
router.post('/tmdb/:id/favorites', asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { movieId } = req.body;
    console.info(movieId)
    console.info(id)

    try {
        await User.findByIdAndUpdate(id, {
            $addToSet: { favorites: movieId } // 使用 $addToSet 添加电影，防止重复
        }, {new: true});

        res.status(200).json({ message: 'Movie added to favorites' });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
}));

// delete from favorite
router.delete('/tmdb/:id/favorites/:movieId', asyncHandler(async (req, res) => {
    const { id, movieId } = req.params;

    try {
        await User.findByIdAndUpdate(id, {
            $pull: { favorites: movieId } // 使用 $pull 删除指定的电影
        }, {new: true});

        res.status(200).json({ message: 'Movie removed from favorites' });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
}));

// marked movie

router.get('/tmdb/:id/marked', asyncHandler(async (req, res) => {
    const { id } = req.params;

    try {
        const user = await User.findById(id).populate('marked');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(user.marked);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
}));

router.post('/tmdb/:id/marked', asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { movieId } = req.body;

    try {
        await User.findByIdAndUpdate(id, {
            $addToSet: { marked: movieId }
        }, {new: true});
        res.status(200).json({ message: 'Movie marked successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
}));

router.delete('/tmdb/:id/marked/:movieId', asyncHandler(async (req, res) => {
    const { id, movieId } = req.params;

    try {
        await User.findByIdAndUpdate(id, {
            $pull: { marked: movieId }
        }, {new: true});
        res.status(200).json({ message: 'Movie unmarked successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
}));


// follow actor

router.get('/tmdb/:id/follow', asyncHandler(async (req, res) => {
    const { id } = req.params;
    console.info(id)
    try {
        const user = await User.findById(id).populate('follow');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        console.info(user)

        res.status(200).json(user.follow);
    } catch (error) {
        console.info(error.message)
        res.status(500).json({ message: 'Internal server error' });
    }
}));

router.post('/tmdb/:id/follow', asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { actorId } = req.body;
    console.info(id, actorId)
    try {
        await User.findByIdAndUpdate(id, {
            $addToSet: { follow: actorId }
        }, {new: true});
        console.info("add success")
        res.status(200).json({ message: 'Actor followed successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
}));

router.delete('/tmdb/:id/follow/:actorId', asyncHandler(async (req, res) => {
    const { id, actorId } = req.params;

    try {
        await User.findByIdAndUpdate(id, {
            $pull: { follow: actorId }
        }, {new: true});
        res.status(200).json({ message: 'Actor unfollowed successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
}));





async function registerUser(req, res) {
    const { username, email, password } = req.body;

    // 验证用户名
    if (!username) {
        return res.status(400).json({ success: false, msg: 'Username is required.' });
    }

    const user = await User.findOne({username: username})
    if (user){
        res.status(400).json({ success: false, msg: 'User name already existed!!'})
    }

    // 验证邮箱
    if (!email) {
        return res.status(400).json({ success: false, msg: 'Email is required.' });
    }

    const user1 = await User.findOne({email: email})
    if (user1){
        res.status(400).json({ success: false, msg: 'Email already existed!!'})
    }
    // 验证邮箱格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ success: false, msg: 'Invalid email format.' });
    }

    // 验证密码
    if (!password) {
        return res.status(400).json({ success: false, msg: 'Password is required.' });
    }
    // 验证密码格式（例如，长度和字符要求）
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/; // 示例：至少8个字符，至少一个字母和一个数字
    if (!passwordRegex.test(password)) {
        return res.status(400).json({ success: false, msg: 'Password does not meet complexity requirements.' });
    }

    try {
        // 创建用户
        // 创建用户
        const newUser = new User(req.body);
        await newUser.save();

        // 创建令牌
        const token = jwt.sign({ username: newUser.username }, process.env.SECRET);

        // 发送响应
        res.status(201).json({
            success: true,
            msg: 'User successfully created.',
            token: 'BEARER ' + token,
            user: {
                id: newUser._id, // 返回用户 ID
                username: newUser.username,
                email: newUser.email
            }
        });
    } catch (error) {
        // 错误处理逻辑，比如处理唯一性冲突等
        res.status(500).json({ success: false, msg: 'Internal server error.' });
    }
}

async function authenticateUser(req, res) {
    let user;
    const {account, password} = req.body;

    // 判断输入的是邮箱还是用户名
    if (account.includes('@')) {
        user = await User.findByEmail(account);
    } else {
        user = await User.findByUserName(account);
    }

    if (!user) {
        return res.status(401).json({ success: false, msg: 'Authentication failed. User not found.' });
    }

    const isMatch = await user.comparePassword(password);
    if (isMatch) {
        const token = jwt.sign({ username: user.username }, process.env.SECRET);
        res.status(200).json({
            success: true,
            msg: 'User login successfully',
            token: 'BEARER ' + token,
            user: {
                id: user._id, // 返回用户 ID
                username: user.username,
                email: user.email
            }
        });
    } else {
        res.status(401).json({ success: false, msg: 'Wrong password.' });
    }
}


export default router;
