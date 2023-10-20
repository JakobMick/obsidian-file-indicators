export default interface Indicator {
    dataPath: string;
    color: string;
    shape: IndicatorShape
}

export enum IndicatorShape {
    CIRCLE = 'Circle',
    TRIANGLE = 'Triangle',
    SQUARE = 'Square',
    RING = 'Ring',
    FRAME = 'Frame',
    STAR = 'Star',
}