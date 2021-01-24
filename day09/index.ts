import { getInput } from '../utils/';

// generator function for retrieving values
const getNextValue = function* (values: number[]) {
    let index = 0;
    while (index < values.length) {
        yield values[index];
        index += 1;
    }
};

// O(n) hash map solution for the two sum problem
const hasTwoSum = (numbers: number[], target: number): boolean => {
    const store: Record<number, number> = {};

    for (let i = 0; i < numbers.length; i += 1) {
        const difference = target - numbers[i];

        if (store[difference] !== undefined && store[difference] !== i) {
            return true;
        } else {
            store[numbers[i]] = i;
        }
    }

    return false;
};

const part1 = async () => {
    // get numbers from input
    const input = await getInput('input');
    const values = input.map((value) => parseInt(value, 10));

    // create initial preamble array and set up generator
    const preamble = values.splice(0, 25);
    const nextValue = getNextValue(values);

    // iterate over generator values and determine whether they pass the two sum test
    for (const value of nextValue) {
        if (!hasTwoSum(preamble, value)) {
            console.log('Part 1 solution: ', value);
            return value;
        }

        preamble.splice(0, 1);
        preamble.push(value);
    }
};

part1();
