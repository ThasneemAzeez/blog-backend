const mongoose=require("mongoose")
const schema = mongoose.Schema(
    {
        "name":{type:String,required:true},
        "email":{type:String,required:true},
        "password":{type:String,required:true}

    }
)
let blogmodel = mongoose.model("blogs",schema)
module.exports={blogmodel}