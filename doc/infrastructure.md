# Hosting

## Viewer

The viewer is hosted by Cloudflare Pages. See [`deployment.md`](./deployment.md)
for details.

```bash
# Confirm hosting provider
$ dig topology.pi-base.org
```

## Compiler

## Data

Compiled data is [pushed to S3](https://github.com/pi-base/data/blob/6cc73f720751910ad4ede8a320c1eeff975ee5c3/.github/workflows/compile.yml#L22)
and stored in the `pi-base-bundles` bucket in the `pibase` AWS account (`893999385831`).

```bash
# Check bucket contents
$ BRANCH=master curl -s pi-base-bundles.s3.us-east-2.amazonaws.com/refs/heads/$BRANCH.json | jq '.version'
```

## Code

All code is hosted under the [pi-base org](https://github.com/pi-base) on Github.

# DNS

The `pi-base.org` domain and DNS are managed [with Namecheap](https://ap.www.namecheap.com/domains/domaincontrolpanel/dabbs.dev/domain).

```bash
# Confirm domain registrar
$ whois pi-base.org | grep "Registrar:"
```
