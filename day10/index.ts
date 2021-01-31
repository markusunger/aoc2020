import { max } from 'lodash';
import { getInput } from '../utils/';

const part1 = async () => {
    type Compute = {
        ones: number;
        threes: number;
    };

    const input = await getInput('input');
    const adapters = input.map(Number);

    // add charging outlet joltage (0) and that of builtin adapter (max + 3)
    // to list and find differences of 1 and 3 in sorted list
    const compute = [0, ...adapters, max(adapters) + 3]
        .sort((a, b) => a - b)
        .reduce(
            (acc, jolt, idx, input): Compute => {
                if (idx + 1 === input.length) return acc;

                const diff = input[idx + 1] - jolt;
                return {
                    ones: diff === 1 ? acc.ones + 1 : acc.ones,
                    threes: diff === 3 ? acc.threes + 1 : acc.threes,
                };
            },
            { ones: 0, threes: 0 }
        );

    console.log('Part 1 solution: ', compute.ones * compute.threes);
};

const part2 = async () => {
    type Memoize = Map<number, number>;

    const input = await getInput('input');
    const adapters = input.map(Number);

    const builtinAdapter = max(adapters) + 3;

    // add builtin adapter to sorted list of adapters
    const sortedAdapters = [...adapters.sort((a, b) => a - b), builtinAdapter];

    // count number of ways to reach each joltage value by looking it up in a Map
    // that starts with the initial charger joltage (0)
    const result = sortedAdapters.reduce((acc, adapter): Memoize => {
        const count =
            (acc.get(adapter - 1) || 0) +
            (acc.get(adapter - 2) || 0) +
            (acc.get(adapter - 3) || 0);
        acc.set(adapter, count);
        return acc;
    }, new Map([[0, 1]]) as Memoize);

    console.log('Part 2 solution: ', result.get(builtinAdapter));
};

part1();
part2();
