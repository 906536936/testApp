/**
 * node ./test/server.js
 */

const UserAgent = require('koa-useragent');
const Koa = require('koa');
const app = new Koa();
const Router = require('koa-router')
const staticServe = require('koa-static');
const logger = require('koa-logger');
const path = require('path');
const exec = require('child_process').exec;
// 配置路由
let router = new Router();

router.post('/query', async (ctx) => {

}).post('/query-fail', async (ctx) => {

});

// 静态资源目录对于相对入口文件server.js的路径
const staticPath = path.join(__dirname, './nodeviews');
// 装载路由
app.use(logger())
    .use(UserAgent)
    .use(router.routes())
    .use(router.allowedMethods())
    .use(staticServe(staticPath, {
        index: 'jshack.html',
        setHeaders: function (res, path,stat) {
            if (path.indexOf('futu5xframe') > -1){
                // res.setHeader('X-Frame-Options', 'sameorigin');
                res.setHeader('X-Frame-Options', 'allow-from http://webtouch.com:3000/');
            } else if (path.indexOf('futu5csp') > -1){
                res.setHeader('Content-Security-Policy', 'frame-ancestors https://*.futunn.com https://*.futu5.com http://webtouch.com/');
                // res.setHeader('Content-Security-Policy', 'frame-ancestors https://*.futunn.com https://*.futu5.com http://webtouch.com:3000/');
            }

        }
    }));

// 启动server并打开默认链接
app.listen(3000, () => {

    url = 'http://localhost:3000/index.html';
    exec('opener ' + url, function (err, stdout, stderr) {
        console.log(stdout);
    });

    console.log('start on http://localhost:3000');
});
