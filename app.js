const express = require('express');
const app = express();
const port = process.env.PORT || 4000;
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const urlSchema = new mongoose.Schema({
    shortUrl:String,
    longUrl:String
})

const Url = mongoose.model('Url',urlSchema);

app.use(express.static(__dirname + '/public'));

process.env.DATABASE = 'mongodb://user:user@ds161194.mlab.com:61194/site-shortener';


mongoose.connect(process.env.DATABASE,(err)=>{
    if(err){
        console.log(err)
    }else{
        console.log('Connection to database was succesful')
    }
})

app.get('/',(req,res)=>{
    res.send('this is the home page')
})

app.get('/new/:url*',async (req,res)=>{
    
    let url = null;
    url = req.url.slice(5);
    if(validateURL(url)){
        const result = {
            original_url:url,
            short_url:"https://" + req.headers.host +"/"+ generateLink()
        };
        const site = new Url({
            shortUrl:result.short_url,
            longUrl:result.original_url
        });

        await site.save();
        res.send(result);
    }else{
        res.send({"error":"Invalid URL"})
    }   
})

app.get('/:number',async (req,res)=>{
    const shortUrl ="https://"+req.headers.host+"/"+req.params.number;
    const url = await Url.findOne({shortUrl:shortUrl});
    res.redirect(url.longUrl);
})

app.listen(8000,()=>{
    console.log('server is up and running');
})

function validateURL(url) {
    var regex = /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?$/i;
    return regex.test(url);
}

function generateLink(){
    const num =  Math.floor(Math.random() * 10000);
    return num.toString();

}