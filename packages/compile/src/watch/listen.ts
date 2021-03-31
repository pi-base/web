import chokidar from 'chokidar'

import { rootDirectories } from '../load'

export default function listen(repo: string, onChange: (path: string) => void) {
  chokidar
    .watch(rootDirectories(repo), {
      ignored: [
        /(^|[\/\\])\../, // dotfiles
        /node_modules/,
      ],
      persistent: true,
    })
    .on('change', onChange)
}
