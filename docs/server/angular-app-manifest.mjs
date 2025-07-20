
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/',
  locale: undefined,
  routes: undefined,
  entryPointToBrowserMapping: {},
  assets: {
    'index.csr.html': {size: 1401, hash: '4aae75a13ddcde35d0c23f8495f3c4649d2ad440973e8abac06a57669e97cf0b', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 1483, hash: '97038f3938b44a0de631b00ab139a4aa58be6f86f80933fed1bac3a4e2e47af9', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'styles-7QHFXQUZ.css': {size: 2253, hash: 'AF2Bys9YQsk', text: () => import('./assets-chunks/styles-7QHFXQUZ_css.mjs').then(m => m.default)}
  },
};
