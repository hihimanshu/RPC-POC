const express = require('express')
const app = express()
app.disable("x-powered-by");

app.listen(3000, ()=>{
    console.log('server started at 3000');
    
})