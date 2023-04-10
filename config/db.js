const mongoose=require('mongoose')
//mongoose.connect return promise
mongoose.set('strictQuery', true);
const connect= async ()=>{
    try{
    const connect=await mongoose.connect(process.env.MONGO_URL) // We replace special character using percent encoding if it is present in username or password
    console.log('Congratulations! MongoDb is conected')
}catch(e)
{
    console.log(e)
    process.exit(1)
}
}
module.exports=connect
/* "module.exports = connect" is a statement in Node.js, which is used to export an object, function, or value as a module. 
The exported value can then be imported in another file and used. The connect in this statement could refer to a function, 
an object, or a value that is being exported as a module.*/

