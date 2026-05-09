const express = require("express");
const puppeteer = require("puppeteer");

const app = express();

app.get("/", (req,res)=>{

res.send("API ONLINE");

});

app.get("/video", async(req,res)=>{

let browser;

try{

const url = req.query.url;

if(!url){

return res.json({
erro:"Envie ?url="
});

}

browser = await puppeteer.launch({
headless:true,
args:[
"--no-sandbox",
"--disable-setuid-sandbox"
]
});

const page = await browser.newPage();

await page.setUserAgent(
"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122 Safari/537.36"
);

let videoUrl = null;

// captura requests
page.on("response", async(response)=>{

try{

const resUrl = response.url();

if(
resUrl.includes(".mp4") &&
resUrl.includes("pinimg")
){

videoUrl = resUrl;

}

}catch(e){}

});

await page.goto(url,{
waitUntil:"networkidle2",
timeout:60000
});

// scroll leve
await page.evaluate(()=>{

window.scrollBy(0,500);

});

// espera carregar requests
await new Promise(r=>setTimeout(r,5000));

await browser.close();

res.json({
mp4: videoUrl
});

}catch(e){

if(browser){

await browser.close();

}

res.json({
erro:String(e)
});

}

});

app.listen(process.env.PORT || 3000, ()=>{

console.log("API ONLINE");

});
