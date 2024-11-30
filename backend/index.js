const express = require('express');
const app = express();
const mongoose = require('mongoose');
const { json } = require('stream/consumers');
const cors = require('cors');

app.use(cors());

app.use(express.json());

async function connectToDB(){
  try {
    await mongoose.connect('mongodb://localhost:27017/myFirstDB')
    console.log("DB connection established")
  } catch (error) {
    console.log(error)
  }
}

const userSchema = new mongoose.Schema({
  username : String,
  email : {
    unique : true,
    type:String,
  },
  password : String
})

const users = mongoose.model("User",userSchema)

//  async function createUser(){
//   let newUser = await users.create({username : "alkaif" , email : "alkaif" , password : "alkaif123" })
// }

// user routes 


app.post('/users' , async (req,res) => {
  console.log(req.body)
  const {username, password, email} = req.body
  try {
    if(!username || !password || !email) {
      return res.status(400).json({
        success : false,
        msg : "Please provide all required fields"
      })
    }
    const existingUser = await users.findOne({email})
    if(existingUser){
      return res.status(400).json({
        success: false,
        msg: "Email already exists. Please use a different email.",
      });
    } else {
      const newUser = await users.create(
        {username, email , password}
      )
      return res.status(201).json({
        success : true,
        msg : "User created successfully"
      })
    }
    
  }catch(err){
    return res.status(500).json({
      success : false,
      msg : "error occurred"
    })
  }
})

app.get('/users' , async (req,res) => {
  try {
    //db calls
    const user = await users.find({})
    
    return res.status(200).json({
      success : true,
      msg : "users retrieved successfully",
      user})
  } catch (error) {
    return res.status(500).json({
      success : false,
      msg : "error occurred while getting users"
    })
  }
})

app.get('/users/:id' , async (req,res) => {
  try {
    //db calls 
    const id = req.params.id
    const user = await users.findById(id)
    if (!user) {
      return res.status(200).json({
        success : false,
        msg : "users not found"})
    } else {
    return res.status(200).json({
      success : true,
      msg : "users retrieved successfully",
      user}) }
  } catch (error) {
    return res.status(500).json({
      success : false,
      msg : "error occurred while getting users",
      err : error.message
    })
  }
})

app.patch('/users/:id' , async (req, res) => {
  try {
    const {id} = req.params
    const {username , email , password} = req.body
    const updatedUser = await users.findByIdAndUpdate(
      id,
      { username, password, email },
      {new : true} )
      
    if (!updatedUser) {
      return res.status(404).json({
        success : false,
        msg : "User not found"
      })
    }
    return res.status(200).json({msg : "user updated successfully"}) 
  } catch (error) {
    console.log(error.message)
    return res.status(500).json({
      success : false,
      msg : "error occurred while updating users"
    })
  }
})

app.delete('/users/:id' , async (req, res) => {
  try {
    const {id} = req.params
    const deletedUser = await users.findByIdAndDelete(id)
      
    if (!deletedUser) {
      return res.status(404).json({
        success : false,
        msg : "User not found"
      })
    }
    return res.status(200).json({msg : "user updated successfully" , deletedUser}) 
  } catch (error) {
    return res.status(500).json({
      success : false,
      msg : "error occurred while deleting users"
    })
  }
})

// blog routes

let blogs = []

app.post("/blogs" , (req,res) => {
  blogs.push({...req.body , id : blogs.length+1})
  return res.status(200).json({msg : "blog created successfully"})
})

app.get("/blogs" , (req,res) => {
  let publicBlogs = blogs.filter(blog => !blog.draft)
  return res.status(200).json({publicBlogs})
})

app.get("/blogs/:id" , (req,res) => {
  const {id} = req.params
  let searchBlog = blogs.filter(blog => blog.id == id)
  return res.status(200).json({searchBlog})
})

app.patch("/blogs/:id" , (req,res) => {
  const {id} = req.params
  let updatedBlogs = blogs.map((blog,index) => blog.id == id ? ({...blogs[index] , ...req.body}) : blog)
  blogs = [...updatedBlogs]
  return res.status(200).json({msg : "blog updated successfully"})
})

app.delete("/blogs/:id" , (req,res) => {
  const {id} = req.params
  let updatedBlog = blogs.filter(blog => blog.id!= id)
  blogs = [...updatedBlog]
  return res.status(200).json({msg : "blog deleted successfully"})
})


app.listen(3000,() => {
  console.log("server started")
  connectToDB()
  // createUser()
})