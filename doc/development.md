See [`codespace/welcome.md`](./codespace/welcome.md) for details on working in a
codespace.

# Building

All packages should support scripts for

- `build` - compile the package once
- `dev` - watch and recompile on changes (serving, if applicable)

Since we `workspace:` link the `@pi-base/core` package, a normal workflow would
be something like

```bash
# In one terminal / tab
# Watch the core package for changes and rebuild
<root>/packages/core $ pnpm run dev

# In another terminal, for whichever package(s) you're actively developing
<root>/packages/<package> $ pnpm run dev
```
