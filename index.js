const express = require('express')
var bodyParser = require('body-parser')
const app = express()
const port = 3000

app.use(express.static('public'))
app.use(express.json())
require('dotenv').config()
const { MongoClient } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@shortner.2h0aj.mongodb.net/url?retryWrites=true&w=majority`;
const client = new MongoClient(uri);

app.post('/api/create',async (req,res)=>{
  const url=req.body.url;
  await client.connect();
  const database = client.db("url");
  haiku = database.collection("URL");

  let slug=makeid(3);
  doc = await haiku.findOne({slug:slug});
  while(doc){
    slug=makeid(3);
    doc = await haiku.findOne({slug:slug});
  }
  
  if(url.startsWith('http://') || url.startsWith('https://')){
    const result = await haiku.insertOne({slug:slug,url:url});
  }else{
    const result = await haiku.insertOne({slug:slug,url:'http://'+url});
  }

  await client.close();
  res.send(JSON.stringify(slug))
})


app.get('/:id', async (req, res) => {
  const slug=req.params.id
  await client.connect();
  const database = client.db("url");
  haiku = database.collection("URL");
  let doc = await haiku.findOne({slug:slug});
  if(doc){
    res.send('<html><script>window.location.href = "'+doc.url+'";</script></html>')
  }else{
    res.send('<html>wrong slug</html>')
  }
})

app.listen(port, async () => {
  console.log(`Example app listening at http://localhost:${port}`)
  /*await client.connect();
  const database = client.db("url");
  haiku = database.collection("URL");
  await haiku.deleteMany({});*/
})

function makeid(length) {
  var result           = '';
  //var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var characters       = 'abcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
    result += characters.charAt(Math.floor(Math.random() * 
    charactersLength));
    }
 return result;
}

