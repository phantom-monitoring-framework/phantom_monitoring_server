var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var os = require("os");
var elasticsearch = require('elasticsearch');
var elastic = new elasticsearch.Client({
  host: 'localhost:9400',
  log: 'error'
});

/* basics */
var routes = require('./routes/v1/index');
var workflows = require('./routes/v1/workflows');
var experiments = require('./routes/v1/experiments');
var configs = require('./routes/v1/configs');

/* metrics details */
var metrics = require('./routes/v1/metrics');
var profiles = require('./routes/v1/profiles');
var runtime = require('./routes/v1/runtime');
var statistics = require('./routes/v1/statistics');

/* dreamcloud: TOD change accordingly for PHANTOM */
var deployments = require('./routes/v1/dreamcloud/deployments');
var energy = require('./routes/v1/dreamcloud/energy');
var progress = require('./routes/v1/dreamcloud/progress');
var report = require('./routes/v1/dreamcloud/report');
var resources = require('./routes/v1/dreamcloud/resources');
var status = require('./routes/v1/dreamcloud/status');
var summary = require('./routes/v1/dreamcloud/summary');

var app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.set('elastic', elastic);
app.set('version', '02.02.17');
var port = '3040',
  hostname = os.hostname();
// redirect backend hostname to front-end
//hostname = hostname.replace('be.excess-project.eu', 'mf.excess-project.eu');
app.set('mf_server', 'http://' + hostname + ':' + port + '/v1');
app.set('pwm_idx', 'power_dreamcloud');

app.use(logger('combined', {
  skip: function (req, res) { return res.statusCode < 400; }
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/* URL paths */
app.use('/', routes);
app.use('/v1/mf', routes);
app.use('/v1/mf/workflows', workflows);
app.use('/v1/mf/experiments', experiments);
app.use('/v1/mf/configs', configs);
app.use('/v1/mf/metrics', metrics);
app.use('/v1/mf/profiles', profiles);
app.use('/v1/mf/runtime', runtime);
app.use('/v1/mf/statistics', statistics);

/* following URL paths are TOD */
app.use('/v1/mf/deployments', deployments);
app.use('/v1/mf/energy', energy);
app.use('/v1/mf/progress', progress);
app.use('/v1/mf/report', report);
app.use('/v1/mf/resources', resources);
app.use('/v1/mf/status', status);
app.use('/v1/mf/summary', summary);

/* catch 404 and forward to error handler */
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  next(err);
});

// development error handler
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    var error = {};
    error.error = err;
    res.json(error);
  });
}

// production error handler
app.use(function(err, req, res, next) {
  var error = {};
  error.error = err;
  res.json(error);
});

module.exports = app;
