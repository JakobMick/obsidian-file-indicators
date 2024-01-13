import { DefaultShape } from 'src/shapes';


export const defaultShapes: DefaultShape[] = [
    {
        id: 'CIRCLE',
        name: 'Circle',
        svg: '<svg viewBox="100 0 100 100" width="100" height="100" xmlns="http://www.w3.org/2000/svg"><ellipse cx="150" cy="50" rx="50" ry="50" /></svg>',
    },
    {
        id: 'TRIANGLE',
        name: 'Triangle',
        svg: '<svg viewBox="200 5 100.002 86.604" width="100.002" height="86.604" xmlns="http://www.w3.org/2000/svg"><path d="M 627.592 346.596 L 677.592 433.198 L 577.592 433.198 L 627.592 346.596 Z" transform="matrix(1, 0.000021, -0.000021, 1, -377.582897, -341.608134)" shape="577.592 346.596 100 86.602 0.5 0 1@e51e2917" /></svg>',
    },
    {
        id: 'SQUARE',
        name: 'Square',
        svg: '<svg viewBox="0 0 100 100" width="100" height="100" xmlns="http://www.w3.org/2000/svg"><rect width="100" height="100" /></svg>',
    },
    {
        id: 'RING',
        name: 'Ring',
        svg: '<svg viewBox="0 100 100.004 100.004" width="100.004" height="100.004" xmlns="http://www.w3.org/2000/svg"><path d="M 698.667 423 m -50 0 a 50 50 0 1 0 100 0 a 50 50 0 1 0 -100 0 Z M 698.667 423 m -25 0 a 25 25 0 0 1 50 0 a 25 25 0 0 1 -50 0 Z" transform="matrix(1, -0.000038, 0.000038, 1, -648.681172, -272.971566)" shape="698.667 423 25 25 50 50 1@27bb0468" /></svg>',
    },
    {
        id: 'FRAME',
        name: 'Frame',
        svg: '<svg viewBox="200 100 100.004 100.004" width="100.004" height="100.004" xmlns="http://www.w3.org/2000/svg"><path d="M 335.254 238.17 H 435.254 V 338.17 H 335.254 V 238.17 Z M 360.254 263.17 V 313.17 H 410.254 V 263.17 H 360.254 Z" transform="matrix(1, -0.000042, 0.000042, 1, -135.263996, -138.151722)" shape="335.254 238.17 100 100 25 25 0 0 0 0 1@db3c4f53" /></svg>',
    },
    {
        id: 'STAR',
        name: 'Star',
        svg: '<svg viewBox="300 2 100.006 95.112" width="100.006" height="95.112" xmlns="http://www.w3.org/2000/svg"><path d="M 860 275.094 L 872.361 310.654 L 910 311.421 L 880 334.165 L 890.902 370.199 L 860 348.696 L 829.098 370.199 L 840 334.165 L 810 311.421 L 847.639 310.654 Z" transform="matrix(1, -0.000067, 0.000067, 1, -510.018417, -273.033028)" shape="860 327.667 52.573 52.573 0.4 5 1@538c6a72" /></svg>',
    },
];
