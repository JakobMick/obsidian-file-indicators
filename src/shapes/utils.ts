import { Shape, defaultShapes } from 'src/shapes';


export function getShapeNames(shapes: Shape[]): Record<string, string> {

    const titles: Record<string, string> = {};

    [...shapes, ...defaultShapes].forEach((shape) => {
        titles[shape.id] = shape.name
    });

    return titles;
}

export function getShapeSvgs(shapes: Shape[]): Record<string, string> {

    const svgs: Record<string, string> = {};

    [...shapes, ...defaultShapes].forEach((shape) => {
        svgs[shape.id] = shape.svg
    });

    return svgs;
}

export const getShapeSvg = (shapeId: Shape['id'], shapes: Shape[]): string => getShapeSvgs(shapes)[shapeId];