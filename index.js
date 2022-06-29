
const express =require('express');
const cors = require('cors');
var mysql = require('mysql');
const { 
  v1: uuidv1,
  v4: uuidv4,
} = require('uuid');

const PORT =  process.env.PORT || 5000;

const app = express();

const { Pool } = require('pg');
const pool = new Pool({
  poolString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

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

//------------------------------db------------------------------

app.get('/db', async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM patient');
    const results = { 'results': (result) ? result.rows : null};
    res.send(results );
    client.release();
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
})

app.post('/db', async (req, res) => {
  try {
    const patient = await pool.connect();
    const result = await patient.query('INSERT INTO patient VALUES('+req['id_patient']+', '+req['last_name']+', '+req['first_name']+', '+req['phone']+', '+req['num_ass_soc']+', '+req['date_naissance']+','+req['wilaya']+','+req['password']+', '+req['adresse']+')');
    const results = { 'results': (result) ? result.rows : null};
    res.send(results);
    client.release();
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
})

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
    pool.query("Select * from patient where patient.num_ass_soc =  '"+credential+"' AND patient.password = '"+password+"' ;", data, (error, rows, fields)=>{
      if (error) throw error
      if (rows.length !=0) {
        res.send(rows[0])
      } else {  
        
        res.send('credentials not found')
      }
    })
  } else
  if (type == 'ets') {
    pool.query("Select * from ETS where ETS.phone =  '"+credential+"' AND ETS.password = '"+password+"' ;", data, (error, rows, fields)=>{
      if (error) throw error
      if (rows.length !=0) {
        res.send(rows)
      } else {
        res.send('credentials not found')
      }
    })
  } else
  if (type == 'staff_cnas') {
    pool.query("Select * from staff_cnas where staff_cnas.code =  '"+credential+"' AND staff_cnas.password = '"+password+"' ;", data, (error, rows, fields)=>{
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


  let values = []
  const colums = ["id_patient" , "last_name" , "first_name" , "phone" , "num_ass_soc", 'date_naissance', 'wilaya', 'password', 'adresse' ]
  let colStr = ""
  colums.map(el=>{
    values.push(data[el])
    colStr += ", "+el
  })
  colStr = colStr.slice(1);
  const text = `INSERT INTO patient(${colStr}) VALUES($1, $2,$3, $4 , $5, $6, $7, $8, $9) RETURNING *`;

  pool.query(text, values, (err, response) => {
    if (err) {
      console.log(err.stack)
    } else {
      res.status(200).send(response.rows[0])
    }
  })
}  )

app.get('/patient', function(req, res)  {
  console.log("getting patients");
  var data = {
    "": ""
  };

  pool.query("SELECT * FROM patient;", (error, rows, fields) => {
    if (error) throw error
    if(rows.length != 0){
                  data = rows;
                  res.json(data['rows']);
              }else{
                  data = 'No data Found..';
                  res.json(data);
              }
  })

} )


app.get('/patient/:id', function(req, res)  {
  const id = req.params.id;
  pool.query(`SELECT * FROM patient where patient.id_patient = '"+id+"'`, (error, results, fields) => {
    if (error) throw error
    if (results.length !=0) {
      res.send(results['rows'][0]);
    } else {
      res.send("no data found")
    }
  })

} )


//----------------------------demande--------------------------------------------

app.post('/demande', (req, res) =>{

  const data = req.body;
   var dem = {
    ...data,
    "id_demande": uuidv1(),
  }

  console.log(dem);

  pool.query("INSERT INTO demande SET? ", dem, (error, results, fields) => {
    if (error) throw error;
    
    res.send(req.body);
  })

}  )

app.get('/demande', (req, res) => {
  var data = {}
  var patient = {}

  pool.query("Select * from demande; ", (error, results)=> {
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
  var patient = {};

  pool.query("SELECT * FROM demande where demande.id_demande = '"+id+"';", (error, rows, fields) => {
    if (error) throw error;
    if(rows.length != 0){
                  data = rows[0];
                  console.log("'"+data['id_patient']+"'");
                  pool.query("select * from patient where patient.id_patient = '"+data['id_patient']+"';", (error, results, fields) =>{
                    if (error) throw error
                    if (results.length != 0) {
                      patient = results[0];              
                      var finalData = {
                        ...data,
                        "patient": patient
                      };
                      console.log(finalData);
                      res.json(finalData);
                    }
                  } )    
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
    let month = date_ob.getMonth() + 1;
    let today = date_ob.getFullYear() + '-' + month + '-'+  date_ob.getDate() ;
    console.log(today);
    sqlReq = "UPDATE demande SET demande.etat='"+etat+"' AND demande.date_validation='"+today+"' where demande.id_demande = '"+id+"';";
  }

  pool.query(sqlReq, (error, results, fields) => {
    if (error) throw error;
    res.send("done")
  })
})

app.get('/demande/patient/:id', (req, res)=>{
  const id = req.params.id;
  const etat = req.params.etat;

  pool.query("SELECT * FROM demande where demande.id_patient = '"+id+"';", (error, results, fields) => {
    if (error) throw error;
    if (results.length != 0) {
      //TODO: get patient object too
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
   var ets = {
    ...data,
    "id_ets": uuidv1(),
  }

  console.log(ets);

  pool.query("INSERT INTO ETS SET?", ets, (error, results, fields)=>{
    if (error) throw error
    res.send(req.body);
  })

})


app.get('/ets', (req, res) => {
  var data = {}


  pool.query("Select * from ETS;", data, (error, rows, fields)=> {
    if (error) throw error;
    if (rows.length != 0) {
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

  pool.query("SELECT * FROM ETS where ETS.id_ets = '"+id+"';", (error, rows, fields) => {
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
   var prop = {
    ...data,
    "id_proposition": uuidv1(),
  }

  console.log(prop);

  pool.query("INSERT INTO proposition SET?", prop, (error, results, fields)=>{
    if (error) throw error
    res.send(req.body);
  })

})

app.get('/proposition', (req, res) => {
  var data = {}

  pool.query("Select * from proposition", data, (error, rows, fields)=> {
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
  res.setTimeout(12000)
  const id = req.params.id;
  var proposition = {
    "": ""
  };

  var ets = {
    "":""
  };

  var demande = {

  };

  var patient = {

  };



  pool.query("SELECT * FROM proposition where proposition.id_proposition = '"+id+"' ;", (error, rows, fields) => {
    if(rows.length != 0){
      proposition = rows[0];
      pool.query("SELECT * FROM ETS where '"+proposition["id_ets"]+"' = ETS.id_ets ;", (error2, rows2, fields2 ) => {
        if (error2) throw error2
        ets = rows2[0];
      })  ;


      pool.query("SELECT * FROM demande where '"+proposition["id_demande"]+"' = demande.id_demande ;", (error2, rows2, fields2 ) => {
        if (error2) throw error2
        demande = rows2[0];
      })  ;

      pool.query("SELECT * FROM patient where '"+demande["id_patient"]+"' = patient.id_patient ;", (error2, rows2, fields2 ) => {
        if (error2) throw error2
        patient = rows2[0];
      })  ;

      var demandeFinal = {
        ...demande,
        "patient": patient, 
      }

      

      var finalData = {
        "id_proposition": propostion['id_proposition'],
        "ets": ets,
        "demandeFinal": demandeFinal,
        
      }
              }else{
                  data = 'No data Found..';
                  res.json(data);
              }
  })

} )




app.put('/proposition/:id/:etat', (req, res)=>{
  const id = req.params.id;
  const etat = req.params.etat;

  pool.query("UPDATE proposition SET proposition.etat='"+etat+"' where proposition.id_proposition = '"+id+"';", (error, results, fields) => {
    if (error) throw error;
    res.send("done")
  })
})


//-----------------------staf cnas--------------------------

app.post('/staff_cnas', (req, res) =>{

  const data = req.body;
   var st_cnas = {
    ...data,
    "id_staff_cnas": uuidv1(),
  }

  console.log(st_cnas);

  pool.query("INSERT INTO staff_cnas SET? ", st_cnas, (error, results, fields) => {
    if (error) throw error;
    res.send(req.body); 
  })

}  )

app.get('/staff_cnas', function(req, res)  {
  var data = {
    "": ""
  };

  pool.query("SELECT * FROM staff_cnas;", (error, rows, fields) => {
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

  pool.query("SELECT * FROM staff_cnas where staff_cnas.id_staff_cnas = '"+id+"';", (error, rows, fields) => {
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
   var recl = {
    ...data,
    "id_reclamation": uuidv1(),
  }

  console.log(recl);

  pool.query("INSERT INTO reclamation SET? ", recl, (error, results, fields) => {
    if (error) throw error;
    res.send(req.body);
  })

}  )

app.get('/reclamation', function(req, res)  {
  var data = {
    "": ""
  };

  pool.query("SELECT * FROM reclamation;", (error, rows, fields) => {
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

  pool.query("SELECT * FROM reclamation where reclamation.id_reclamation = '"+id+"';", (error, rows, fields) => {
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

  pool.query("UPDATE reclamation SET reclamation.etat='"+etat+"' where reclamation.id_reclamation = '"+id+"';", (error, results, fields) => {
    if (error) throw error;
    res.send("done")
  })
})


//----------------------------demande--------------------------------------------

app.post('/transport', (req, res) =>{

  const data = req.body;
   var trans = {
    ...data,
    "id_patient": uuidv1(),
  }

  console.log(trans);

  pool.query("INSERT INTO transport SET? ", trans, (error, results, fields) => {
    if (error) throw error;
    res.send(req.body);
  })

}  )

app.get('/transport', (req, res) => {
  var data = {}

  pool.query("Select * from transport", data, (error, rows, fields)=> {
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

  pool.query("SELECT * FROM transport where transport.id_transport = '"+id+"' ;", (error, rows, fields) => {
    if(rows.length != 0){
      transport = rows[0];
      pool.query("SELECT * FROM ETS where '"+transport["id_ets"]+"' = ETS.id_ets ;", (error2, rows2, fields2 ) => {
        if (error2) throw error2
        ets = rows2[0];
      })  ;

      pool.query("SELECT * FROM proposition where '"+transport["id_proposition"]+"' = proposition.id_proposition ;", (error2, rows2, fields2 ) => {
        if (error2) throw error2;
        proposition = rows2[0];
      })  ;


      pool.query("SELECT * FROM demande where '"+proposition["id_demande"]+"' = demande.id_demande ;", (error2, rows2, fields2 ) => {
        if (error2) throw error2
        demande = rows2[0];
      })  ;

      pool.query("SELECT * FROM patient where '"+demande["id_patient"]+"' = patient.id_patient ;", (error2, rows2, fields2 ) => {
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

  pool.query("UPDATE demande SET demande.etat='"+etat+"' where demande.id_demande = '"+id+"';", (error, results, fields) => {
    if (error) throw error;
    res.send("done")
  })
})

///////////////////////////////////////////////////////

function getDemandeById(id) {
  pool.query("SELECT * FROM demande where demande.id_demande = '"+id+"';", (error, results, fields) => {
    if (error) throw error
    if (results.length !=0) {
      let data = results[0];
      let patient = getPatientById(data["id_patient"]);
      finalData = {
        ...data,
        "patient": patient
      }

      return finalData;
    } else {
      return -1;
    }
  })
}

function getPatientById(id) {
  pool.query("SELECT * FROM patient where patient.id_patient = '"+id+"';", (error, results, fields) => {
    if (error) throw error
    if (results.length !=0) {
      console.log(results);
      return results[0];
    } else {
      return -1;
    }
  })
}

//-----------------------------------------------------



app.listen(PORT, () => {
    console.log("Server started listening on PORT : " + PORT);
  });
