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
    updateUser} = require('../controllers/user');
const router = express.Router()

router.get('/signup', registerEjs)
router.get('/login', loginEjs)
router.get('/welcome', authenticateToken,(req,res)=>{
    res.json({message : "success"})
})
router.post('/register', createUser) 
router.post('/User-login', userLogin)
router.post('/logout',logOutPage) 
router.get('/get',getUsers)
router.delete('/delete/:id', deleteById)
router.put('/update/:id', updateUser)



module.exports = router