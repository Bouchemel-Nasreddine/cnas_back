import mysql from 'mysql' 

const express =require('express');


// var mysql = require('mysql');
const PORT =  process.env.PORT || 5000;

const app = express();

const test = 5;

var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database :'cnas'
});
connection.connect((err)=>{
    if(err)
    {
        console.warn("error in connection")
    }
});


//midedleware

app.use(express.json());

//------------------------root---------------------------------------

app.get('/', (req, res)=>{
  res.send('hello to our cnas project, Chinotech is wishing you a good day :)')
})

//-------------------------auth--------------------------------------

app.post('/login', (req, res)=> {
  const data = req.body
  const type = req.body['type'];
  const credential = req.body['credential']
  const password = req.body['password']

  if (type == 'patient') {
    connection.query("Select * from patient where patient.num_ass_soc =  '"+credential+"' AND patient.password = '"+password+"' ;", data, (error, rows, fields)=>{
      if (error) throw error
      if (rows.length !=0) {
        res.send(rows)
      } else {
        res.send('credentials not found')
      }
    })
  } else
  if (type == 'ets') {
    connection.query("Select * from ets where ets.phone =  '"+credential+"' AND ets.password = '"+password+"' ;", data, (error, rows, fields)=>{
      if (error) throw error
      if (rows.length !=0) {
        res.send(rows)
      } else {
        res.send('credentials not found')
      }
    })
  } else
  if (type == 'staff_cnas') {
    connection.query("Select * from staff_cnas where staff_cnas.num_de_travail =  '"+credential+"' AND patient.password = '"+password+"' ;", data, (error, rows, fields)=>{
      if (error) throw error
      if (rows.length !=0) {
        res.send(rows)
      } else {
        res.send('credentials not found')
      }
    })
  }

})


//---------------------------patient------------------------------------

app.post('/patient', (req, res) =>{

  // const data = req.body;

  // connection.query("INSERT INTO patient SET? ", data, (error, results, fields) => {
  //   if (error) throw error;
  //   res.send(req.body);
  // })

  var pool = mysql.createPool({
    host: 'remotemysql.com',
    user: 'jOPNYDXCCM',
    password: 'BzAUV81FUK',
    database: 'jOPNYDXCCM',
    connectionLimit: 100,
    multipleStatements: true,
  })

}  )

app.get('/patient', function(req, res)  {
  var data = {
    "": ""
  };

  connection.query("SELECT * FROM Patient;", (error, rows, fields) => {
    if(rows.length != 0){
                  data = rows;
                  res.json(data);
              }else{
                  data = 'No data Found..';
                  res.json(data);
              }
  })

} )


app.get('/patient/:id', function(req, res)  {
  const id = req.params.id;
  var data = {
    "": ""
  };

  connection.query("SELECT * FROM Patient where patient.id_patient = '"+id+"';", (error, rows, fields) => {
    if(rows.length != 0){
                  data = rows;
                  res.json(data);
              }else{
                  data = 'No data Found..';
                  res.json(data);
              }
  })

} )


//----------------------------demande--------------------------------------------

app.post('/demande', (req, res) =>{

  const data = req.body;

  connection.query("INSERT INTO demande SET? ", data, (error, results, fields) => {
    if (error) throw error;
    res.send(req.body);
  })

}  )

app.get('/demande', (req, res) => {
  var data = {}

  connection.query("Select * from demande", data, (error, rows, fields)=> {
    if (error) throw error;
    if (rows.length != 0) {
      data = rows;
    } else {
      data = [];
    }
    res.send(data);
  })

} )



app.get('/demande/:id', function(req, res)  {
  const id = req.params.id;
  var data = {
    "": ""
  };

  connection.query("SELECT * FROM demande where demande.id_demande = '"+id+"';", (error, rows, fields) => {
    if(rows.length != 0){
                  data = rows;
                  res.json(data);
              }else{
                  data = 'No data Found..';
                  res.json(data);
              }
  })

} )


app.put('/demande/:id/:etat', (req, res)=>{
  const id = req.params.id;
  const etat = req.params.etat;

  connection.query("UPDATE demande SET demande.etat='"+etat+"' where demande.id_demande = '"+id+"';", (error, results, fields) => {
    if (error) throw error;
    res.send("done")
  })
})


//-------------------ets--------------------------------

app.post('/ets', (req, res) => {
  const data = req.body;

  connection.query("INSERT INTO ets SET?", data, (error, results, fields)=>{
    if (error) throw error
    res.send(req.body);
  })

})


app.get('/ets', (req, res) => {
  var data = {}

  connection.query("Select * from ets", data, (error, rows, fields)=> {
    if (error) throw error;
    if (rows.length != 0) {
      data = rows;
    } else {
      data = [];
    }
    res.send(data);
  })

} )



app.get('/ets/:id', function(req, res)  {
  const id = req.params.id;
  var data = {
    "": ""
  };

  connection.query("SELECT * FROM ets where ets.id_ets = '"+id+"';", (error, rows, fields) => {
    if(rows.length != 0){
                  data = rows;
                  res.json(data);
              }else{
                  data = 'No data Found..';
                  res.json(data);
              }
  })

} )

//------------------propostion--------------------

app.post('/proposition', (req, res) => {
  const data = req.body;

  connection.query("INSERT INTO proposition SET?", data, (error, results, fields)=>{
    if (error) throw error
    res.send(req.body);
  })

})

app.get('/proposition', (req, res) => {
  var data = {}

  connection.query("Select * from proposition", data, (error, rows, fields)=> {
    if (error) throw error;
    if (rows.length != 0) {
      data = rows;
    } else {
      data = [];
    }
    res.send(data);
  })

} )

app.get('/proposition/:id', function(req, res)  {
  const id = req.params.id;
  var data = {
    "": ""
  };

  connection.query("SELECT * FROM proposition where proposition.id_proposition = '"+id+"';", (error, rows, fields) => {
    if(rows.length != 0){
                  data = rows;
                  res.json(data);
              }else{
                  data = 'No data Found..';
                  res.json(data);
              }
  })

} )

app.put('/proposition/:id/:etat', (req, res)=>{
  const id = req.params.id;
  const etat = req.params.etat;

  connection.query("UPDATE proposition SET proposition.etat='"+etat+"' where proposition.id_proposition = '"+id+"';", (error, results, fields) => {
    if (error) throw error;
    res.send("done")
  })
})


//-----------------------staf cnas--------------------------

app.post('/staff_cnas', (req, res) =>{

  const data = req.body;

  connection.query("INSERT INTO staff_cnas SET? ", data, (error, results, fields) => {
    if (error) throw error;
    res.send(req.body);
  })

}  )

app.get('/staff_cnas', function(req, res)  {
  var data = {
    "": ""
  };

  connection.query("SELECT * FROM staff_cnas;", (error, rows, fields) => {
    if(rows.length != 0){
                  data = rows;
                  res.json(data);
              }else{
                  data = 'No data Found..';
                  res.json(data);
              }
  })

} )

app.get('/staff_cnas/:id', function(req, res)  {
  const id = req.params.id;
  var data = {
    "": ""
  };

  connection.query("SELECT * FROM staff_cnas where staff_cnas.id_staff_cnas = '"+id+"';", (error, rows, fields) => {
    if(rows.length != 0){
                  data = rows;
                  res.json(data);
              }else{
                  data = 'No data Found..';
                  res.json(data);
              }
  })

} )

//-----------------------reclamation---------------------------

app.post('/reclamation', (req, res) =>{

  const data = req.body;

  connection.query("INSERT INTO reclamation SET? ", data, (error, results, fields) => {
    if (error) throw error;
    res.send(req.body);
  })

}  )

app.get('/reclamation', function(req, res)  {
  var data = {
    "": ""
  };

  connection.query("SELECT * FROM reclamation;", (error, rows, fields) => {
    if(rows.length != 0){
                  data = rows;
                  res.json(data);
              }else{
                  data = 'No data Found..';
                  res.json(data);
              }
  })

} )

app.get('/reclamation/:id', function(req, res)  {
  const id = req.params.id;
  var data = {
    "": ""
  };

  connection.query("SELECT * FROM reclamation where reclamation.id_reclamation = '"+id+"';", (error, rows, fields) => {
    if(rows.length != 0){
                  data = rows;
                  res.json(data);
              }else{
                  data = 'No data Found..';
                  res.json(data);
              }
  })

} )

app.put('/reclamation/:id/:etat', (req, res)=>{
  const id = req.params.id;
  const etat = req.params.etat;

  connection.query("UPDATE reclamation SET reclamation.etat='"+etat+"' where reclamation.id_reclamation = '"+id+"';", (error, results, fields) => {
    if (error) throw error;
    res.send("done")
  })
})


// app.post('/user', (req,res)=>{

//     const data =req.body;
//     connection.query("INSERT INTO users SET?",data,(error,results,fields)=>{
//      if (error) throw error ;
//      res.send(req.body)
//      connection.end();


//     }



//     );
    
 

    
// });



//   app.get('/users',function(req,res){
//     var data = {
//         "Data":""
//     };
   
//     connection.query("SELECT * from users",function(err, rows, fields){
//         if(rows.length != 0){
//             data["Data"] = rows;
//             res.json(data);
//         }else{
//             data["Data"] = 'No data Found..';
//             res.json(data);
//         }
//     });
// });

app.listen(PORT, () => {
    console.log("Server started listening on PORT : " + PORT);
  });
