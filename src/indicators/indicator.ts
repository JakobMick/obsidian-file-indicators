import { Shape } from 'src/shapes';

export interface Indicator {
    dataPath: string;
    color: string;
    shape: Shape['id'];
}
