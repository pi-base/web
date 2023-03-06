🎉 Welcome to your Codespace

# Compiling a bundle locally

```bash
# Start a server that listens for changes to /workspaces/data, builds a bundle
# and serves it compatibly with the production S3 backend.
/workspaces/web $ pnpm run --filter compile dev
```

Verify that the server is working by opening another terminal in the codespace
and running

```bash
$ curl -s localhost:3141/refs/heads/master | jq '.version'
```

## Troubleshooting

### Cannot find module '@pi-base/core'

The `@pi-base/core` package is expected to be built and available in the local
workspace. It should be pre-built when the workspace is created, but you can
rebuild it with.

```bash
/workspaces/web $ pnpm run --filter core build
```