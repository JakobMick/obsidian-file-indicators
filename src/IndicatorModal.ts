import { Modal, Setting } from 'obsidian';

import FileIndicatorsPlugin from './main';
import Indicator from './indicator';

export enum IndicatorModalAction { ADD = 'Add', EDIT = 'Edit' }

export default class IndicatorModal extends Modal {
	plugin: FileIndicatorsPlugin;
    indicator: Indicator;
    action: IndicatorModalAction;

	constructor(
        plugin: FileIndicatorsPlugin, 
        indicator: Indicator, 
        action: IndicatorModalAction = IndicatorModalAction.ADD
    ) {
        super(plugin.app);
        this.plugin = plugin;
        this.indicator = indicator;
        this.action = action;
    }

	onOpen() {
        const oldIndicator = this.indicator;

        this.titleEl.setText(this.action + ' indicator');

        this.contentEl.addClass('indicator-modal-content');
        
        const setting = new Setting(this.contentEl);
        setting.setClass('indicator-list-item');
        setting.setClass('indicator-modal-item');

        setting.addColorPicker(colorpicker => colorpicker
            .setValue(this.indicator.color)
            .onChange(value => this.indicator.color = value.toString()));

        setting.addText(text => text
            .setPlaceholder('Data path')
            .setValue(this.indicator.dataPath)
            .onChange(value => this.indicator.dataPath = value));

        setting.addDropdown(dropdown => dropdown
            .addOptions({
                "CIRCLE": "Circle",
                "SQUIRCLE": "Squircle",
                "SQUARE": "Square"
            })
            .setValue(this.indicator.shape)
            .onChange(value => this.indicator.shape = value));
        
        const buttonRow = new Setting(this.contentEl);
        buttonRow.setClass('modal-button-container');
        buttonRow.setClass('indicator-modal-buttons');

        buttonRow.addButton(button => {
            button.setButtonText(this.action == IndicatorModalAction.EDIT ? 'Save' : 'Add')
            .setClass('mod-cta')
            .onClick(async () => {
                if(this.action == IndicatorModalAction.EDIT) {
                    const indicatorIndex = this.plugin.settings.indicators.indexOf(oldIndicator);
                    this.plugin.settings.indicators[indicatorIndex] = this.indicator;
                    this.plugin.removeIndicator(oldIndicator);
                    this.plugin.addIndicator(this.indicator);
                    await this.plugin.saveSettings();
                    this.close();
                } else {
                    await this.plugin.addIndicator(this.indicator);
                    this.close();
                }
            });
        });

        buttonRow.addButton(button => {
            button.setButtonText('Cancel')
            .onClick(() => this.close());
        });
	}

	onClose() {
		const {contentEl} = this;
		contentEl.empty();
	}
}