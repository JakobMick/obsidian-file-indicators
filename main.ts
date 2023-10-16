import { App, Plugin, PluginSettingTab, Setting, } from 'obsidian';

interface FileIndicatorsSettings {
	defaultColor: string;
    defaultShape: string;
    indicators: (Indicator)[]
}

interface Indicator {
    dataPath: string;
    color: string;
    shape: string
}

const DEFAULT_SETTINGS: FileIndicatorsSettings = {
	defaultColor: '#8A5CF5',
    defaultShape: 'CIRCLE',
    indicators: [],
}

export default class FileIndicatorsPlugin extends Plugin {
	settings: FileIndicatorsSettings;

	async onload() {
		await this.loadSettings();
        
        this.loadIndicators();

		this.addSettingTab(new FileIndicatorsSettingTab(this.app, this));
	}

	onunload() {
        this.unloadIndicators();
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

    loadIndicators() {
        this.settings.indicators.forEach((i) => this.addIndicatorCSS(i))
    }
    
    unloadIndicators() {
        this.settings.indicators.forEach((i) => this.removeIndicatorCSS(i))
    }

    addIndicatorCSS(indicator: Indicator) {
        const item = document.querySelector(".workspace-leaf-content[data-type='file-explorer'] .tree-item-self[data-path='" + indicator.dataPath + "']>.tree-item-inner");
        item?.addClass("indicator");
        if(indicator.shape == "SQUARE") item?.addClass("indicator-square");
        if(indicator.shape == "SQUIRCLE") item?.addClass("indicator-squircle");
        item?.setAttribute("style", "--indicator-color: " + indicator.color);
    }

    removeIndicatorCSS(indicator: Indicator) {
        const item = document.querySelector(".workspace-leaf-content[data-type='file-explorer'] .tree-item-self[data-path='" + indicator.dataPath + "']>.tree-item-inner");
        item?.removeClass("indicator", "indicator-square", "indicator-quircle");
        item?.removeAttribute("style");
    }
}

class FileIndicatorsSettingTab extends PluginSettingTab {
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
        .setName('Add new indicator')
        .addButton(button => {
            button.setIcon('plus')
            .setTooltip('Create a new indicator')
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
        setting.setClass('file-indicators-list')

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

        setting.addButton(button => {
            button.onClick(async () => {
                setting.clear();
                setting.settingEl.remove();
                this.plugin.removeIndicatorCSS(indicator);
                this.plugin.settings.indicators.remove(indicator);
                await this.plugin.saveSettings();
            })
            .setTooltip('Delete indicator')
            .setIcon('trash-2');
        });
    }
}
