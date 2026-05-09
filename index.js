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

await page.goto(url,{
waitUntil:"networkidle2",
timeout:60000
});

// espera manual
await new Promise(resolve=>setTimeout(resolve,3000));

const mp4 = await page.evaluate(()=>{

const html = document.documentElement.innerHTML;

const match = html.match(
/https:\/\/v1\.pinimg\.com\/videos\/.*?\.mp4/g
);

if(match && match[0]){

return match[0];

}

const scripts = [
...document.querySelectorAll("script")
];

for(const s of scripts){

const txt = s.innerHTML;

const match2 = txt.match(
/https:\/\/v1\.pinimg\.com\/videos\/.*?\.mp4/g
);

if(match2 && match2[0]){

return match2[0];

}

}

return null;

});

await browser.close();

res.json({
mp4
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
