//middle ware is just a function that catch excess to the request and response object
module.exports= {
    ensureAuth: function(req,res,next)
    {
        if(req.isAuthenticated())
        {
            return next()
        }
        else
        {
            res.redirect('/')
        }
    },
    ensureGuest: function(req,res,next)
    {
        if(req.isAuthenticated())
        {
            res.redirect('/dashboard')
        }
        else
        return next()
    }

}
