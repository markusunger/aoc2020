import { getInput } from '../utils';

const part1 = (input: String[]) => {
    const [line1, line2] = input;
    const timestamp = +line1;
    const ids = line2
        .split(',')
        .filter((id) => id !== 'x')
        .map((id) => parseInt(id));

    // find departure times closest to (but not less than) input timestamp
    const times = ids.map((id) => id * Math.ceil(timestamp / id));

    // determine earliest departure time (to match with bus line id)
    const earliest = times.reduce(
        (acc, curr) => (curr < acc ? curr : acc),
        Infinity
    );

    const index = times.indexOf(earliest);
    const waitingTime = earliest - timestamp;
    const lineId = ids[index];

    console.log('part 1: ', lineId * waitingTime);
};

const part2 = (input: String[]) => {
    const [, line2] = input;
    const ids = line2.split(',').reduce((acc, curr, idx) => {
        const num = parseInt(curr, 10);
        if (Number.isNaN(num)) return acc;

        acc[idx] = num;
        return acc;
    }, {} as Record<number, number>);

    let time = 0;
    let step = 1;

    Object.entries(ids).forEach(([idx, id]) => {
        while (true) {
            if ((time + parseInt(idx, 10)) % id === 0) {
                step *= id;
                break;
            }

            time += step;
        }
    });

    console.log('part 2: ', time);
};

(async () => {
    const input = await getInput('day13/input');
    part1(input);
    part2(input);
})();
