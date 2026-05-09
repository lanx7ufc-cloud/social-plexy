const express = require("express");
const puppeteer = require("puppeteer");

const app = express();

app.get("/", (req,res)=>{

res.send("API ONLINE");

});

app.get("/video", async(req,res)=>{

try{

const url = req.query.url;

if(!url){

return res.json({
erro:"Envie ?url="
});

}

const browser = await puppeteer.launch({
headless:"new",
args:["--no-sandbox"]
});

const page = await browser.newPage();

await page.goto(url,{
waitUntil:"networkidle2"
});

const mp4 = await page.evaluate(()=>{

const html = document.documentElement.innerHTML;

const match = html.match(
/https:\/\/v1\.pinimg\.com\/videos\/.*?\.mp4/g
);

return match ? match[0] : null;

});

await browser.close();

res.json({
mp4
});

}catch(e){

res.json({
erro:String(e)
});

}

});

app.listen(process.env.PORT || 3000, ()=>{

console.log("API ONLINE");

});
