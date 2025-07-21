
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/gym-app/',
  locale: undefined,
  routes: undefined,
  entryPointToBrowserMapping: {},
  assets: {
    'index.csr.html': {size: 1409, hash: '3ef054cea872d15d8a06edcdf504bf88bb9fb603f160163006e467805ecf255c', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 1491, hash: 'acd7c7e6b80738783680be67e7db3ed3a22a20453e345eab966332561b6da02a', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'styles-7QHFXQUZ.css': {size: 2253, hash: 'AF2Bys9YQsk', text: () => import('./assets-chunks/styles-7QHFXQUZ_css.mjs').then(m => m.default)}
  },
};
