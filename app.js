const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const { blogmodel } = require("./models/blog")
const bcrypt = require("bcryptjs")
const jwt =require("jsonwebtoken")


mongoose.connect("mongodb+srv://thasneemazeez:thasneem38@cluster0.uk9okno.mongodb.net/bogdb?retryWrites=true&w=majority&appName=Cluster0")

const app = express()
app.use(cors())
app.use(express.json())

//password encrypting
const generateHashedPassword = async (password) => {
    const salt = await bcrypt.genSalt(10)
    return bcrypt.hash(password, salt)
}



app.post("/signup", async (req, res) => {
    let input = req.body
    //by doing this our password willbe hashed
    let hashedPassword = await generateHashedPassword(input.password)
    console.log(hashedPassword)
    //setting db password 
    input.password = hashedPassword
    let blog = new blogmodel(input)
    blog.save()
    res.json({ "status": "success" })
})

app.post("/signin", (req, res) => {
//checking email is correct or not if yes it will go to login page or user not found
    let input = req.body
    blogmodel.find({ "email": req.body.email }).then(
        (response) => {
            if (response.length > 0) {
                let dbPassword = response[0].password
                console.log(dbPassword)
                //checking our password and crypted password same crypted always have different values to make it equal
               bcrypt.compare(input.password,dbPassword,(error,isMatch)=>{
                if (isMatch) {
                    jwt.sign({email:input.email},"blog-app" ,{expiresIn:"1d"},(error,token)=>{
                        if (error) {
                            res.json({"status":"unable to create token"})
                        } else {
                            res.json({"status":"success","userId":response[0]._id,"token":token})
                        }
                    })
                   
                } else {
                    res.json({"status":"inccorect password"})
                }
               })
               
            } else {
                res.json({ "status": "user not found" })
            }
        })
})




app.listen(8080, () => {
    console.log("server started")
})