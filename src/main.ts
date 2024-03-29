import { Plugin } from 'obsidian';

import { binaryInsert } from 'binary-insert';

import { Indicator, IndicatorModal, IndicatorModalAction } from 'src/indicators';
import { FileIndicatorsSettings, DEFAULT_SETTINGS, FileIndicatorsSettingTab } from 'src/settings';
import { CustomShape, getShapeSvg } from 'src/shapes';

export default class FileIndicatorsPlugin extends Plugin {
	settings: FileIndicatorsSettings;
    styleEl: HTMLElement;

	async onload() {
		await this.loadSettings();

		this.app.workspace.onLayoutReady(() => {
			setTimeout(() => {
                this.styleEl = this.app.workspace.containerEl.createEl('style', {});
                this.styleEl.setAttribute('id', 'indicator-css');

                this.loadIndicators();
            }, 0);
		});

        this.registerEvent(this.app.workspace.on('file-menu', (menu, file) => {
            const indicator = this.settings.indicators.find((indicator) => indicator.dataPath == file.path);

            if(!indicator) {
                menu.addItem(item => item
                    .setTitle('Add indicator')
                    .setIcon('plus')
                    .onClick(() => {
                        const indicator = {
                            dataPath: file.path,
                            color: this.settings.defaultColor,
                            shape: this.settings.defaultShape,
                        };
        
						new IndicatorModal(this, indicator).open();
                    }));
            } else {
                menu.addItem(item => item
                    .setTitle('Edit indicator')
                    .setIcon('pencil')
                    .onClick(() => new IndicatorModal(this, indicator, IndicatorModalAction.EDIT).open()));
                menu.addItem(item => item
                    .setTitle('Remove indicator')
                    .setIcon('minus')
                    .onClick(async () => await this.removeIndicator(indicator)));
            }
        }));

        this.registerEvent(this.app.vault.on('rename', async (file, oldPath) => {
            const indicator = this.settings.indicators.find((indicator) => indicator.dataPath == oldPath);
            
            if(indicator !== undefined) {
                await this.removeIndicator(indicator);
                indicator.dataPath = file.path;
                await this.addIndicator(indicator);
            }
        }));

        this.registerEvent(this.app.vault.on('delete', async (file) => {
            const indicator = this.settings.indicators.find((indicator) => indicator.dataPath == file.path);
            
            if(indicator !== undefined) {
                await this.removeIndicator(indicator);
            }
        }));
    
        this.addCommand({
            id: 'add-indicator',
            name: 'Add indicator',
            callback: () => {
                const i = {
                    dataPath: '',
                    color: this.settings.defaultColor,
                    shape: this.settings.defaultShape,
                };

                new IndicatorModal(this, i).open();
            },
        });
    
        this.addCommand({
            id: 'add-indicator-to-active-file',
            name: 'Add indicator to active file',
			checkCallback: (checking: boolean) => {
                const file = this.app.workspace.getActiveFile();
                
				if (file) {
                    const indicator = this.settings.indicators.find((indicator) => indicator.dataPath == file.path);
                    
                    if(!indicator) {

                        if (!checking) {
                            const i = {
                                dataPath: file.path,
                                color: this.settings.defaultColor,
                                shape: this.settings.defaultShape,
                            };
    
                            new IndicatorModal(this, i).open();
                        }
    
                        return true;
                    }
				}
			},
        });
    
        this.addCommand({
            id: 'edit-indicator-of-active-file',
            name: 'Edit indicator of active file',
			checkCallback: (checking: boolean) => {
                const file = this.app.workspace.getActiveFile();
                
				if (file) {
                    const indicator = this.settings.indicators.find((indicator) => indicator.dataPath == file.path);

                    if(indicator) {

                        if (!checking) {
                            new IndicatorModal(this, indicator, IndicatorModalAction.EDIT).open();
                        }
    
                        return true;
                    }
				}
			},
        });
    
        this.addCommand({
            id: 'remove-indicator-of-active-file',
            name: 'Remove indicator of active file',
			checkCallback:  (checking: boolean) => {
                const file = this.app.workspace.getActiveFile();
                
				if (file) {
                    const indicator = this.settings.indicators.find((indicator) => indicator.dataPath == file.path);

                    if(indicator) {

                        if (!checking) {
                            this.removeIndicator(indicator);
                        }
    
                        return true;
                    }
				}
			},
        });

		this.addSettingTab(new FileIndicatorsSettingTab(this.app, this));
	}

	onunload() {
        this.styleEl.remove();
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

    async addIndicator(indicator: Indicator) {
        this.addIndicatorCSS(indicator);
        binaryInsert(this.settings.indicators, indicator, (a, b) => a.dataPath.localeCompare(b.dataPath));
        await this.saveSettings();
    }

    async removeIndicator(indicator: Indicator) {
        this.removeIndicatorCSS(indicator);
        const index = this.settings.indicators.findIndex((i) => i.dataPath == indicator.dataPath);
        this.settings.indicators.remove(this.settings.indicators[index])
        await this.saveSettings();
    }

    addIndicatorCSS(indicator: Indicator) {
        this.styleEl.appendText(this.getIndicatorCSS(indicator) + '/**/');
    }

    removeIndicatorCSS(indicator: Indicator) {
        const css = this.styleEl.getText().split('/**/')

        const indicatorCSS = css.find((value) => value.contains(`'${indicator.dataPath}'`));

        css.remove(indicatorCSS ?? '');

        this.styleEl.setText(css.join('/**/'));
    }

    getIndicatorCSS(indicator: Indicator) {
        const shapeUrl = 'data:image/svg+xml,' + encodeURIComponent(getShapeSvg(indicator.shape, this.settings.shapes));
        return `.tree-item-self[data-path='${indicator.dataPath}']:not([data-path='/'])>.tree-item-inner { padding-inline-start: calc(var(--indicator-size) + var(--size-2-3)); } .tree-item-self[data-path='${indicator.dataPath}']>.tree-item-inner:before { content: ""; -webkit-mask-image: url("${shapeUrl}"); mask-image: url("${shapeUrl}"); background-color: ${indicator.color}; }`;
    }

    async addShape(shape: CustomShape) {
        binaryInsert(this.settings.shapes, shape, (a, b) => a.name.localeCompare(b.name));
        await this.saveSettings();
    }

    async removeShape(shape: CustomShape) {
        const index = this.settings.shapes.findIndex((i) => i.name == shape.name);
        this.settings.shapes.remove(this.settings.shapes[index])
        await this.saveSettings();
    }
}

