# π-base 

Utilities for viewing and editing the π-base data repository in VSCode.

## Publishing

We follow the [recommended](https://code.visualstudio.com/api/working-with-extensions/publishing-extension#prerelease-extensions) scheme of even minor versions for stable releases and odd minor versions for pre-releases, though this is not (yet) supported by tooling.

```bash
# == Publish a prerelease ==
# Bump version and ensure it's at 0.1.x
pnpm run publish:preview

# == Publish a stable release ==
# Bump version and ensure it's at 0.2.x
pnpm run publish
```

## TODOs

This is an early release. Before a 1.x release, we will need to

- Support a reference provider (dual to definition provider)
  - This may be a good time to look at the parser async problem; do we already need to scan and load the whole local repo?
- Smooth out the build process (and in particular, make sure that changes can be published by the org)
  - Add tests
- Unify logic between core, compile, and here
- Add editing features as discussed in [this issue](https://github.com/pi-base/web/issues/5)
- Update the README and CHANGELOG for the extension
- Address inlined TODOs

<!--TODO
## Features

Describe specific features of your extension including screenshots of your extension in action. Image paths are relative to this README file.

For example if there is an image subfolder under your extension project workspace:

\!\[feature X\]\(images/feature-x.png\)

> Tip: Many popular extensions utilize animations. This is an excellent way to show off your extension! We recommend short, focused animations that are easy to follow.

## Requirements

If you have any requirements or dependencies, add a section describing those and how to install and configure them.

## Extension Settings

Include if your extension adds any VS Code settings through the `contributes.configuration` extension point.

For example:

This extension contributes the following settings:

* `myExtension.enable`: Enable/disable this extension.
* `myExtension.thing`: Set to `blah` to do something.
-->
