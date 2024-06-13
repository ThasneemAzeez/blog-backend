const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const { blogmodel } = require("./models/blog")
const bcrypt = require("bcryptjs")

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
   let input=req.body
    //by doing this our password willbe hashed
    let hashedPassword = await generateHashedPassword(input.password)
    console.log(hashedPassword)
    //setting db password 
    input.password = hashedPassword
    let blog = new blogmodel(input)
    blog.save()
    res.json({"status":"success"})
})




app.listen(8080, () => {
    console.log("server started")
})