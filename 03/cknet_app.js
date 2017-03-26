/*
  Bind C/C++ methods to interact with the test app.
*/
Module.postRun = [
  (function () {
    Module.project_name  = Module.cwrap('project_name', 'string', []);
    Module.project_desc  = Module.cwrap('project_desc', 'string', []);
    Module.canvas_resize = Module.cwrap('canvas_resize', 'number' ['number', 'number']);

    Module.canvas_resize(window.innerWidth, window.innerHeight);

    // Set the Title of the test
    // document.getElementById("project_name").innerHTML = Module.project_name();
    // document.getElementById("project_desc").innerHTML = Module.project_desc();
  })
];


/*
  Callback to resize the context.
*/
window.addEventListener ("resize", function (e) {
    Module.canvas_resize(window.innerWidth, window.innerHeight);
}, true);
