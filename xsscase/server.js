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


// 模拟DB
let db = {
    fpath: path.join(__dirname, 'db.txt'),
    get(){
        return fs.readFileSync(this.fpath);
    },
    set(value){
        fs.writeFileSync(this.fpath, value);
    }
};

// 配置路由
let router = new Router();
router.get('/input', async (ctx) => {
    await ctx.render('input.html', {
        data: 'test'
    });
}).get('/view', async (ctx) => {
    let data = db.get();
    await ctx.render('view.html', {
        data: data
    });
}).post('/save', async (ctx) => {
    db.set(ctx.request.body.name);
    await ctx.redirect('/view');
});

app.use(router.routes())
    .use(router.allowedMethods())

// 启动server并打开默认链接
app.listen(3000, () => {

    url = 'http://localhost:3000/index.html';
    exec('opener ' + url, function (err, stdout, stderr) {
        console.log(stdout);
    });

    console.log('start on http://localhost:3000');
});
