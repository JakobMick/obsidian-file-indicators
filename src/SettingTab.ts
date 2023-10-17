import { App, PluginSettingTab, Setting, } from 'obsidian';

import FileIndicatorsPlugin from './main';
import Indicator from './indicator';

export default class FileIndicatorsSettingTab extends PluginSettingTab {
	plugin: FileIndicatorsPlugin;

	constructor(app: App, plugin: FileIndicatorsPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();

        new Setting(containerEl)
            .setName('Default color').addColorPicker(colorpicker => colorpicker
                .setValue(this.plugin.settings.defaultColor)
                .onChange(async (value) => {
					this.plugin.settings.defaultColor = value.toString();
					await this.plugin.saveSettings();
				}));

        new Setting(containerEl)
            .setName('Default shape')
            .addDropdown(dropdown => dropdown
                .addOptions({
                    "CIRCLE": "Circle",
                    "SQUIRCLE": "Squircle",
                    "SQUARE": "Square"
                })
                .setValue(this.plugin.settings.defaultShape)
                .onChange(async (value) => {
					this.plugin.settings.defaultShape = value;
					await this.plugin.saveSettings();
				}));

        new Setting(containerEl)
        .setName('Indicators')
        .addButton(button => {
            button.setButtonText('Add new indicator')
            .onClick(async () => {
                const indicator = {
                    dataPath: "",
                    color: this.plugin.settings.defaultColor,
                    shape: this.plugin.settings.defaultShape,
                };

                this.addIndicatorListOption(containerEl, indicator);
                this.plugin.settings.indicators.push(indicator);
                await this.plugin.saveSettings();
            });
        })

        this.plugin.settings.indicators.forEach(indicator => {
            this.addIndicatorListOption(containerEl, indicator);
        });
	}

    async addIndicatorListOption(containerEl: HTMLElement, indicator: Indicator) {
        const indicatorIndex = this.plugin.settings.indicators.indexOf(indicator);
        const setting = new Setting(containerEl)
        setting.setClass('indicator-list-item')

        setting.addColorPicker(colorpicker => colorpicker
            .setValue(indicator.color)
            .onChange(async (value) => {
                this.plugin.removeIndicatorCSS(indicator);

                if (indicatorIndex !== -1) {
                    this.plugin.settings.indicators[indicatorIndex].color = value.toString();
                    this.plugin.addIndicatorCSS(this.plugin.settings.indicators[indicatorIndex]);
                }

                await this.plugin.saveSettings();
            }));

        setting.addText(text => {
            text.setPlaceholder('Data path')
            .setValue(indicator.dataPath)
            .onChange(async (value) => {
                this.plugin.removeIndicatorCSS(indicator);

                if (indicatorIndex !== -1) {
                    this.plugin.settings.indicators[indicatorIndex].dataPath = value;
                    this.plugin.addIndicatorCSS(this.plugin.settings.indicators[indicatorIndex]);
                }

                await this.plugin.saveSettings();
            });
        });

        setting.addDropdown(dropdown => dropdown
            .addOptions({
                "CIRCLE": "Circle",
                "SQUIRCLE": "Squircle",
                "SQUARE": "Square"
            })
            .setValue(indicator.shape)
            .onChange(async (value) => {
                this.plugin.removeIndicatorCSS(indicator);

                if (indicatorIndex !== -1) {
                    this.plugin.settings.indicators[indicatorIndex].shape = value;
                    this.plugin.addIndicatorCSS(this.plugin.settings.indicators[indicatorIndex]);
                }

                await this.plugin.saveSettings();
            }));

        setting.addExtraButton(button => {
            button.onClick(async () => {
                setting.clear();
                setting.settingEl.remove();
                this.plugin.removeIndicator(indicator);
            })
            .setTooltip('Delete indicator')
            .setIcon('trash-2');
        });
    }
}
