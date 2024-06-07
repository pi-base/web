# π-base 

Utilities for viewing and editing the π-base data repository in VSCode.

## Publishing

Run `pnpm run publish` to publish. (`prepublish` handles bundling with `pnpm`, which is otherwise unsupported by `vsce`.)

## TODOs

This is an early release. Before a 1.0-level release, we will need to

- Smooth out the build process (and in particular, make sure that changes can be published by the org)
- Add tests
- Unify logic between core, compile, and here
- Add editing features as discussed in [this issue](https://github.com/pi-base/web/issues/5)
- Update the README and CHANGELOG for the extension
- Address inlined TODOs, like error handling

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
