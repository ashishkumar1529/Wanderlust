const express = require("express");
const app =express(); 
const session = require("express-sessions");

app.listen(3000, () => {
    console.log("server is listening to the port");
})