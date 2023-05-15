import App from './components/App.svelte'
import * as errors from './errors'

const host = window.location.host
const dev = host.match(/(dev(elopment)?[.-]|localhost)/) !== null
const errorEnv = ['topology.pi-base.org', 'topology.pages.dev'].includes(host)
  ? 'production'
  : host.includes('pages.dev')
  ? 'deploy-preview'
  : 'dev'

const app = new App({
  target: document.body,
  props: {
    showDev: dev,
    errorHandler: dev
      ? errors.log()
      : errors.sentry(
          'https://0fa430dd1dc347e2a82c413d8e3acb75@o397472.ingest.sentry.io/5251960',
          errorEnv,
        ),
  },
})

export default app
