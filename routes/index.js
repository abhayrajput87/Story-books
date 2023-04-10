const express=require('express')
const router=express.Router()
const { ensureAuth,ensureGuest }=require('../middleware/auth')
const Story=require('../models/Story')

//@desc Login/Landing page
//@route GET /

router.get('/',ensureGuest,(req,res)=>
{
    //res.send('Login')
    res.render('login',{      //Now its going to look for template or views called "login" 
        layout:'login'       // And it will use login layout
    }) 
})

//@desc Dashboard
//@route GET /

router.get('/dashboard',ensureAuth,async (req,res)=>
{
    try {
        const stories=await Story.find({user: req.user.id}).lean()
        //res.send('Dashboard')
        res.render('dashboard',{
            name: req.user.firstName,
            stories
        
        })
    } catch (e) {
        console.error(e)
        res.render('error/500')
    }
    
        })




module.exports=router


/* ensureAuth middleware is applied to the /dashboard route, and the ensureGuest middleware
 is applied to the /login route. If a user tries to access the /dashboard route and is not
authenticated, they will be redirected to the /login route. If a user tries to access 
the /login route and is already authenticated, they will be redirected to the /dashbaord route.*/