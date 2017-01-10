/*
  Sets up a Module and the inital canvas size.
*/
var canvas = document.getElementById("canvas");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var Module = {};
Module.canvas = canvas;
