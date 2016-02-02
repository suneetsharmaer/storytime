var express = require('express');
var fs = require('fs');
var http = require('http');

//lodash
var _ = require('lodash');

//"hound" module contains both client-side ("Hound") and server-side ("HoundNode") parts of SDK
var hound = require('hound').HoundNode;

//flickr API
/*
var flickr = require("flickrapi"),
    flickrOptions = {
      api_key: "076a4c69f691e1440ae67d1858beb9c0",
      secret: "99ad15f675ce0830"
    };
 
flickr.tokenOnly(flickrOptions, function(error, flickr) {
  // we can now use "flickr" as our API object,
  // but we can only call public methods and access public data
});*/

/*
var Flickr = require("flickrapi"),
    flickrOptions = {
      api_key: "076a4c69f691e1440ae67d1858beb9c0",
      secret: "99ad15f675ce0830"
    };

var flickrOptions = {
      api_key: "076a4c69f691e1440ae67d1858beb9c0",
      secret: "99ad15f675ce0830",
      user_id: "74214425@N02",
      access_token: "72157663895266375-dc6ba94aa1dcd2d5",
      access_token_secret: "59e615eeb7aecb8b"
    }*/

var Flickr = require("flickrapi"),
    flickrOptions = {
      api_key: "076a4c69f691e1440ae67d1858beb9c0",
      secret: "99ad15f675ce0830",
      user_id: "74214425@N02",
      access_token: "72157663895266375-dc6ba94aa1dcd2d5",
      access_token_secret: "59e615eeb7aecb8b"
    };

Flickr.authenticate(flickrOptions, function(error, flickr) {
  // we can now use "flickr" as our API object
});


/*
var flickr = new Flickr({
  api_key: "076a4c69f691e1440ae67d1858beb9c0"
});*/

//parse arguments
var argv = require('minimist')(process.argv.slice(2));

//config file
var configFile = argv.config || 'config';
var config = require(__dirname + '/' + configFile);

//express app
var app = express();
var publicFolder = argv.public || 'public';
app.use(express.static(__dirname + '/' + publicFolder));

//authenticates voice search requests
app.get('/voiceSearchAuth', hound.createVoiceAuthHandler({ 
  clientId:  config.clientId, 
  clientKey: config.clientKey
}));

//sends the request to Hound backend with authentication headers
app.get('/textSearchProxy', hound.createTextProxyHandler({ 
  clientId:  config.clientId, 
  clientKey: config.clientKey
}));

//ssl credentials
//https server
var httpServer = http.createServer(app);
var port = config.port || 3000;
httpServer.listen(port, function() {
  console.log("HTTPS server running on port", port);
  console.log("Open https://localhost:" + port, "in the browser to view the Web SDK demo");
});