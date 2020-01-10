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
const bodyParser = require('koa-body');
const exec = require('child_process').exec;
const views = require('koa-views');
const fs = require('fs');


// 静态资源目录对于相对入口文件server.js的路径
const staticPath = path.join(__dirname, './nodeviews');
// 装载路由
app.use(logger())
    .use(UserAgent)
    .use(bodyParser({
    }))
    .use(views(staticPath, {
        map: {
            html: 'ejs'
        }
    }))
    .use(staticServe(staticPath, {
        index: 'jshack.html',
    }));

// 配置路由
let router = new Router();
router.get('/view', async (ctx) => {
    // console.log(ctx.request);
    ctx.cookies.set(
        'name',
        'hello world',
        {
            domain: 'localhost',  // 写cookie所在的域名
            path: '/',       // 写cookie所在的路径
            maxAge: 10 * 60 * 1000, // cookie有效时长
            httpOnly: false,  // 是否只用于http请求中获取
            sameSite: 'strict'
        }
    );
    ctx.cookies.set(
        'location',
        'cn',
        {
            domain: 'localhost',  // 写cookie所在的域名
            path: '/',       // 写cookie所在的路径
            maxAge: 10 * 60 * 1000, // cookie有效时长
            httpOnly: false,  // 是否只用于http请求中获取
            sameSite: 'lax'
        }
    );
    ctx.cookies.set(
        'test',
        'test',
        {
            domain: 'localhost',  // 写cookie所在的域名
            path: '/',       // 写cookie所在的路径
            maxAge: 10 * 60 * 1000, // cookie有效时长
            httpOnly: false  // 是否只用于http请求中获取
        }
    );
    await ctx.render('view.html');
});

app.use(router.routes())
    .use(router.allowedMethods())

// 启动server并打开默认链接
app.listen(3000, () => {
    console.log('start on http://localhost:3000');
});
