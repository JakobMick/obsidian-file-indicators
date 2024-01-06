import { Modal, Setting } from 'obsidian';

import FileIndicatorsPlugin from './main';
import Indicator, { IndicatorShape, shapeTitleMap } from './indicator';
import { AbstractFileSuggest } from './suggest/AbstractFileSuggest';

export enum IndicatorModalAction { ADD = 'Add', EDIT = 'Edit' }

export default class IndicatorModal extends Modal {
	plugin: FileIndicatorsPlugin;
    indicator: Indicator;
    action: IndicatorModalAction;
    onSubmit: (indicator: Indicator) => void ;

	constructor(
        plugin: FileIndicatorsPlugin, 
        indicator: Indicator, 
        action: IndicatorModalAction = IndicatorModalAction.ADD,
        onSubmit: (indicator: Indicator) => void = () => null,
    ) {
        super(plugin.app);
        this.plugin = plugin;
        this.indicator = indicator;
        this.action = action;
        this.onSubmit = onSubmit;
    }

	onOpen() {
        const indicator: Indicator = {
            dataPath: this.indicator.dataPath,
            color: this.indicator.color,
            shape: this.indicator.shape,
        };

        this.titleEl.setText(this.action + ' indicator');

        this.contentEl.addClass('fi-modal-content');
        
        const setting = new Setting(this.contentEl);
        setting.setClass('fi-list-item');
        setting.setClass('indicator-list-item');
        setting.setClass('indicator-modal-item');

        setting.addColorPicker(colorpicker => colorpicker
            .setValue(indicator.color)
            .onChange(value => indicator.color = value.toString()));

        setting.addSearch(search => {
            search.setPlaceholder('Data path');
            new AbstractFileSuggest(this.app, search.inputEl);
            search.setValue(indicator.dataPath);
            search.onChange(value => indicator.dataPath = value);
        })

        setting.addDropdown(dropdown => dropdown
            .addOptions(shapeTitleMap)
            .setValue(indicator.shape)
            .onChange((value: IndicatorShape) => indicator.shape = value));
            
        const emptyError = new Setting(this.contentEl);
        emptyError.setDesc('Please set a path.');
        emptyError.settingEl.addClass('fi-modal-error');
            
        const duplicateError = new Setting(this.contentEl);
        duplicateError.setDesc('Path already has an indicator.');
        duplicateError.settingEl.addClass('fi-modal-error');
        
        const buttonRow = new Setting(this.contentEl);
        buttonRow.setClass('modal-button-container');
        buttonRow.setClass('fi-modal-buttons');

        buttonRow.addButton(button => {
            button.setButtonText(this.action == IndicatorModalAction.EDIT ? 'Save' : 'Add')
            .setClass('mod-cta')
            .onClick(async () => {
                emptyError.settingEl.removeClass('fi-modal-error--active');
                duplicateError.settingEl.removeClass('fi-modal-error--active');

                if(indicator.dataPath == '') {
                    emptyError.settingEl.addClass('fi-modal-error--active');
                    return;
                }
                
                const index = this.plugin.settings.indicators.findIndex((i) => i.dataPath == indicator.dataPath);

                if(index >= 0 && this.indicator.dataPath != indicator.dataPath) {
                    duplicateError.settingEl.addClass('fi-modal-error--active');
                    return;
                }

                if(this.action == IndicatorModalAction.EDIT) {
                    this.plugin.settings.indicators[index] = indicator;
                    await this.plugin.removeIndicator(this.indicator);
                    await this.plugin.addIndicator(indicator);
                    this.onSubmit(indicator);
                    this.close();
                } else {
                    await this.plugin.addIndicator(indicator);
                    this.onSubmit(indicator);
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
		this.contentEl.empty();
	}
}