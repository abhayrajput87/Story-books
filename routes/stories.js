const express=require('express')
const router=express.Router()
const { ensureAuth }=require('../middleware/auth')
const Story=require('../models/Story')
const { findById } = require('../models/User')

//@desc Show add page
//@route GET /

router.get('/add',ensureAuth,(req,res)=>
{
    //res.send('Login')
    res.render('stories/add' )    
})

//@desc Show add page
//@route GET /

router.post('/',ensureAuth, async (req,res)=>
{ try {
    req.body.user= req.user.id
    await Story.create(req.body) //Story is a model here and we are creating a story insie the model
    res.redirect('/dashboard')


 } catch (e) {
    console.error(e)
    res.render('error/500')
}
   
})
//@desc Show All stories page
//@route GET /stories

router.get('/',ensureAuth,async (req,res)=> //Because in router we have already link all our so we have alredy /stories
{
    try {
        const stories=await Story.find({status:'public'})
        .populate('user')
        .sort({createdAt:'desc'})
        .lean()

        res.render('stories/index',{
            stories,
        })
        
    } catch (e) {
        console.error(e)
        res.render("error/500")
        
    }   
})


//@desc Show single story
//@route GET /stories/:id

router.get('/:id',ensureAuth,async(req,res)=>
{
    try {
        let story = await Story.findById(req.params.id)
        .populate('user')
        .lean()
        if(!story){
            return res.render('error/404')
        }
        res.render('stories/show',{
            story
        })
        
    } catch (e) {
        console.error(e)
        res.render('error/404')
        
    } 
})
//@desc Show user stories
//@route GET /stories/user/:userid

router.get('/user/:userIId',ensureAuth,async(req,res)=>
{
    try {
        const stories = await Story.find({
            user: req.params.userIId,
            status: 'public'
        })
        .populate('user')
        .lean()
        res.render('stories/index2',{
            stories
        })
    } catch (e) {
        console.error(e)
        res.render('error/404')
        
    } 
})

//@desc Show edit page
//@route GET /

router.get('/edit/:id',ensureAuth,async(req,res)=>
{
    try {
        const story=await Story.findOne({
            _id: req.params.id
        }).lean()
        if(!story){
            return res.render('error/404')
        }
        if(story.user!=req.user.id)
        {
            res.redirect('/stories')
        }
        else{
            res.render('stories/edit',{
                story,
            })
        }
        
    } catch (e) {
        console.error('e')
        return res.render('error/500')
    }

})

//@desc Update edit page
//@route PUT /stories/:id
router.put('/:id',ensureAuth,async(req,res)=>
{
    try {let story=await Story.findById(req.params.id).lean()
        if(!story){
            return res.render('error/404')
        }
        if(story.user!=req.user.id)
        {
            res.redirect('/stories')
        }
        else{
           story=await Story.findOneAndUpdate({_id: req.params.id},req.body,{
            new:true,
            runValidators: true
           })
           res.redirect('/dashboard')
        }
        
    } catch (e) {
        console.error('e')
        return res.render('error/500')
        
    }
    
})
//@desc DELETE STORY
//@route Delete /stories/:id
router.delete('/:id',ensureAuth,async(req,res)=>
{
    try {
        await Story.remove({_id: req.params.id})
        res.redirect('/dashboard')
        
    } catch (e) {
        console.error('e')
        return res.render('error/500')
        
    }
})




module.exports=router


