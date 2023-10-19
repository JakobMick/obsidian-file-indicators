export default interface Indicator {
    dataPath: string;
    color: string;
    shape: IndicatorShape
}

export enum IndicatorShape {
    CIRCLE = 'Circle',
    STAR = 'Star'
}