import { App, PluginSettingTab, Setting, addIcon } from 'obsidian';

import FileIndicatorsPlugin from './main';
import Indicator from './indicator';
import IndicatorModal, { IndicatorModalAction } from './IndicatorModal';
import ShapeModal from './ShapeModal';
import { CustomShape, getShapeNames } from './shape';

export default class FileIndicatorsSettingTab extends PluginSettingTab {
	plugin: FileIndicatorsPlugin;

	constructor(app: App, plugin: FileIndicatorsPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
        this.containerEl.empty();

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
                .addOptions(getShapeNames(this.plugin.settings.shapes))
                .setValue(this.plugin.settings.defaultShape)
                .onChange(async (value: string) => {
					this.plugin.settings.defaultShape = value;
					await this.plugin.saveSettings();
				}));

        const shapeListEl = createEl('div');
        shapeListEl.addClass('fi-list');
        shapeListEl.addClass('shape-list');

        new Setting(this.containerEl)
        .setName('Custom shapes')
        .addButton(button => {
            button.setButtonText('Add new shape')
            .onClick(() => {

                new ShapeModal(
                    this.plugin, 
                    () => {
                        shapeListEl.empty()
                        this.loadShapeList(shapeListEl);
                    },
                ).open();
            });
        })

        this.containerEl.appendChild(shapeListEl);

        this.loadShapeList(shapeListEl);

        const indicatorListEl = createEl('div');
        indicatorListEl.addClass('fi-list');
        indicatorListEl.addClass('indicator-list');

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
                    () => {
                        indicatorListEl.empty()
                        this.loadIndicatorList(indicatorListEl);
                    },
                ).open();
            });
        })

        this.containerEl.appendChild(indicatorListEl);

        this.loadIndicatorList(indicatorListEl);
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
        const setting = new Setting(containerEl);
        setting.setClass('fi-list-item');

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
            .addOptions(getShapeNames(this.plugin.settings.shapes))
            .setValue(indicator.shape as string)
            .onChange(async (value: string) => {
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

    loadShapeList(containerEl: HTMLElement) {
        this.plugin.settings.shapes.forEach((shape) => {
            this.addShapeListItem(containerEl, shape);
        });
    }

    addShapeListItem(
        containerEl: HTMLElement, 
        shape: CustomShape,
    ) {
        const setting = new Setting(containerEl);
        setting.setClass('fi-list-item');

        const id = 'file-indicators-' + shape.id;

        addIcon(id, shape.svg);

        setting.addExtraButton(button => {
            button.setIcon(id)
                .setDisabled(true);
        });

        setting.addText(text => {
            text.setPlaceholder('Shape name')
            .setValue(shape.name)
            .setDisabled(true);
        });

        setting.addText(text => {
            text.setPlaceholder('SVG')
            .setValue(shape.svg)
            .setDisabled(true);
        });

        setting.addExtraButton(button => {
            button.onClick(async () => {
                setting.clear();
                setting.settingEl.remove();
                await this.plugin.removeShape(shape);
            })
            .setTooltip('Delete shape')
            .setIcon('trash-2');
        });
    }
}
