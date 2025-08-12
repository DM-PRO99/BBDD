const express = require("express");
const app = express();
const mysql = require("mysql");
const cors = require("cors");


app.use(cors());
app.use(express.json());


const db = mysql.createConnection({ 
    host:"localhost",
    user: "root",
    password: "",
    database: "empleados_crud"
});

app.post("/create",(req,res)=>{
    const nombre =req.body.nombre;
    const edad =req.body.edad;
    const país =req.body.país;
    const cargo =req.body.cargo;
    const anios =req.body.anios;

    db.query("INSERT INTO empleados(nombre,edad,país.cargo,anios) VALUES (?,?,?,?,?)",[nombre,edad,país,cargo,anios]
    (err,result)=>{
        if(err){
            console.log(err);
        }else {
            res.send("Empleado registrado con éxito!!");
        }
    }
    );
});


app.get("/empleados",(req,res)=>{
    db.query("SELECT * FROM empleados",
    (err,result)=>{
        if(err){
            console.log(err);
        }else {
            res.send(result);
        }
    }
    );
});


app.listen(3001,()=>{
    console.log("Corriendo en el puerto 3001")
})