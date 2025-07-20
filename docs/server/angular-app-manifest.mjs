
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/',
  locale: undefined,
  routes: undefined,
  entryPointToBrowserMapping: {},
  assets: {
    'index.csr.html': {size: 1401, hash: '6ced831f53d629e63e7b3d7c074293b1eaa75741c4a13cc5c77e94d2c7f03c11', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 1483, hash: '20f39e88b46952b996fd2c9873c5bb1dde1cd23f78cce040255b4f2e7e56d825', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'styles-7QHFXQUZ.css': {size: 2253, hash: 'AF2Bys9YQsk', text: () => import('./assets-chunks/styles-7QHFXQUZ_css.mjs').then(m => m.default)}
  },
};
