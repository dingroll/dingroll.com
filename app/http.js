var express = require('express');
var serveStatic = require('serve-static');
var bodyParser = require('body-parser');
var session = require('express-session');
var RedisStore = require('connect-redis')(session);

function appCtor(cfg, pool) {
  var app = express();

  // app-wide default page title
  app.locals.title = 'DingRoll';

  app.set('trust proxy', true);
  app.set('view engine', 'jade');
  app.set('views', __dirname + '/views');
  app.use(serveStatic(__dirname + '/static'));
  app.use(serveStatic(__dirname + '/icons'));
  app.use(serveStatic(__dirname + '/manifests'));
  app.use(session({
    store: new RedisStore({
      host: cfg.redis.hostname,
      port: cfg.redis.port}),
    secret: cfg.env.SECRET_KEY_BASE,
    resave: false,
    saveUninitialized: false
  }));
  app.use(function (req, res, next) {
    if (!req.session) {
      return next(new Error("couldn't find sessions"));
    }
    else return next();
  });
  app.use(bodyParser.urlencoded({ extended: false }));

  app.get('/', function(req, res) {
    return res.render('index');
  });
  app.get('/m', function(req, res) {
    return res.render('messaging');
  });

  return app;
}

module.exports = appCtor;
