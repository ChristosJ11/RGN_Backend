require('dotenv').config();
const express = require('express')
const app = express()
const port = 3001
const pgp = require('pg-promise')(/* options */)
const db = pgp(process.env.DB_URL)
const cors = require('cors');
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//posts user to the db
app.post('/user', (req,res) =>{
    console.log(req.body);
    db.one('INSERT INTO users(username, password, role) VALUES($1, $2, $3) RETURNING username', [req.body.username, req.body.password, req.body.role])
  .then((data) => {
    console.log('DATA:', data)
    res.send(data)
  })
  .catch((error) => {
    console.log('ERROR:', error)
  })
})

//Sends a 401 status if it is the wrong password, else returns user data
app.get('/user', (req, res) => {
    db.one('SELECT * from users where username=$1', [req.query.username])
  .then((data) => {
    console.log('DATA:', data)
    if(req.query.password != data.password){
        res.sendStatus(401);
    }else{
        res.send(data)
    }
  })
  .catch((error) => {
    console.log('ERROR:', error)
  })
 
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})