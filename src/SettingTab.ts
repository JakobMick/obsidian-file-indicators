import { App, Platform, PluginSettingTab, Setting } from 'obsidian';

import FileIndicatorsPlugin from './main';
import Indicator, { IndicatorShape } from './indicator';

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
                .addOptions(IndicatorShape)
                .setValue(this.plugin.settings.defaultShape)
                .onChange(async (value) => {
					this.plugin.settings.defaultShape = value as IndicatorShape;
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

        this.plugin.settings.indicators.forEach((indicator, index) => {
            this.addIndicatorListOption(containerEl, indicator, index);
        });
	}

    async addIndicatorListOption(containerEl: HTMLElement, indicator: Indicator, index: number | undefined = undefined) {
        const setting = new Setting(containerEl)
        setting.setClass('indicator-list-item')

        setting.addColorPicker(colorpicker => colorpicker
            .setValue(indicator.color)
            .onChange(async (value) => {
                this.plugin.removeIndicatorCSS(indicator);

                if (index !== undefined) {
                    this.plugin.settings.indicators[index].color = value.toString();
                    this.plugin.addIndicatorCSS(this.plugin.settings.indicators[index]);
                }

                await this.plugin.saveSettings();
            }));

        setting.addText(text => {
            text.setPlaceholder('Data path')
            .setValue(indicator.dataPath)
            .onChange(async (value) => {
                this.plugin.removeIndicatorCSS(indicator);

                if (index !== undefined) {
                    this.plugin.settings.indicators[index].dataPath = value;
                    this.plugin.addIndicatorCSS(this.plugin.settings.indicators[index]);
                }

                await this.plugin.saveSettings();
            });
        });

        setting.addDropdown(dropdown => dropdown
            .addOptions(IndicatorShape)
            .setValue(indicator.shape)
            .onChange(async (value) => {
                this.plugin.removeIndicatorCSS(indicator);

                if (index !== undefined) {
                    this.plugin.settings.indicators[index].shape = value as IndicatorShape;
                    this.plugin.addIndicatorCSS(this.plugin.settings.indicators[index]);
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
