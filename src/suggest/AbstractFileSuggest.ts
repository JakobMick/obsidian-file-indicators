// Credits: https://github.com/liamcain/obsidian-periodic-notes and https://github.com/SilentVoid13/Templater

import { TAbstractFile } from 'obsidian';

import { TextInputSuggest } from 'src/suggest';

export class AbstractFileSuggest extends TextInputSuggest<TAbstractFile> {
  getSuggestions(inputStr: string): TAbstractFile[] {
    const abstractFiles = this.app.vault.getAllLoadedFiles();
    const files: TAbstractFile[] = [];
    const lowerCaseInputStr = inputStr.toLowerCase();

    abstractFiles.forEach((file: TAbstractFile) => {
      if (
        file.path.toLowerCase().contains(lowerCaseInputStr)
      ) {
        files.push(file);
      }
    });

    return files;
  }

  renderSuggestion(file: TAbstractFile, el: HTMLElement): void {
    el.setText(file.path);
  }

  selectSuggestion(file: TAbstractFile): void {
    this.inputEl.value = file.path;
    this.inputEl.trigger('input');
    this.close();
  }
}
