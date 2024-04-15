# edkrepo plugin
## Description

EdkRepo is a Python based multiple repository workflow utility developed to simplify the usage and adoption of a multiple git repository workspace model such as the one used by FST for firmware development. EdkRepo reduces the complexity of development workflows while integrating seamlessly with Git, Gerrit/GitHub code review interfaces and continuous integration systems.

Open source link: [edk2-edkrepo](https://github.com/tianocore/edk2-edkrepo)

## Installation and Requirements
### Requirements
1. vscode: https://code.visualstudio.com/download
2. node.js: https://nodejs.org/en/download/current
3. python package
    > pip install */requirements.txt 
### Install from source code

1. Clone project
   > git clone https://github.com/mingyueliang/edkrepo.git
2. Install Dependencies
   > npm install
3. Pack
   > npm install vsce  
   > cd projectName  
   > vsce package
4. Install 
   > code --install-extension *.xsix
### Install from .xsix
- Download from Releases
  link: [edkrepo 0.0.1](https://github.com/mingyueliang/edkrepo/releases)
- Install
  > code --install-extension *.xsix

## Features

Describe specific features of your extension including screenshots of your extension in action. Image paths are relative to this README file.



## Requirements

If you have any requirements or dependencies, add a section describing those and how to install and configure them.

## Extension Settings

Include if your extension adds any VS Code settings through the `contributes.configuration` extension point.

For example:

This extension contributes the following settings:

* `myExtension.enable`: Enable/disable this extension.
* `myExtension.thing`: Set to `blah` to do something.

## Known Issues

Calling out known issues can help limit users opening duplicate issues against your extension.

## Release Notes

Users appreciate release notes as you update your extension.

### 1.0.0

Initial release of ...

### 1.0.1

Fixed issue #.

### 1.1.0

Added features X, Y, and Z.

---

## Following extension guidelines

Ensure that you've read through the extensions guidelines and follow the best practices for creating your extension.

* [Extension Guidelines](https://code.visualstudio.com/api/references/extension-guidelines)

## Working with Markdown

You can author your README using Visual Studio Code. Here are some useful editor keyboard shortcuts:

* Split the editor (`Cmd+\` on macOS or `Ctrl+\` on Windows and Linux).
* Toggle preview (`Shift+Cmd+V` on macOS or `Shift+Ctrl+V` on Windows and Linux).
* Press `Ctrl+Space` (Windows, Linux, macOS) to see a list of Markdown snippets.

## For more information

* [Visual Studio Code's Markdown Support](http://code.visualstudio.com/docs/languages/markdown)
* [Markdown Syntax Reference](https://help.github.com/articles/markdown-basics/)

**Enjoy!**
