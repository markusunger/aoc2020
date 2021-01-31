import { getInput } from '../utils/';

enum SeatType {
    FLOOR = '.',
    EMPTY_SEAT = 'L',
    OCCUPIED_SEAT = '#',
}

type SeatingPlan = Array<Array<SeatType>>;

interface IComputeNextTileState {
    state: SeatingPlan;
    x: number;
    y: number;
    width: number;
    height: number;
    isPart2: boolean;
}

const relativeAdjacent = [
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, -1],
    [0, 1],
    [1, -1],
    [1, 0],
    [1, 1],
];

const render = (state: SeatingPlan) => {
    for (let row of state) {
        console.log(row.join(''));
    }
};

const computeNextTileState = ({
    state,
    x,
    y,
    width,
    height,
    isPart2,
}: IComputeNextTileState) => {
    const occupiedNeighbors = relativeAdjacent.reduce((acc, coords) => {
        const [dX, dY] = coords;
        if (x + dX < 0 || x + dX >= width || y + dY < 0 || y + dY >= height)
            return acc;

        return state[y + dY][x + dX] === SeatType.OCCUPIED_SEAT ? acc + 1 : acc;
    }, 0);

    if (state[y][x] === SeatType.EMPTY_SEAT && occupiedNeighbors === 0)
        return SeatType.OCCUPIED_SEAT;

    if (state[y][x] === SeatType.OCCUPIED_SEAT && occupiedNeighbors >= 4)
        return SeatType.EMPTY_SEAT;

    return state[y][x];
};

const nextGeneration = (
    state: SeatingPlan,
    isPart2 = false
): [SeatingPlan, boolean] => {
    let stateHasChanged = false;

    const newState = state.map((row, y) => {
        return row.map((column, x) => {
            const newTileState = computeNextTileState({
                state,
                x,
                y,
                width: row.length,
                height: state.length,
                isPart2,
            });
            if (newTileState !== state[y][x]) stateHasChanged = true;
            return newTileState;
        });
    });

    return [newState, stateHasChanged];
};

const part1 = async () => {
    const input = await getInput('input');
    let state: SeatingPlan = input.map((row) => row.split('') as SeatType[]);
    let changed: boolean;

    while (true) {
        [state, changed] = nextGeneration(state);
        if (!changed) break;
    }

    const result = state.reduce(
        (occupiedSeats, row) =>
            occupiedSeats +
            row.reduce(
                (acc, seat) =>
                    seat === SeatType.OCCUPIED_SEAT ? acc + 1 : acc,
                0
            ),
        0
    );

    console.log('Part 1 solution:', result);
};

part1();
