import { Plugin } from 'obsidian';

import Indicator from './indicator';
import IndicatorModal, { IndicatorModalAction } from './IndicatorModal';
import FileIndicatorsSettingTab from './SettingTab';

interface FileIndicatorsSettings {
	defaultColor: string;
    defaultShape: string;
    indicators: (Indicator)[]
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

		this.app.workspace.onLayoutReady(() => {
			setTimeout(() => this.loadIndicators(), 0);
		});

        this.registerEvent(this.app.workspace.on("file-menu", (menu, file) => {
            const indicator = this.settings.indicators.find((indicator) => indicator.dataPath == file.path);

            if(!indicator) {
                menu.addItem(item => item
                    .setTitle("Add indicator")
                    .setIcon("plus")
                    .onClick(async () => {
                        const indicator = {
                            dataPath: file.path,
                            color: this.settings.defaultColor,
                            shape: this.settings.defaultShape,
                        };
        
						new IndicatorModal(this, indicator).open();
                    }));
            } else {
                menu.addItem(item => item
                    .setTitle("Edit indicator")
                    .setIcon("pencil")
                    .onClick(() => new IndicatorModal(this, indicator, IndicatorModalAction.EDIT).open()));
                menu.addItem(item => item
                    .setTitle("Remove indicator")
                    .setIcon("minus")
                    .onClick(async () => await this.removeIndicator(indicator)));
            }
        }));

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

    async addIndicator(indicator: Indicator) {
        this.addIndicatorCSS(indicator);
        this.settings.indicators.push(indicator);
        await this.saveSettings();
    }

    async removeIndicator(indicator: Indicator) {
        this.removeIndicatorCSS(indicator);
        const index = this.settings.indicators.findIndex((i) => i.dataPath == indicator.dataPath);
        this.settings.indicators.remove(this.settings.indicators[index])
        await this.saveSettings();
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

