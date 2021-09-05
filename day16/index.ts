import { includes } from 'lodash';
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

// helper for checking whether a value is valid in a given set of ValueRanges
const valueMatchesRanges = (value: number, ranges: ValueRange[]) => {
    return ranges.some((range) => value >= range.start && value <= range.end);
};

// helper for determining invalid ticket values
const getInvalidValues = (fields: TicketFields, ticket: number[]) => {
    return ticket.filter(
        (value) =>
            !Object.entries(fields).some(([_, fieldRanges]) =>
                valueMatchesRanges(value, fieldRanges)
            )
    );
};

const part1 = (input: ParsedInput, showResult = true) => {
    const errorRate = input.nearbyTickets
        .flatMap((ticket) => getInvalidValues(input.fields, ticket))
        .reduce((acc, value) => acc + value);

    if (showResult) console.log('Part 1 solution: ', errorRate);
};

const part2 = (input: ParsedInput) => {
    const validTickets = input.nearbyTickets.filter(
        (ticket) => getInvalidValues(input.fields, ticket).length === 0
    );

    const fieldColumnMap = new Map<number, string>();
    const fields = Object.entries(input.fields);

    while (fieldColumnMap.size < fields.length) {
        validTickets
            .map((_, idx) => idx)
            .filter((idx) => !fieldColumnMap.has(idx))
            .forEach((idx) => {
                const eligibleFields = fields.filter(
                    ([fieldName, fieldRanges]) => {
                        return (
                            ![...fieldColumnMap.values()].includes(fieldName) &&
                            validTickets.every((ticket) =>
                                valueMatchesRanges(ticket[idx], fieldRanges)
                            )
                        );
                    }
                );
                if (eligibleFields.length === 1)
                    fieldColumnMap.set(idx, eligibleFields[0][0]);
            });
    }

    const solution = input.ownTicket
        .filter((_, idx) => fieldColumnMap.get(idx)!.startsWith('departure'))
        .reduce((acc, value) => acc * value);

    console.log('Part 2 solution is: ', solution);
};

(async () => {
    const input = parseInput(await getInput('day16/input'));
    part1(input);
    part2(input);
})();
