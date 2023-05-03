🎉 Welcome to your Codespace

Shortly after your codespace starts, you should see three running background
processes –

- `compile` – watches `/workspaces/web/data` and serves its contents at
  `localhost:3141/refs/heads/(:branch)`, consistent with the production S3 API.
- `viewer:build` – watches `/workspaces/web/packages/viewer`, and rebuilds the  
  viewer on change.
- `viewer:serve` – serves the built viewer on the network

Note that changes to `packages/core` do not currently automatically trigger a 
rebuild of the package and its dependencies.

# Usage

## Viewing the Web UI

As the viewer starts up, you may see an `Open in Browser` popup. You can always
access the browser preview by going to the `Ports` tab, and clicking the 
`Open in Browser` globe icon for port `8080`.

## Checking Compiled Data

In a console run

```bash
$ curl -s localhost:3141/refs/heads/master | jq '.version'
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