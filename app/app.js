var koa = require('koa');
var router = require('koa-router')();
var mongoose = require('mongoose');

// local middlewares
var nunjucks = require('../middlewares/koa-nunjucks/index');

// create app
var app = koa();

// routes
var home = require('./routes/home/home');
var user = require('./routes/user/user');

mongoose.connect('mongodb://localhost:27017/kblog');
mongoose.connection.on('error', console.error.bind(console, '连接数据库失败'));

// nunjucks config
app.use(nunjucks('views', {
    noCache: process.env.NODE_ENV === 'production',
    watch: ! process.env.NODE_ENV === 'production'
}));

// run routes
home(app, router);
user(app, router);

app.listen(8080);

