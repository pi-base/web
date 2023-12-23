# 🎉 Welcome to your Codespace

Shortly after your codespace starts, you should see three running background
processes –

- `compile` – watches `/workspaces/web/data` and serves its contents at
  `localhost:3141/refs/heads/(:branch)`, consistent with the production S3 API.
- `core` – watches `/workspaces/web/core` and recompiles on changes.
- `viewer` – watches and servers `/workspaces/web/packages/viewer`, rebuilding
  and reloading on changes.

# Usage

## Viewing the Web UI

As the viewer starts up, you may see an `Open in Browser` popup. You can always
access the browser preview by going to the `Ports` tab, and clicking the
`Open in Browser` globe icon for port `5173`.

You must also set port `3143` to "Public" uisng the Ports tab. If you make changes
to local data, you must manually refresh them using the Advanced tab of the viewer.

## Checking Compiled Data

In a console run

```bash
$ curl -s localhost:3141/refs/heads/master | jq '.version'
```

## Other Guides

See [`/workspaces/web/doc`](../doc/codespace/) for other guides on development
and testing processes.
