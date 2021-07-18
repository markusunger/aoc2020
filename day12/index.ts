import { getInput } from '../utils/';

enum Orientation {
    N = 'N',
    E = 'E',
    S = 'S',
    W = 'W',
}

class Ship {
    private orientation: Orientation;
    private x: number;
    private y: number;

    constructor() {
        this.orientation = Orientation.E;
        this.x = 0;
        this.y = 0;
    }

    public move(spaces: number, direction?: Orientation): void {
        if (
            direction === Orientation.N ||
            (!direction && this.orientation === Orientation.N)
        ) {
            this.y += spaces;
        } else if (
            direction === Orientation.E ||
            (!direction && this.orientation === Orientation.E)
        ) {
            this.x += spaces;
        } else if (
            direction === Orientation.S ||
            (!direction && this.orientation === Orientation.S)
        ) {
            this.y -= spaces;
        } else if (
            direction === Orientation.W ||
            (!direction && this.orientation === Orientation.W)
        ) {
            this.x -= spaces;
        }
    }

    public turn(degree: number): void {
        const facings = Object.values(Orientation);
        const steps = degree / 90;
        const idx = facings.indexOf(this.orientation);

        this.orientation = facings[(idx + steps) % 4];
    }

    public getPosition(): { x: number; y: number } {
        return { x: this.x, y: this.y };
    }

    public getOrientation(): Orientation {
        return this.orientation;
    }
}

const part1 = async () => {
    const input = await getInput('day12/input');
    const ship = new Ship();

    input.forEach((command) => {
        const [instruction, number] = [command.substr(0, 1), command.substr(1)];
        switch (instruction) {
            case 'L':
                ship.turn(360 - +number);
                break;
            case 'R':
                ship.turn(+number);
                break;
            case 'F':
                ship.move(+number);
                break;
            case Orientation.S:
            case Orientation.N:
            case Orientation.E:
            case Orientation.W:
                ship.move(+number, instruction);
                break;
            default:
                break;
        }
    });

    const { x, y } = ship.getPosition();
    console.log('Part 1:', Math.abs(x) + Math.abs(y), { x, y });
};

part1();
