export interface Shape {
    id: string | number;
    name: string;
    svg: string;
}

export interface DefaultShape extends Shape {
    id: string;
    name: string;
    svg: string;
}

export interface CustomShape extends Shape {
    id: number;
    name: string;
    svg: string;
}
