🎉 Welcome to your Codespace

# Compiling a bundle locally

Your codespace starts a `compile process` process which watches
`/workspaces/data` and serves its contents at `localhost:3141/refs/heads/(:branch)`,
consistent with the production S3 API.

Once the server has started and the first build has finished, you can verify the
result by running

```bash
$ curl -s localhost:3141/refs/heads/master | jq '.version'
```

# Running the viewer

```bash
# in packages/viewer
# compile .js and .css assets
npm run build

# serve assets and expose them externally
npm run start -- --host
```

## Troubleshooting

### Starting the compile process manually

```bash
/workspaces/web $ pnpm run --filter compile dev
```

### Cannot find module '@pi-base/core'

The `@pi-base/core` package is expected to be built and available in the local
workspace. It should be pre-built when the workspace is created, but you can
rebuild it with.

```bash
/workspaces/web $ pnpm run --filter core build
```