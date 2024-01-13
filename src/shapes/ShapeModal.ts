import { Modal, Setting } from 'obsidian';

import FileIndicatorsPlugin from 'src/main';
import { Shape, CustomShape } from 'src/shapes';

export class ShapeModal extends Modal {
	plugin: FileIndicatorsPlugin;
    onSubmit: (shape: Shape) => void ;

	constructor(
        plugin: FileIndicatorsPlugin, 
        onSubmit: (shape: Shape) => void = () => null,
    ) {
        super(plugin.app);
        this.plugin = plugin;
        this.onSubmit = onSubmit;
    }

	onOpen() {
        const id = this.plugin.settings.shapes.reduce(
            (prev, current) => (prev && prev.id > current.id) 
                ? prev 
                : current
            ).id + 1;
        const shape: CustomShape = {
            id: id,
            name: 'Custom shape #' + id,
            svg: '',
        };

        this.titleEl.setText('Add shape');

        this.contentEl.addClass('fi-modal-content');
        
        const setting = new Setting(this.contentEl);
        setting.setClass('fi-list-item');

        setting.addText(text => {
            text.setPlaceholder('Shape name')
                .setValue(shape.name)
                .onChange(value => shape.name = value);
        })

        setting.addText(text => {
            text.setPlaceholder('SVG')
                .setValue(shape.svg)
                .onChange(value => shape.svg = value);
        })
            
        const emptyError = new Setting(this.contentEl);
        emptyError.setDesc('Please set a name and svg.');
        emptyError.settingEl.addClass('fi-modal-error');
            
        const duplicateError = new Setting(this.contentEl);
        duplicateError.setDesc('A shape with this name already exists.');
        duplicateError.settingEl.addClass('fi-modal-error');
        
        const buttonRow = new Setting(this.contentEl);
        buttonRow.setClass('modal-button-container');
        buttonRow.setClass('fi-modal-buttons');

        buttonRow.addButton(button => {
            button.setButtonText('Add')
            .setClass('mod-cta')
            .onClick(async () => {
                emptyError.settingEl.removeClass('fi-modal-error--active');
                duplicateError.settingEl.removeClass('fi-modal-error--active');

                if(shape.name == '' || shape.svg == '') {
                    emptyError.settingEl.addClass('fi-modal-error--active');
                    return;
                }
                
                const index = this.plugin.settings.shapes.findIndex((i) => i.name == shape.name);

                if(index >= 0) {
                    duplicateError.settingEl.addClass('fi-modal-error--active');
                    return;
                }

                await this.plugin.addShape(shape);
                this.onSubmit(shape);
                this.close();
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
