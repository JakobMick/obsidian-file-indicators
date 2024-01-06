import { App, PluginSettingTab, Setting } from 'obsidian';

import FileIndicatorsPlugin from './main';
import Indicator, { IndicatorShape, shapeTitleMap } from './indicator';
import IndicatorModal, { IndicatorModalAction } from './IndicatorModal';

export default class FileIndicatorsSettingTab extends PluginSettingTab {
	plugin: FileIndicatorsPlugin;

	constructor(app: App, plugin: FileIndicatorsPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
        this.containerEl.empty();

        const indicatorListEl = createEl('div');
        indicatorListEl.addClass('indicator-list');

        new Setting(this.containerEl)
            .setName('Default color').addColorPicker(colorpicker => colorpicker
                .setValue(this.plugin.settings.defaultColor)
                .onChange(async (value) => {
					this.plugin.settings.defaultColor = value.toString();
					await this.plugin.saveSettings();
				}));

        new Setting(this.containerEl)
            .setName('Default shape')
            .addDropdown(dropdown => dropdown
                .addOptions(shapeTitleMap)
                .setValue(this.plugin.settings.defaultShape)
                .onChange(async (value: IndicatorShape) => {
					this.plugin.settings.defaultShape = value;
					await this.plugin.saveSettings();
				}));

        new Setting(this.containerEl)
        .setName('Indicators')
        .addButton(button => {
            button.setButtonText('Add new indicator')
            .onClick(() => {
                const indicator = {
                    dataPath: '',
                    color: this.plugin.settings.defaultColor,
                    shape: this.plugin.settings.defaultShape,
                };

                new IndicatorModal(
                    this.plugin, 
                    indicator, 
                    IndicatorModalAction.ADD, 
                    (indicator: Indicator) => {
                        indicatorListEl.empty()
                        this.loadIndicatorList(indicatorListEl);
                    },
                ).open();
            });
        })

        this.containerEl.appendChild(indicatorListEl);

        this.plugin.settings.indicators.forEach((indicator, index) => {
            this.addIndicatorListItem(indicatorListEl, indicator, index);
        });
	}

    loadIndicatorList(containerEl: HTMLElement) {
        this.plugin.settings.indicators.forEach((indicator, index) => {
            this.addIndicatorListItem(containerEl, indicator, index);
        });
    }

    addIndicatorListItem(
        containerEl: HTMLElement, 
        indicator: Indicator, 
        index: number | undefined = undefined,
    ) {
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
            .setDisabled(true);
        });

        setting.addDropdown(dropdown => dropdown
            .addOptions(shapeTitleMap)
            .setValue(indicator.shape)
            .onChange(async (value: IndicatorShape) => {
                this.plugin.removeIndicatorCSS(indicator);

                if (index !== undefined) {
                    this.plugin.settings.indicators[index].shape = value;
                    this.plugin.addIndicatorCSS(this.plugin.settings.indicators[index]);
                }

                await this.plugin.saveSettings();
            }));

        setting.addExtraButton(button => {
            button.onClick(async () => {
                setting.clear();
                setting.settingEl.remove();
                await this.plugin.removeIndicator(indicator);
            })
            .setTooltip('Delete indicator')
            .setIcon('trash-2');
        });
    }
}
