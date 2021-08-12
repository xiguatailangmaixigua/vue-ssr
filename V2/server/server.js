const Koa = require('koa');
const Router = require('koa-router');
const serve = require('koa-static');
const path = require('path');
const fs = require('fs');

const { createBundleRenderer } = require('vue-server-renderer');
const backendApp = new Koa();
const frontendApp = new Koa();
const backendRouter = new Router();
const frontendRouter = new Router();

const serverBundle = require(path.resolve(__dirname, '../dist/vue-ssr-server-bundle.json'))
const clientManifest = require(path.resolve(__dirname, '../dist/vue-ssr-client-manifest.json'));
const template = fs.readFileSync(path.resolve(__dirname, '../dist/index.ssr.html'), 'utf-8');

// createBundleRenderer 优点：1. source map 支持 2. 热重载 3. 内联css 4. manifest自动推断出预加载
const renderer = createBundleRenderer(serverBundle, {
    runInNewContext: false,
    template: template,
    clientManifest: clientManifest
});

// 后端server
backendApp.use(serve(path.resolve(__dirname, '../dist')));

backendRouter.get('*', (ctx, next) => {
    console.log('ctx', ctx);
    console.log('url', ctx.url);

    let context = {
        url: ctx.url
    };

    const ssrStream = renderer.renderToStream(context);
    ctx.status = 200;
    ctx.type = 'html';
    ctx.body = ssrStream;
})

backendApp
    .use(backendRouter.routes())
    .use(backendRouter.allowedMethods());

backendApp.listen(3000, () => {
    console.log('服务器端渲染地址： http://localhost:3000');
});

// 前端Server
frontendApp.use(serve(path.resolve(__dirname, '../dist')));

frontendRouter.get('/index', (ctx, next) => {
    let html = fs.readFileSync(path.resolve(__dirname, '../dist/index.html'), 'utf-8');
    ctx.type = 'html';
    ctx.status = 200;
    ctx.body = html;
});

frontendApp
    .use(frontendRouter.routes())
    .use(frontendRouter.allowedMethods());

frontendApp.listen(3001, () => {
    console.log('浏览器端渲染地址： http://localhost:3001');
});