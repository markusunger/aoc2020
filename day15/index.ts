const INPUT = [18, 11, 9, 0, 5, 1];

const solution = (input: Array<number>, targetTurn: number) => {
    type Memory = Record<number, number>;
    // initialize turn memory dictionary with starting numbers from input, we can guarantee that
    // all numbers from that set are unique
    const memory: Memory = input.reduce((mem, num, idx) => {
        mem[num] = idx + 1;
        return mem;
    }, {} as Memory);

    // initialize last spoken number
    let number = input[input.length - 1];

    // iterate over all turns until target, starting with the next turn after the starting numbers
    for (let turn = input.length + 1; turn <= targetTurn; turn += 1) {
        // check whether previously spoken number has been spoken before (before the last turn, that is)
        if (memory[number] && memory[number] !== turn - 1) {
            // if so, calculate turn difference and store previous turn as last time spoken
            const prev = number;
            number = turn - 1 - memory[number];
            memory[prev] = turn - 1;
        } else {
            // if not, store previous turn as time it was last spoken
            memory[number] = turn - 1;
            number = 0;
        }
    }

    return number;
};

console.log('Part 1 solution: ', solution(INPUT, 2020));
console.log('Part 2 solution: ', solution(INPUT, 30000000));
