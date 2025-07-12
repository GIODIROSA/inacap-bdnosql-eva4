const express = require("express");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//RUTA PRUEBA
app.get("/", (req, res) => {
    res.json({mensaje: "Proyecto funcionando correctamente"});
});


module.exports = app;

