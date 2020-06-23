var express = require('express');
var appExp=express();
const { app,net,BrowserWindow } = require('electron')
const path = require('path');
let win;
let serverProcess;
appExp.get('/',function(req,response){

    var api_response="";
    const request = net.request({
      method: 'GET',
      protocol: 'https:',
      hostname: 'jsonplaceholder.typicode.com',
      port: 443,
      path: '/todos/1'
    })
      request.on('response', (response) => {
        console.log(response.statusCode);
        console.log(`STATUS: ${response.statusCode}`)
        console.log(`HEADERS: ${JSON.stringify(response.headers)}`)
        response.on('data', (chunk) => {
          console.log(`BODY: ${chunk}`)
        })
        
        response.on('end', () => {
          if(response.statusCode ===200){
            console.log("I am creating window 222");
            createWindow();
          }
          console.log('No more data in response.')
        })
      
      })
      request.end()
      response.send("call success");

});
appExp.listen('1338',function(req,reresponses){
   console.log("listening to port 1338");
});
function createWindow() {
  let platform = process.platform;
  console.log('Platform :'+ platform);
  var jarPath = app.getAppPath() + '/demo/lib/electron_poc.jar';
   if(platform === 'win32') {
    // var exec=require('./executejar');
    // serverProcess=require('child_process');
  

 
    serverProcess = require('child_process')
    .spawn('cmd.exe', ['/c', 'demo.bat'],
        {
           cwd: app.getAppPath() + '/demo/bin'
      });
      console.log(serverProcess);
} else {
    serverProcess = require('child_process')
        .spawn(app.getAppPath() + '/demo/bin/demo');
}
if (!serverProcess) {
  console.error('Unable to start server from ' + app.getAppPath());
  app.quit();
  return;
}
serverProcess.stdout.on('data', function (data) {
  console.log('Server: ' + data);
});
console.log("Server PID: 68" + serverProcess.pid);

  let appUrl = 'http://localhost:8080';
  const openWindow = function () {
    mainWindow = new BrowserWindow({
        title: 'Demo',
        width: 640,
        height: 480
    });

    mainWindow.loadURL(appUrl);

    mainWindow.on('closed', function () {
        mainWindow = null;
    });

    mainWindow.on('close', function (e) {
        if (serverProcess) {
            e.preventDefault();

            // kill Java executable
            const kill = require('tree-kill');
            kill(serverProcess.pid, 'SIGTERM', function () {
                console.log('Server process killed');

                serverProcess = null;

                mainWindow.close();
            });
        }
    });
};
const startUp = function () {
  const requestPromise = require('minimal-request-promise');

  requestPromise.get(appUrl).then(function (response) {
      console.log('Server started!');
      openWindow();
  }, function (response) {
    console.log(response);
      console.log('Waiting for the server start...');

      setTimeout(function () {
          startUp();
      }, 200);
  });
};

startUp();
}
