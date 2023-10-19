import { normalizePath, Plugin } from 'obsidian';

import { binaryInsert } from 'binary-insert';

import Indicator, { IndicatorShape } from './indicator';
import IndicatorModal, { IndicatorModalAction } from './IndicatorModal';
import FileIndicatorsSettingTab from './SettingTab';

interface FileIndicatorsSettings {
	defaultColor: string;
    defaultShape: IndicatorShape;
    indicators: (Indicator)[]
}

const DEFAULT_SETTINGS: FileIndicatorsSettings = {
	defaultColor: '#8A5CF5',
    defaultShape: IndicatorShape.CIRCLE,
    indicators: [],
}

export default class FileIndicatorsPlugin extends Plugin {
	settings: FileIndicatorsSettings;
    styleEl: HTMLElement;

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
        this.app.workspace.containerEl.querySelector('#indicator-css')?.remove();
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

    loadIndicators() {
        const styleEl = this.app.workspace.containerEl.querySelector('#indicator-css');

        if(styleEl == null) {
            this.app.workspace.containerEl.createEl('style', {})
                .setAttribute('id', 'indicator-css')
        }

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
        const styleEl = this.app.workspace.containerEl.querySelector('#indicator-css');
        styleEl?.appendText(this.getIndicatorCSS(indicator));
    }

    removeIndicatorCSS(indicator: Indicator) {
        const styleEl = this.app.workspace.containerEl.querySelector('#indicator-css');
        
        if(styleEl != null) {
            styleEl.setText(styleEl?.getText().replace(this.getIndicatorCSS(indicator), ''));
        }
    }

    getIndicatorCSS(indicator: Indicator) {
        const normalizedPath = normalizePath(`${this.app.vault.configDir}/plugins/${this.manifest.id}/src/shapes/${indicator.shape.toLowerCase()}.svg`)
        const shapeUrl = this.app.vault.adapter.getResourcePath(normalizedPath);
        return `.tree-item-self[data-path='${indicator.dataPath}']>.tree-item-inner:before {
            content: "";
            -webkit-mask-image: url(${shapeUrl});
            mask-image: url(${shapeUrl});
            background-color: ${indicator.color};
        }`;
    }
}

