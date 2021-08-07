export default {
  '*.{js,ts}': ['eslint --cache --fix', 'prettier --write'],
  '*.{css,yml,md}': 'prettier --write',
}
