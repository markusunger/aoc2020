import { getInput } from '../utils';

interface ValueRange {
    start: number;
    end: number;
}

type TicketFields = Record<string, ValueRange[]>;

interface ParsedInput {
    fields: TicketFields;
    ownTicket: number[];
    nearbyTickets: number[][];
}

// process the raw puzzle input into a useful object of type ParsedInput
const parseInput = (input: string[]): ParsedInput => {
    // find input array indices which separate data (empty string lines)
    const splitIndices = (() => {
        const result = [];
        for (let i = 0; i < input.length; i += 1) {
            if (!input[i]) result.push(i);
        }
        return result;
    })();

    // extract information about valid number values for each ticket field
    const fields = input.slice(0, splitIndices[0]).reduce((f, line) => {
        const name = line.match(/.+(?=\:)/g)!.toString();
        const ranges = line.match(/\d+\-\d+/g)!.map((range) => {
            const [start, end] = range.split('-').map(Number);
            return { start, end };
        });
        f[name] = ranges;
        return f;
    }, {} as TicketFields);

    // extract information about own ticket
    const ownTicket = input
        .slice(splitIndices[0] + 2, splitIndices[1])[0]
        .split(',')
        .map(Number);

    // extract information about nearby tickets
    const nearbyTickets = input
        .slice(splitIndices[1] + 2)
        .map((ticket) => ticket.split(',').map(Number));

    return { fields, ownTicket, nearbyTickets };
};

const part1 = (input: ParsedInput) => {
    const ticketValues = input.nearbyTickets.flat();
    const errorRate = ticketValues.reduce((rate, value) => {
        let isValid = false;
        const ranges = Object.values(input.fields);

        for (let i = 0; i < ranges.length; i += 1) {
            for (let j = 0; j < ranges[i].length; j += 1) {
                if (value >= ranges[i][j].start && value <= ranges[i][j].end)
                    isValid = true;
                if (isValid) break;
            }
            if (isValid) break;
        }

        return isValid ? rate : rate + value;
    }, 0);

    console.log('Part 1 solution: ', errorRate);
};

(async () => {
    const input = parseInput(await getInput('day16/input'));
    part1(input);
})();
