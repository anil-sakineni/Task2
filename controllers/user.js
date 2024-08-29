const User = require('../models/User');
const bcryptjs = require('bcryptjs');
const { generateToken } = require('../utils/jwt');
const multer = require('multer')
const path = require('path')



// multer
// storage
const Stroage = multer.diskStorage({
    destination: "uploads",
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
})

const upload = multer({
    storage: Stroage
})


const getUsers = async (req, res, next) => {
    let users;
    try {
        users = await User.find()
    } catch (err) {
        console.log("err", err);

    }
    if (!users) {
        res.status(400).json({ message: 'no users found' })

    }
    return res.status(200).json({ users })
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

// post request
const createUser = async (req, res, next) => {

    upload.single('image')(req, res, async (err) => {
        if (err) {
            console.log("file upload error");
        }
        else {
            const { name, email, age, phone, image, password } = req.body

            const hashedPassword = await bcryptjs.hash(password, 8)


            let existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ message: "this user already exists" })
            }


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

            const imageData = [[req?.file?.filename], [req?.body?.image]]

            const finalImage = imageData
                .filter(innerArray => innerArray.every(item => item !== undefined && item !== null)); // Remove arrays with `undefined` or `null` values



            if (!/\.(jpg|jpeg|png|gif|bmp|svg)$/i.test(finalImage)) {
                return res.status(400).json(
                    {
                        status: "failed",
                        message: "immage should be perticular format"
                    }
                )
            }



            const user = new User({
                name: req.body.name,
                email: req.body.email,
                age: req.body.age,
                phone: req.body.phone,

                image: {
                    data: finalImage
                },
                password: hashedPassword


            })



            await user.save()

            // res.status(200).json({ user })
            res.render('login')

        }
    })


}


const deleteById = async (req, res, next) => {
    const userId = req.params.id;
    const tokenId = req.user.id
    let user;
    try {
        if (userId != tokenId) {
            return res.status(400).json({ message: "ID does not match" })
        }
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
    const tokenId = req.user.id

    let user;
    try {
        if (userId != tokenId) {
            return res.status(400).json({ message: "ID does not match" })
        }
        let updateData = { name, email, age, phone };
        user = await User.findByIdAndUpdate(userId, updateData, { new: true })


    } catch (err) {
        console.log('err');

    }

    if (!user) {
        return res.status(400).json({ message: 'user not found' })
    }
    return res.status(200).json({ user })
}


const userLogin = async (req, res) => {


    const { email, password } = req.body

    let user = await User.findOne({ email })
    if (!user) {
        console.log("error");

        return res.redirect('/signup')
    }
    const checkPassword = await bcryptjs.compare(password, user.password)
    console.log("check password", checkPassword);

    if (!checkPassword) {
        return res.redirect('/signup')
    }
    const token = generateToken(user);
    try {
        if (token) {
            // res.redirect('/welcome')
            return res.json({ token });

        }
    }
    catch (err) {
        console.log("error", err);
    }
    // req.session.isAuthenticated = true

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