import { Indicator } from 'src/indicators';
import { CustomShape } from 'src/shapes';

export interface FileIndicatorsSettings {
	defaultColor: string;
    defaultShape: string | number;
    shapes: (CustomShape)[];
    indicators: (Indicator)[];
}

export const DEFAULT_SETTINGS: FileIndicatorsSettings = {
	defaultColor: '#8A5CF5',
    defaultShape: 'CIRCLE',
    shapes: [],
    indicators: [],
}