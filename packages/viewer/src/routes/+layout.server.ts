import main from '../../public/refs/heads/main.json'

const bundleHost = import.meta.env.VITE_BUNDLE_HOST

export const load = () => {
  if (bundleHost?.includes('localhost')) {
    return main
  }
}
