/*
  Bind C/C++ methods to interact with the test app.
*/
Module.postRun = [
  (function () {
    Module.project_name  = Module.cwrap('demo_app_name', 'string', []);
    Module.project_desc  = Module.cwrap('demo_app_desc', 'string', []);
    Module.canvas_resize = Module.cwrap('demo_app_resize', 'number' ['number', 'number']);
    Module.project_link  = Module.cwrap('demo_app_link', 'string', []);

    /* inital resize to correct window dimentions */
    Module.canvas_resize(window.innerWidth, window.innerHeight);

    // Set the Title of the test
    var title = Module.project_name() + " - " + Module.project_desc();
    var ele = document.getElementById("project_link");
    ele.title = title;
    ele.href = Module.project_link();

    document.title = title;
  })
];


/*
  Callback to resize the context.
*/
window.addEventListener ("resize", function (e) {
    Module.canvas_resize(window.innerWidth, window.innerHeight);
}, true);
