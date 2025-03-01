const express = require('express')
const router = express.Router();
const Post = require('../models/Post')
const User = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const jwtSecret = process.env.JWT_SECRET;
const adminLayout = '../views/layouts/admin.ejs';
const volunteerLayout = '../views/layouts/volunteer.ejs'
const organizationLayout = '../views/layouts/organization.ejs'

//get middleware check login admin
const authMiddlewareA = async (req, res, next)=>{
  const token = req.cookies.token;
  if(!token){
    return res.send('You are not authorized')
  }
  try{
    const decoded = jwt.verify(token, jwtSecret);
    req.userId = decoded.userId;
    const role = decoded.role;
    if (role !== 'admin') {
      return res.send('You are not authorized as an admin');
    }
    next();
  }catch(error){
    console.log(error);
    res.send('Invalid token');
  }
}

//get middleware check login volunteer
const authMiddlewareV = async (req, res, next) =>{
  const token = req.cookies.token;
  if(!token){
    return res.status(401).send('You are not authorized');
  }
  try{
    const decoded = jwt.verify(token, jwtSecret);
    req.userId = decoded.userId;
    const role = decoded.role;
    if(role != 'volunteer'){
      return res.status(401).send('You are not authorized as volunteer');
    }
    next();
  }catch(error){
    console.log(error);
  }
}

//get middleware check login organization
const authMiddlewareO = async (req, res, next) =>{
  const token = req.cookies.token;
  if(!token){
    return res.status(401).send('You are not authorized');
  }
  try{
    const decoded = jwt.verify(token, jwtSecret);
    req.userId = decoded.userId;
    const role = decoded.role;
    if(role != 'organization'){
      return res.status(401).send('You are not authorized as an Organization');
    }
    next();
  }catch(error){
    console.log(error);
  }
}


//POST admin check login
router.post('/admin', async (req,res)=>{
  try{
    const {username, password} = req.body;
    const user = await User.findOne({username});
    if(!user){
      return res.status(401).json({message: 'Invalid Credentials'})
    }
    if(user.role != "admin"){
      return res.status(401).json({message: 'You are not admin - Not authorized'})
    }
    
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if(!isPasswordValid){
      return res.status(401).json({message: 'Invalid Credentials'})
    }
    const token = jwt.sign({userId: user._id, role : user.role, username : user.username}, jwtSecret);
    res.cookie('token', token, {httpOnly: true});
    res.redirect('/adminDashboard')

  }catch(error){
      console.log(error);
  }
})

//POST volunteer check login
router.post('/volunteer', async (req,res)=>{
  try{
    const {username, password} = req.body;
    const user = await User.findOne({username});
    if(!user){
      return res.status(401).json({message: 'Invalid Credentials'})
    }
    if(user.role != 'volunteer'){
      return res.status(401).json({message: 'You are not volunteer - Not authorized'})
    }
    
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if(!isPasswordValid){
      return res.status(401).json({message: 'Invalid Credentials'})
    }
    
    const token = jwt.sign({userId: user._id, role : user.role, username : user.username}, jwtSecret);
    res.cookie('token', token, {httpOnly: true});
    res.redirect('/posts')

  }catch(error){
      console.log(error);
  }
})


//POST organization check login
router.post('/organization', async (req,res)=>{
  try{
    const {username, password} = req.body;
    const user = await User.findOne({username});
    if(!user){
      return res.status(401).json({message: 'Invalid Credentials'})
    }
    if(user.role != 'organization'){
      return res.status(401).json({message: 'You are not an organization - Not authorized'})
    }
    
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if(!isPasswordValid){
      return res.status(401).json({message: 'Invalid Credentials'})
    }
    
    const token = jwt.sign({userId: user._id, role : user.role, username : user.username}, jwtSecret);
    res.cookie('token', token, {httpOnly: true});
    res.redirect('/add-post-org')

  }catch(error){
      console.log(error);
  }
})


//admin login page
router.get('/admin', async (req,res)=>{
  const locals={
      title: "Admin"
  }
  try{
      res.render('admin/index', {locals, layout: adminLayout});
  }catch(error){
      console.log(error);
  }
})

//volunteer login page
router.get('/volunteer', async (req,res)=>{
  const locals={
      title: "Volunteer"
  }
  try{
      res.render('volunteer/index', {locals, layout: volunteerLayout});
  }catch(error){
      console.log(error);
  }
})

//Organization login page
router.get('/organization', async (req, res)=>{
  const locals = {
    title: "Organization"
  }
  try{
    res.render('organization/index', {locals, layout: organizationLayout})
  }catch(error){
    console.log(error);
  }
})

router.get('/logout', (req,res) => {
  res.clearCookie('token');
  res.redirect('/');
})

router.get('/adminDashboard',authMiddlewareA, async (req, res)=>{
  try{
    const data = await Post.find();
    res.render('admin/adminDashboard', {data});
  }catch(error){
    console.log(error);
  }
})

router.get('/posts',authMiddlewareV, async (req, res)=>{
    try{
        const data = await Post.find();      
        res.render('posts', {data});    
        
    }catch(error){
        console.log(error);
    }
})

//create new get-Admin
router.get('/add-post',authMiddlewareA, async (req, res)=>{
  try{
    const locals = {
      title: "Add Post"
    }
    const data = await Post.find();
    res.render('admin/add-post', {locals, layout: adminLayout});
  }catch(error){
    console.log(error);
  }
})

//create new get-org
router.get('/add-post-org',authMiddlewareO, async (req, res)=>{
  try{
    const locals = {
      title: "Add Post"
    }
    const data = await Post.find();
    res.render('organization/add-post-org', {locals, layout: organizationLayout});
  }catch(error){
    console.log(error);
  }
})

//create new post organization
router.post('/add-post-org',authMiddlewareO, async (req, res)=>{
  try{

    try{
      const newPost = new Post({
        title: req.body.title,
        pay: req.body.pay,
        venue: req.body.venue,
        email: req.body.email,
        body: req.body.body,
      })
      await Post.create(newPost);
      res.send("Your post has been sent for admin verification")
    }catch(error){
      console.log(error);
    }
  }catch(error){
    console.log(error);
  }
})

//create new post admin
router.post('/add-post',authMiddlewareA, async (req, res)=>{
  try{

    try{
      const newPost = new Post({
        title: req.body.title,
        pay: req.body.pay,
        venue: req.body.venue,
        email: req.body.email,
        body: req.body.body,
        adminCheck: "Accepted"
      })
      await Post.create(newPost);
      res.redirect('/adminDashboard')
    }catch(error){
      console.log(error);
    }
  }catch(error){
    console.log(error);
  }
})

router.post('/accept-post/:id', authMiddlewareA, async (req, res)=>{
  try {
    const postId = req.params.id;
    const post = await Post.findById(postId);
    post.adminCheck = "Accepted";
    await post.save();
    res.redirect('/adminDashboard')
  } catch (error) {
    console.log(error);
  }
})

//Edit get edit post 
router.get('/edit-post/:id', authMiddlewareA, async (req, res)=>{
  try {
    const locals = {
      title: "Edit Post"
    }
    const data = await Post.findOne({_id: req.params.id})
    res.render('admin/edit-post', {data, locals, layout: adminLayout});
  } catch (error) {
    console.log(error);
  }
})


//Edit put(update) post 
router.put('/edit-post/:id', authMiddlewareA, async (req, res)=>{
  try {
    await Post.findByIdAndUpdate(req.params.id, {
      title: req.body.title,
      body: req.body.body,
      venue: req.body.venue,
      pay: req.body.pay,
      email: req.body.email
    })
    res.redirect(`/edit-post/${req.params.id}`);
    
  } catch (error) {
    console.log(error);
  }
})


//Delete post 
router.delete('/delete-post/:id', authMiddlewareA, async (req, res)=>{
  try {
    await Post.deleteOne({_id: req.params.id})
    res.redirect('/adminDashboard')
  } catch (error) {
    console.log(error);
  }
})


//POST Admin register
router.post('/register-admin', async (req, res) => {
  try {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      const user = await User.create({ username, password:hashedPassword, role: 'admin' });
      res.send("You have succesfully registered! Go back and Sign In")
    } catch (error) {
      if(error.code === 11000) {
        res.status(409).json({ message: 'User already in use'});
      }
      res.status(500).json({ message: 'Internal server error'})
    }

  } catch (error) {
    console.log(error);
  }
});

//POST volunteer register
router.post('/register-volunteer', async (req, res) => {
  try {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      const user = await User.create({ username, password:hashedPassword, role: 'volunteer' });
      res.send("You have successfully registered! Go back and Sign In")
    } catch (error) {
      if(error.code === 11000) {
        res.status(409).json({ message: 'User already in use'});
      }
      res.status(500).json({ message: 'Internal server error'})
    }

  } catch (error) {
    console.log(error);
  }
});

//POST organization register
router.post('/register-organization', async (req, res) => {
  try {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      const user = await User.create({ username, password:hashedPassword, role: 'organization' });
      res.send("You have successfully registered! Go back and Sign In")
    } catch (error) {
      if(error.code === 11000) {
        res.status(409).json({ message: 'User already in use'});
      }
      res.status(500).json({ message: 'Internal server error'})
    }

  } catch (error) {
    console.log(error);
  }
});










module.exports = router;
