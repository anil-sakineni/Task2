const express = require('express')
const authenticateToken = require('../middleware/auth');
const {
    registerEjs,
    loginEjs,
    dashboardEjs,
    createUser,
    userLogin,
    checkAuth,
    logOutPage,
    getUsers,
    deleteById,
    updateUser } = require('../controllers/user');
const authenticate = require('../middleware/updateAndDelete');
const router = express.Router()

router.get('/signup', registerEjs)
router.get('/login', loginEjs)
router.get('/welcome', dashboardEjs)
router.post('/register', createUser) 
router.post('/login', userLogin)
router.post('/logout', logOutPage)
router.get('/get', getUsers)
router.delete('/delete/:id',authenticate, deleteById)
router.put('/update/:id',authenticate, updateUser)



module.exports = router