*Looking for pi-Base's data? Head over to [`pi-base/data`](https://github.com/pi-base/data)
or learn more on our [wiki](https://github.com/pi-base/data/wiki)!*

---

[![test](https://github.com/pi-base/web/actions/workflows/test.yaml/badge.svg)](https://github.com/pi-base/web/actions/workflows/test.yaml)
[![e2e](https://github.com/pi-base/web/actions/workflows/e2e.yaml/badge.svg)](https://github.com/pi-base/web/actions/workflows/e2e.yaml)

Software monorepo for the [π-base](https://github.com/pi-base) project.

# What's this?

**π-base** is software supporting the formalization of mathematical
results that can be expressed in terms of *objects*, the *properties*
they satisfy, and the *theorems* that guarantee the presence of which 
properites imply the others.

Its main implementation lives at
<https://topology.pi-base.org>, modeling research in
[general topology](https://en.wikipedia.org/wiki/General_topology).

A fork is being developed at <https://github.com/pi-base-topos> in support
of [topos theory](https://en.wikipedia.org/wiki/Topos).

*(Researchers who are interested in contributing to these databases
likely want to visit <https://github.com/pi-base/data> or
<https://github.com/pi-base-topos/data> directly, or connect with us
via the [`code4math` Zulip](https://code4math.zulipchat.com/).)*

Four node packages are maintained as part of this monorepo:

-   `packages/compile`:
    Compiles, checks, and publishes a data bundle based upon a repository
    of formalized results expressed in Markdown/YAML.
-   `packages/viewer`:
    Web application for browsing/querying formalized results, featuring
    automated deduction. (i.e. <https://topology.pi-base.org>)
-   `packages/vscode`:
    Web extension for VS Code to aid contributors and reviewers to a
    π-Base compatible repository of formalized results
-   `packages/core`:
    Shared data model for all π-Base utilities.

# Getting Started

The easiest way to try the software out is to use a Codespace; either press
the comma (`,`) key on your keyboard while logged into GitHub on this page,
or press the below button.

[![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://github.com/codespaces/new?hide_repo_select=true&ref=main&repo=391656710)

A web version of VS Code with all the necessary dependencies and
software installed will be made available to you, as well as a
copy of the general topology repository at
<https://github.com/pi-base/data>. A new tab will automatically
open to your development preview of the web viewer application,
and changes you make to your copy of the data repository will
be immediately recompiled and available in the viewer upon refresh.

# Documentation

Various guides are available in the [`doc`](./doc/) directory.

# 🔗s

-   [π-base data](https://github.com/pi-base/data):
    peer-reviewed repository of formalized results in general topology,
    available online at <https://topology.pi-base.org>
-   [Sentry](https://james-dabbs.sentry.io/projects/pi-base/?project=5251960&statsPeriod=30d):
    error monitoring

# Copyright and License

Copyright 2014-2024 James Dabbs, [licensed for free public use](./LICENSE.md).
