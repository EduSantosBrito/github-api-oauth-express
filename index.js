var express = require("express");
var cors = require("cors");
var app = express();
var config = require("./config.js");
app.use(cors());
var port = 3001;

var githubOAuth = require("github-oauth")({
  githubClient: config.GITHUB_KEY,
  githubSecret: config.GITHUB_SECRET,
  baseURL: "http://localhost:" + port,
  loginURI: "/auth/github",
  callbackURI: "/auth/github/callback"
});

app.get("/auth/github", function(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );
  res.setHeader("Access-Control-Allow-Credentials", true);
  return githubOAuth.login(req, res);
});

app.get("/auth/github/callback", function(req, res) {
  return githubOAuth.callback(req, res);
});

githubOAuth.on("error", function(err) {
  console.error("there was a login error", err);
});

githubOAuth.on("token", function(token, serverResponse) {
  serverResponse.end(JSON.stringify(token));
});

var server = app.listen(port, function() {
  console.log("Listening on port %d", server.address().port);
});
