const express = require('Express');
const app = express();
const port = 8080;
const { Client } = require('pg');
const bodyParser = require('body-parser')

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded());
// Client pour la base de données
const client = new Client({
    database: 'td9', // Mettre le nom de votre base de données ici !!
    port : 5432,
    user : 'postgres',
    password : 'Frenchyidiot1%',
});

client.connect()
    .then(()=> {
        console.log('Server Connected');
    })
    .catch( (e) => {
        console.log(e);
    });


app.listen(port, () => {
console.log(`Le serveur écoute sur http://localhost:8080`)
});

app.get('/film',async(req,res)=>{
        let film = await client.query('SELECT * FROM films')
        res.render('films',{film}) 
});

app.get('/film/:realisateur',async(req,res)=>{
    let realisateur = req.params.realisateur
    let real = await client.query(`SELECT * FROM films WHERE realisateur = '${realisateur}'`)
    res.render('realisateur',{real, realisateur}) 
});

app.post('/Done',async(req,res)=>{
    let id = req.body.id
    let titre = req.body.titre
    let realisateur = req.body.realisateur
    let date = req.body.date
    let note = req.body.note
    let description = req.body.description
    await client.query(`INSERT INTO films(id,titre,realisateur,date,note,description) VALUES ('${id}','${titre}','${realisateur}','${date}','${note}','${description}')`)
    res.send('<html><body>Nice</body><body>Posté!</body></html>')
})

app.get('/newfilm',async(req,res)=>{
    let acteurs = await client.query(`SELECT * FROM acteurs`)
    res.render('newfilm',{acteurs})
})


app.get('/acteurs',async(req,res)=>{
    let acteurs = await client.query(`SELECT a.nom, a.prenom,f.titre FROM acteurs as a, films as f, results as r WHERE r.id_acteur = a.id AND r.id_film = f.id`)
    res.render('acteurs',{acteurs})
})

app.get("/",(req,res)=>{
    res.redirect('/film')
})