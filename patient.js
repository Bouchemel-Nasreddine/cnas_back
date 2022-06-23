
const router = require('express').Router();

// const app = express();

// app.use(express.json());

// app.post('/patient', (req, res) =>{

//     const data = req.body;
  
//     connection.query("INSERT INTO patient SET? ", data, (error, results, fields) => {
//       if (error) throw error;
//       res.send(req.body);
//       connection.end();
//     })
  
//   }  )
  
//   app.get('/patient', function(req, res)  {
//     var data = {
//       "": ""
//     };
  
//     connection.query("SELECT * FROM Patient;", (error, rows, fields) => {
//       if(rows.length != 0){
//                     data = rows;
//                     res.json(data);
//                 }else{
//                     data = 'No data Found..';
//                     res.json(data);
//                 }
//     })
  
//   } )