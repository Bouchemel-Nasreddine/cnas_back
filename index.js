
const express =require('express');
const cors = require('cors');
var mysql      = require('mysql');


// var mysql = require('mysql');
const PORT =  process.env.PORT || 5000;

const app = express();

// var connection = mysql.createConnection({
//   host     : 'localhost',
//   user     : 'root',
//   password : '',
//   database :'cnas'
// });

  
var connection = mysql.createPool({
  host: 'remotemysql.com',
  user: 'jOPNYDXCCM',
  password: 'BzAUV81FUK',
  database: 'jOPNYDXCCM',
  connectionLimit: 100,
  multipleStatements: true,
})

// connection.connect((err)=>{
//     if(err)
//     {
//         console.warn("error in connection")
//     }
// });

// var connection;

// function handleDisconnect() {
//   connection = mysql.createConnection({
//        host     : 'localhost',
//        user     : 'root',
//        password : '',
//        database :'cnas'
//      }); // Recreate the connection, since
//                                                   the old one cannot be reused.

//   connection.connect(function(err) {              // The server is either down
//     if(err) {                                     // or restarting (takes a while sometimes).
//       console.log('error when connecting to db:', err);
//       setTimeout(handleDisconnect, 2000); // We introduce a delay before attempting to reconnect,
//     }                                     // to avoid a hot loop, and to allow our node script to
//   });                                     // process asynchronous requests in the meantime.
//                                           If you're also serving http, display a 503 error.
//   connection.on('error', function(err) {
//     console.log('db error', err);
//     if(err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
//       handleDisconnect();                         // lost due to either server restart, or a
//     } else {                                      // connnection idle timeout (the wait_timeout
//       throw err;                                  // server variable configures this)
//     }
//   });
// }

// handleDisconnect();


// const whitelist = ['https://localhost:5000', 'https://cnas2cs.herokuapp.com']
// const corsOptions = {
//  origin: function (origin, callback) {
//     if(!origin){//for bypassing postman req with  no origin
//       return callback(null, true);
//     }
//     if (whitelist.indexOf(origin) !== -1) {
//       callback(null, true);
//     } else {
//       callback(new Error('Not allowed by CORS'))
//     }
//   }
// }

//midedleware

app.use(cors());
app.use(express.json());

app.use(function(req, res, next) {
  //console.log(req);
  res.setTimeout(2000);
  res.setHeader('Access-Control-Allow-Origin', "*");
  res.header('Access-Control-Allow-Methods', 'GET, POST ,PUT, OPTIONS, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Max-Age', '86400');
  next();
});

//------------------------root---------------------------------------

app.get('/', (req, res)=>{
  res.send('hello to our cnas project, Chinotech is wishing you a good day :)')
})

//-------------------------auth--------------------------------------

app.post('/login', (req, res)=> {
  console.log("login");
  const data = req.body
  const type = req.body['type'];
  const credential = req.body['credential']
  const password = req.body['password']


  if (type == 'patient') {
    connection.query("Select * from patient where patient.num_ass_soc =  '"+credential+"' AND patient.password = '"+password+"' ;", data, (error, rows, fields)=>{
      if (error) throw error
      if (rows.length !=0) {
        res.send(rows[0])
      } else {  
        
        res.send('credentials not found')
      }
    })
  } else
  if (type == 'ets') {
    connection.query("Select * from ETS where ETS.phone =  '"+credential+"' AND ETS.password = '"+password+"' ;", data, (error, rows, fields)=>{
      if (error) throw error
      if (rows.length !=0) {
        res.send(rows)
      } else {
        res.send('credentials not found')
      }
    })
  } else
  if (type == 'staff_cnas') {
    connection.query("Select * from staff_cnas where staff_cnas.code =  '"+credential+"' AND staff_cnas.password = '"+password+"' ;", data, (error, rows, fields)=>{
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

  const data = req.body;

  connection.query("INSERT INTO patient SET? ", data, (error, results, fields) => {
    if (error) throw error;
    res.send(req.body);
  })

}  )

app.get('/patient', function(req, res)  {
  console.log("getting patients");
  var data = {
    "": ""
  };

  connection.query("SELECT * FROM patient;", (error, rows, fields) => {
    if (error) throw error
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

  connection.query("SELECT * FROM patient where patient.id_patient = '"+id+"';", (error, rows, fields) => {
    if(rows.length != 0){
                  data = rows[0];
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

  connection.query("Select * from demande; ", (error, results)=> {
    if (error) throw error;
    console.log(results);
    if (results.length != 0) {
      data = results;
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
    if (error) throw error;
    console.log(rows)
    if(rows.length != 0){
                  data = rows[0];
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

  var sqlReq ;

  if (etat != 'valide') {
    sqlReq = "UPDATE demande SET demande.etat='"+etat+"' where demande.id_demande = '"+id+"';";
  } else {
    let date_ob = new Date();
    let month = date_ob.getMonth + 1;
    let today = date_ob.getFullYear + '-' + month + '-'+  date_ob.getDate ;
    print(today);
    sqlReq = "UPDATE demande SET demande.etat='"+etat+"' AND demande.date_validation='"+today+"' where demande.id_demande = '"+id+"';";
  }

  connection.query(sqlReq, (error, results, fields) => {
    if (error) throw error;
    res.send("done")
  })
})

app.get('/demande/patient/:id', (req, res)=>{
  const id = req.params.id;
  const etat = req.params.etat;

  connection.query("SELECT * FROM demande where demande.id_patient = '"+id+"';", (error, results, fields) => {
    if (error) throw error;
    if (rows.length != 0) {
    res.send(results);
    }
    else {
      res.send('[');
    }
  })
})


//-------------------ets--------------------------------

app.post('/ets', (req, res) => {
  const data = req.body;

  connection.query("INSERT INTO ETS SET?", data, (error, results, fields)=>{
    if (error) throw error
    res.send(req.body);
  })

})


app.get('/ets', (req, res) => {
  var data = {}


  connection.query("Select * from ETS;", data, (error, rows, fields)=> {
    if (error) throw error;
    console.log("ddddd")
    if (rows.length != 0) {
      console.log("ddddd")
      data = rows;
    } else {
      data = [];
    }
    console.log(data)
    res.json(data);
  })

} )



app.get('/ets/:id', function(req, res)  {
  const id = req.params.id;
  var data = {
    "": ""
  };

  connection.query("SELECT * FROM ETS where ETS.id_ets = '"+id+"';", (error, rows, fields) => {
    if(rows.length != 0){
                  data = rows[0];
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


//----------------------------demande--------------------------------------------

app.post('/transport', (req, res) =>{

  const data = req.body;

  connection.query("INSERT INTO transport SET? ", data, (error, results, fields) => {
    if (error) throw error;
    res.send(req.body);
  })

}  )

app.get('/transport', (req, res) => {
  var data = {}

  connection.query("Select * from transport", data, (error, rows, fields)=> {
    if (error) throw error;
    if (rows.length != 0) {
      data = rows;
    } else {
      data = [];
    }
    res.send(data);
  })

} )



app.get('/transport/:id', function(req, res)  {
  res.setTimeout(12000)
  const id = req.params.id;
  var transport = {
    "": ""
  };

  var ets = {
    "":""
  };

  var demande = {

  };

  var patient = {

  };

  var proposition = {};

  connection.query("SELECT * FROM transport where transport.id_transport = '"+id+"' ;", (error, rows, fields) => {
    if(rows.length != 0){
      transport = rows[0];
      connection.query("SELECT * FROM ETS where '"+transport["id_ets"]+"' = ETS.id_ets ;", (error2, rows2, fields2 ) => {
        if (error2) throw error2
        ets = rows2[0];
      })  ;

      connection.query("SELECT * FROM proposition where '"+transport["id_proposition"]+"' = proposition.id_proposition ;", (error2, rows2, fields2 ) => {
        if (error2) throw error2;
        proposition = rows2[0];
      })  ;


      connection.query("SELECT * FROM demande where '"+proposition["id_demande"]+"' = demande.id_demande ;", (error2, rows2, fields2 ) => {
        if (error2) throw error2
        demande = rows2[0];
      })  ;

      connection.query("SELECT * FROM patient where '"+demande["id_patient"]+"' = patient.id_patient ;", (error2, rows2, fields2 ) => {
        if (error2) throw error2
        patient = rows2[0];
      })  ;

      var demandeFinal = {
        ...demande,
        "patient": patient, 
      }

      var propositionFinal = {
        ...proposition,
        "demande": demandeFinal,
      }

      var finalData = {
        "id_transport": transport['id_transport'],
        "ets": ets,
        "propositionFinal": propositionFinal,
        
      }
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



//-----------------------------------------------------



app.listen(PORT, () => {
    console.log("Server started listening on PORT : " + PORT);
  });
