const User = require('../models/User');
const bcryptjs = require('bcryptjs');
const { generateToken } = require('../utils/jwt');



const getUsers = async (req, res, next) => {
    let user;
    try {
        user = await User.find()
    } catch (err) {
        console.log("err", err);

    }
    if (!user) {
        res.status(400).json({ message: 'no users found' })

    }
    return res.status(200).json({ user })
}


const registerEjs = (req, res) => {
    res.render('register')
}

const loginEjs = (req, res) => {
    res.render('login')
}

const dashboardEjs = (req, res) => {
    res.render('dashboard')
}

const checkAuth = (req, res, next) => {
    if (req.session.isAuthenticated) {
        next()
    }
    else {
        res.redirect('/login')
    }
}

const createUser = async (req, res) => {
    const { name, email, age, phone, image, password } = req.body

    let user = await User.findOne({ email })
    if (user) {
        return res.redirect('/signup')
    }

    const hashhedPassword = await bcryptjs.hash(password, 12)



    if (name == "" || email == "" || age === null || phone === null || image == "" || password == "") {
        console.log("failed");
        return res.status(400).json({ 
            status: "failed",
            message: "all fields are mandetory"


        })
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({
            status: "failed",
            message: "invalid email entered"
        })
    }
    if (!/^[0-9]{10}$/.test(phone)) {
        console.log("details");

        return res.status(400).json(
            {
                status: "failed",
                message: "phone number must and should be 10"
            }
        )

    }

    if (!/^.{8}$/.test(password)) {
        return res.status(400).json(
            {
                status: "failed",
                message: "password should be must and should 8  letters"
            }
        )

    }
    if (!/\.(jpg|jpeg|png|gif|bmp|svg)$/i.test(image)) {

        return res.status(400).json(
            {
                status: "failed",
                message: "immage should be perticular format"
            }
        )
    }

    user = new User({
        name,
        email,
        age,
        phone,
        image: {
            data: req.body.image
        },
        password:hashhedPassword
    })
    req.session.person1 = user.name
    await user.save();
    res.redirect('/login')

}


const deleteById = async (req, res, next) => {
    const userId = req.params.id;
    let user;
    try {
        user = await User.findByIdAndDelete(userId)
    } catch (err) {
        console.log(err);
    }
    if (!user) {
        res.status(400).json({ message: "user not found" })
    }
    return res.status(200).json({ message: "user deleted successfully" })
}


const updateUser = async (req, res, next) => {
    const { name, email, age, phone, password, image } = req.body
    const userId = req.params.id;
    let user;
    try {
        user = await User.findByIdAndUpdate(userId, { name, email, age, phone, password, image })
    } catch (err) {
        console.log(err);

    }

    if (!user) {
        res.status(400).json({ message: 'user not found' })
    }
    return res.status(200).json({ user })
}


const userLogin = async (req, res) => {


    const { Email, password } = req.body

    let user = await User.findOne({ email: Email })
    if (!user) {
        console.log("error");

        return res.redirect('/signup')
    }

    const checkPassword = await bcryptjs.compare(password, user.password)
    if (!checkPassword) {
        return res.redirect('/signup')
    }
    const token = generateToken(user);
    try {
        if (token) {
           return res.json({ token });

        }
    }
    catch (err) {
        console.log("error", err);

    }  
    // req.session.isAuthenticated = true
    // res.redirect('/welcome')



}

const logOutPage = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.log('err', err)
        }
        res.redirect('/signup')
    })
}
module.exports = {
    registerEjs,
    loginEjs,
    dashboardEjs,
    createUser,
    userLogin,
    checkAuth,
    logOutPage,
    getUsers,
    deleteById,
    updateUser
}