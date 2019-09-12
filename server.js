var http           = require('http'),
    config         = require('./server/config'),
    express        = require('express'),
    bodyParser     = require('body-parser'),
    methodOverride = require('method-override'),
    path           = require('path'),
    knex           = require('knex')(config.knex_options)
    ;

console.log("Connecting to ", config.knex_options);

/********************* APP SETUP *****************************/

app = express();
server = http.createServer(app);

logger = {
  debug: config.debug,
  warn: config.warn,
  error: config.error
};


app.use(bodyParser());
app.use(methodOverride());

app.use(express.static(path.join(__dirname, 'client/')));

// Logging
app.use(function(req, res, next) {
  logger.debug(req.method, req.url);
  next();
});

app.use(function(err, req, res, next) {
  logger.error(err.stack);
  res.status(500).send(err.message);
});


/********************* ROUTES *****************************/
// Simple hack to only allow admin to load the admin page.

var contactTable = 'salesforceapp';

app.get('/resource/contacts', function(req, res) {
  knex(contactTable).select().where(knex.raw('email is not null')).orderBy('lastname').limit(50).then(function(rows) {
    res.json(rows);
  }).catch(function(err) {
    console.log(err);
    res.status(500).send(err);
  });
});

app.get('/resource/contacts/:contactId', function(req, res) {
  knex(contactTable).select().where({id: req.params.contactId}).then(function(rows) {
    if (rows.length > 0) {
      res.json(rows[0]);
    } else {
      res.json({});
    }
  });
});

app.post('/resource/contacts', function(req, res) {
  knex(contactTable).where({id: req.body.id}).update(req.body).then(function() {
    res.send('OK');
  }).catch(function(err) {
    res.status(500).send(err);
  });
});

/********************* SERVER STARTT *****************************/

app.set('port', process.env.PORT || 5000);

server.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});
