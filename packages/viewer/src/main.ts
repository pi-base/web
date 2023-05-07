import App from './components/App.svelte'
import { ExternalLink } from './elements/ExternalLink'
import { InternalLink } from './elements/InternalLink'
import * as errors from './errors'

const dev =
  window.location.host.match(/(dev(elopment)?[.-]|localhost)/) !== null

customElements.define('external-link', ExternalLink)
customElements.define('internal-link', InternalLink)

const app = new App({
  target: document.body,
  props: {
    showDev: dev,
    errorHandler: dev
      ? errors.log()
      : errors.sentry(
          'https://0fa430dd1dc347e2a82c413d8e3acb75@o397472.ingest.sentry.io/5251960',
        ),
  },
})

export default app
