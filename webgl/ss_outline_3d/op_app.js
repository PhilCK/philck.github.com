/*
  Bind C/C++ methods to interact with the test app.
*/
Module.postRun = [
  (function () {
    Module.test_name      = Module.cwrap('test_name', 'string', []);
    Module.test_desc      = Module.cwrap('test_desc', 'string', []);
    Module.resize_context = Module.cwrap('resize', 'number' ['number', 'number']);

    Module.resize_context(window.innerWidth, window.innerHeight);

    // Set the Title of the test
    document.getElementById("test_name").innerHTML = Module.test_name();
    document.getElementById("test_desc").innerHTML = Module.test_desc();
  })
];


/*
  Callback to resize the context.
*/
window.addEventListener ("resize", function (e) {
    Module.resize_context(window.innerWidth, window.innerHeight);
}, true);
