import { getInput } from '../utils';

enum CommandType {
    MEM = 'MEM',
    MASK = 'MASK',
}

interface CommandMask {
    type: CommandType.MASK;
    data: string;
}

interface CommandMem {
    type: CommandType.MEM;
    data: [number, number];
}

type Command = CommandMem | CommandMask;

const getCommand = (line: string): Command => {
    const [key, value] = line.split(' = ');
    // new bitmask
    if (key.startsWith('mask')) {
        return {
            type: CommandType.MASK,
            data: value,
        };
    }

    // otherwise: memory assignment
    return {
        type: CommandType.MEM,
        data: [parseInt(key.match(/\d+/)![0], 10), parseInt(value, 10)],
    };
};

const getAllAddresses = (bitmask: string[], binary: string[]): number[] => {
    // applies all '1's and '0's in bitmask to binary
    const newBinary = binary.map((digit, idx) =>
        bitmask[idx] === '1' ? '1' : bitmask[idx] === '0' ? digit : 'X'
    );

    const addresses: string[] = [];
    const stack: string[] = [];
    stack.push(newBinary.join(''));

    // replace 'X' with both '1' and '0' until all 'X's are gone
    while (stack.length > 0) {
        const curr = stack.pop();

        if (curr?.includes('X')) {
            stack.push(curr.replace('X', '1'));
            stack.push(curr.replace('X', '0'));
        } else {
            addresses.push(curr as string);
        }
    }

    // return converted decimal address values
    const addressNumbers = addresses.map((addr) => parseInt(addr, 2));
    return addressNumbers;
};

const part1 = (input: string[]) => {
    // initialize memory and bitmask
    let bitmask = Array.from({ length: 36 }).map((_) => 'X');
    const memory = {} as Record<number, number>;

    // start program
    input.forEach((line) => {
        const cmd = getCommand(line);

        // case 1: change bitmask
        if (cmd.type === CommandType.MASK) {
            bitmask = cmd.data.split('');
        }

        // case 2: assign new memory value
        if (cmd.type === CommandType.MEM) {
            // construct 36-digit binary string from new value
            const binary = (cmd.data[1] >>> 0)
                .toString(2)
                .padStart(36, '0')
                .split('');
            // apply bitmask digit by digit and construct new binary string
            const newBinary = binary
                .reduce((newBinary, digit, idx) => {
                    newBinary.push(bitmask[idx] !== 'X' ? bitmask[idx] : digit);
                    return newBinary;
                }, [] as string[])
                .join('');
            // write integer value of new binary string to memory
            memory[cmd.data[0]] = parseInt(newBinary, 2);
        }
    });

    console.log(
        'part 1: ',
        Object.values(memory).reduce((sum, val) => sum + val)
    );
};

const part2 = (input: string[]) => {
    let bitmask = Array.from({ length: 36 }).map((_) => 'X');
    const memory = {} as Record<number, number>;

    // start program
    input.forEach((line) => {
        const cmd = getCommand(line);

        // case 1: change bitmask
        if (cmd.type === CommandType.MASK) {
            bitmask = cmd.data.split('');
        }

        // case 2: assign new memory value
        if (cmd.type === CommandType.MEM) {
            // construct 36-digit binary string from memory address
            const binary = (cmd.data[0] >>> 0)
                .toString(2)
                .padStart(36, '0')
                .split('');

            // get all memory addresses to assign new value to
            const addresses = getAllAddresses(bitmask, binary);

            addresses.forEach((addr) => {
                memory[addr] = cmd.data[1];
            });
        }
    });

    console.log(
        'part 2: ',
        Object.values(memory).reduce((sum, val) => sum + val)
    );
};

(async () => {
    const input = await getInput('day14/input');
    part1(input);
    part2(input);
})();
