const express=require('express')
const router=express.Router()
const passport=require('passport')

//@desc authonticate with google
//@route GET /auth/google

router.get('/google',passport.authenticate('google',{scope:['profile']}))

//@desc Google auth callback
//@route GET /auth/google/callback

router.get('/google/callback',passport.authenticate('google',{failureRedirect:'/' }),(req,res)=>{  //It will redirect to home route if authentiction fails
    res.redirect('/dashboard')                                                               //It will redirect to dashboard if authentiction success
}) 
//@desc logout
//@route GET /auth/logout
/*router.get('/logout',(req,res)=>{
    req.logout()   //logout is a request object function
    res.redirect('/')
})*/
router.get('/logout', function(req, res) {
    req.logout(function(err) {
      if (err) { return next(err); }
      res.redirect('/');
    });
  });

module.exports=router