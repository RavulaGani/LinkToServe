const express = require('express')
const router = express.Router();
const Post = require('../models/Post')

//Get home
router.get('', (req,res)=>{
    const locals = {
        title : "LinkToServe"
    }
    res.render('index', locals)
})

//get post
router.get('/post/:id', async (req,res)=>{

    try{
        let slug = req.params.id;
        const data = await Post.findById({_id: slug});
        const locals = {
            title: data.title
        }
        res.render('post', {locals,data});
    }catch(error){
        console.log(error);
    }
})


router.get('/about', (req,res)=>{
    const locals = {
        title: "About Us"
    }
    res.render('about', locals)
})

module.exports = router;