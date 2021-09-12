import {} from 'lodash';

import { getInput } from '../utils';

interface SolutionOptions {
    input: string[];
    dimensions: number;
    cycles: number;
}
type Cube = Map<string, boolean>;

// helpers to convert from an array of numbers coordinate to a string key,
// necessary because we can only properly compare string keys from Maps for
// equality
const coordToKey = (coord: number[]): string => coord.join(',');
const keyToCoord = (key: string): number[] => key.split(',').map(Number);

// calculate cartesian product, taken from
// https://stackoverflow.com/questions/12303989/cartesian-product-of-multiple-arrays-in-javascript
const cartesian = (...a: any[]) =>
    a.reduce((a, b) => a.flatMap((d: any) => b.map((e: any) => [d, e].flat())));

const solution = (options: SolutionOptions): number => {
    const { input, dimensions, cycles } = options;

    let cells: Cube = new Map();
    // fill initial cube with active cells from puzzle input
    input.forEach((line, x) => {
        line.split('').forEach((char, y) => {
            if (char === '#')
                cells.set(
                    coordToKey([x, y, ...Array(dimensions - 2).fill(0)]),
                    true
                );
        });
    });

    // determine relative coordinates of a cell's neighbors in the n-dimensional space
    const relativeNeighbors: number[][] = cartesian(
        ...Array(dimensions).fill([-1, 0, 1])
    ).filter((rel: number[]) => rel.some((r) => r !== 0));

    // helper function to determine absolute coordinates of a cell's neighbors given its key
    const getNeighbors = (key: string, cube: Cube) => {
        return relativeNeighbors.map((relative) => {
            const cellCoords = keyToCoord(key);
            const neighbor = coordToKey(
                cellCoords.map((a, i) => a + relative[i])
            );
            return neighbor;
        });
    };

    // compute each cube cycle
    for (let cycle = 0; cycle < cycles; cycle += 1) {
        const newCells: Cube = new Map();

        // add cells with relevancy to Map (= neighbor to an already relevant cell)
        cells.forEach((state, key) => {
            const neighbors = getNeighbors(key, cells);

            neighbors.forEach((neighbor) => {
                if (!cells.has(neighbor) && state) cells.set(neighbor, false);
            });
        });

        // determine next cycle's state for each cell in Map
        cells.forEach((state, key) => {
            const neighbors = getNeighbors(key, cells);

            const neighborCount = neighbors.reduce(
                (count: number, neighbor: string) =>
                    cells.get(neighbor) ? count + 1 : count,
                0
            );

            if (state) {
                if (neighborCount === 2 || neighborCount === 3) {
                    newCells.set(key, true);
                } else {
                    newCells.set(key, false);
                }
            } else {
                if (neighborCount === 3) newCells.set(key, true);
                // if cell is inactive and does not have active neighbors, it loses
                // its relevancy
            }
        });

        cells = newCells;
    }

    // determine count of active cells after last cycle
    return [...cells.values()].reduce(
        (sum, state) => (state ? sum + 1 : sum),
        0
    );
};

(async () => {
    const input = await getInput('./day17/input');
    console.log(
        'Part 1 solution: ',
        solution({ input, dimensions: 3, cycles: 6 })
    );
    console.log(
        'Part 2 solution: ',
        solution({ input, dimensions: 4, cycles: 6 })
    );
})();
