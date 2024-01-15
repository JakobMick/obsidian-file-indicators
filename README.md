# Obsidian File Indicators

Add custom indicators to the file explorer.

<img src="https://github.com/JakobMick/obsidian-file-indicators/blob/main/screenshots/horizontal.png?raw=true">

This plugin lets you add indicators in custom shapes and colors to all your files and folders.

## How to use

Right click on any file or folder and select `Add indicator`.

**Or**

Use the `Add indicator` or `Add indicator to active file` commands.

**Or**

Go to the `File indicators` plugin settings and select `Add new indicator`.

This way you can even set an indicator at root level:

<img src="https://github.com/JakobMick/obsidian-file-indicators/blob/main/screenshots/vertical.png?raw=true">

## Custom shapes

Custom shapes must be provided as SVGs. The shapes will only be displayed in the selected color. All colors from the SVG will be ignored.

Not all SVGs will work. Some SVGs might be correctly displayed in the settings, but will not work as indicators. Or the other way around.

To add custom shapes, go to the `File indicators` plugin settings and select `Add new shape`.

Deleting a custom shape will also delete all indicators using the shape. If the deleted shape was used as the default shape, the default `Circle` shape will be set as the new default.

## Custom CSS

Because this plugin uses CSS to display the indicators it might conflict with existing CSS snippets or other plugins regarding the file explorer.

If you want to override the CSS of the `File indicators` plugin, be warned that it is subject to change and will probably get some breaking changes in the future. Stable CSS variables are planed for the next major version (2.0.0).

## How to install

1. Select `Settings`.
2. Select `Community plugins`.
3. Make sure `Restricted mode` is turned **off**.
4. Select `Browse` under `Community plugins`.
5. Search for and select the `File indicators` plugin.
6. Select `install`.
