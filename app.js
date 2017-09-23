const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.static(__dirname + '/public'))

app.get('/',(req,res)=>{
    res.send('this is the home page')
})
app.get('/new/:url',(req,res)=>{
    res.send(req.params.url)
})

app.listen(port,()=>{
    console.log('server is up and running');
})