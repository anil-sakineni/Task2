const express=require('express');

const cors=require('cors');
const ejs=require('ejs')
const dotEnv=require('dotenv')
const session=require('express-session')
const mongodbstore=require('connect-mongodb-session')(session);
const db= require('./config/db')
const router=require('./router/userRoute');
const bodyParser = require('body-parser');

const app=express();


dotEnv.config();
app.set('view engine','ejs')
app.use(express.urlencoded({extended:true}))
app.use(express.json())

db()
const store=new mongodbstore({
    uri:process.env.Mongo_URI,
    collection:"mySession"
})
app.use(session({
    secret:"Thiss is Secret",
    resave:false,
    saveUninitialized:false,
    store:store
}))




const port=process.env.port ||2800;

app.listen(port,()=>{
    console.log(`created server sucessfully at: ${port}`);
    })




app.use('',router)




