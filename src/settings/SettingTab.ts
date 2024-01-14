import { App, PluginSettingTab, Setting, addIcon } from 'obsidian';

import FileIndicatorsPlugin from 'src/main';
import { Indicator, IndicatorModal, IndicatorModalAction } from 'src/indicators';
import { CustomShape, ShapeModal, getShapeNames } from 'src/shapes';
import { DEFAULT_SETTINGS } from 'src/settings';

export class FileIndicatorsSettingTab extends PluginSettingTab {
	plugin: FileIndicatorsPlugin;
    defaultShapeEL: Setting;
    shapeListEl: HTMLElement;
    indicatorListEl: HTMLElement;

	constructor(app: App, plugin: FileIndicatorsPlugin) {
		super(app, plugin);
		this.plugin = plugin;
        this.shapeListEl = createEl('div');
        this.indicatorListEl = createEl('div');
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

        this.defaultShapeEL = new Setting(this.containerEl);
        this.loadDefaultShape();

        this.shapeListEl.addClass('fi-list');
        this.shapeListEl.addClass('shape-list');

        new Setting(this.containerEl)
        .setName('Custom shapes')
        .addButton(button => {
            button.setButtonText('Add new shape')
            .onClick(() => {

                new ShapeModal(
                    this.plugin, 
                    () => {
                        this.shapeListEl.empty()
                        this.loadShapeList();
                        this.loadDefaultShape();
                        this.loadIndicatorList();
                    },
                ).open();
            });
        })

        this.containerEl.appendChild(this.shapeListEl);
        this.loadShapeList();

        this.indicatorListEl.addClass('fi-list');
        this.indicatorListEl.addClass('indicator-list');

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
                        this.indicatorListEl.empty()
                        this.loadIndicatorList();
                    },
                ).open();
            });
        })

        this.containerEl.appendChild(this.indicatorListEl);

        this.loadIndicatorList();
	}

    loadDefaultShape() {
        this.defaultShapeEL.clear()
        .setName('Default shape')
        .addDropdown(dropdown => dropdown
            .addOptions(getShapeNames(this.plugin.settings.shapes))
            .setValue(this.plugin.settings.defaultShape.toString())
            .onChange(async (value: string) => {
                this.plugin.settings.defaultShape = value;
                await this.plugin.saveSettings();
            }));
    }

    loadIndicatorList() {
        this.indicatorListEl.replaceChildren();
        this.plugin.settings.indicators.forEach((indicator, index) => {
            this.addIndicatorListItem(indicator, index);
        });
    }

    addIndicatorListItem(
        indicator: Indicator, 
        index: number | undefined = undefined,
    ) {
        const setting = new Setting(this.indicatorListEl);
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

    loadShapeList() {
        this.shapeListEl.replaceChildren();
        this.plugin.settings.shapes.forEach((shape) => {
            this.addShapeListItem(shape);
        });
    }

    addShapeListItem(shape: CustomShape) {
        const setting = new Setting(this.shapeListEl);
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
                const conflictingIndicators: Indicator[] = this.plugin.settings.indicators.filter((indicator) => indicator.shape == shape.id);

                if(conflictingIndicators.length > 0) {
                    conflictingIndicators.forEach(async (indicator) => await this.plugin.removeIndicator(indicator));
                    this.loadIndicatorList();
                }

                if(this.plugin.settings.defaultShape == shape.id) {
                    this.plugin.settings.defaultShape = DEFAULT_SETTINGS.defaultShape;
                    this.loadDefaultShape();
                }
                
                setting.clear();
                setting.settingEl.remove();
                await this.plugin.removeShape(shape);
            })
            .setTooltip('Delete shape')
            .setIcon('trash-2');
        });
    }
}
