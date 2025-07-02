const auth = (req,res,next)=>{
    console.log("authorization");
    const key = 1;
    if(!key){
        res.status(404).send("access denied.");
    }else{
        next();
    }
};

module.exports = auth