import Shape from "./shape";

export default interface Indicator {
    dataPath: string;
    color: string;
    shape: Shape['id'];
}
