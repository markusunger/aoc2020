import { getInput } from '../utils';

const solveExpression = (expression: string, part2 = false): number => {
    // base case: no operator left, return parsed number from string
    if (!/\+|\*/.test(expression)) return parseInt(expression, 10);

    // resolve preceding operation
    const precedingOperation =
        part2 && /\+/.test(expression) ? /\d*\s\+\s\d*/ : /\d*\s[\+|\*]\s\d*/;
    const [toSolve] = expression.match(precedingOperation) as RegExpMatchArray;
    return solveExpression(
        expression.replace(precedingOperation, eval(toSolve)),
        part2
    );
};

const resolveParentheses = (expression: string, part2 = false): string => {
    // base case: no parentheses left, return expression as is
    if (!/\(/.test(expression)) return expression;

    // resolve first innermost parentheses
    const firstInnerParentheses = /\([0-9+*\s]*\)/;
    const [toResolve] = expression.match(
        firstInnerParentheses
    ) as RegExpMatchArray;
    return resolveParentheses(
        expression.replace(
            firstInnerParentheses,
            solveExpression(toResolve.slice(1, -1), part2).toString()
        ),
        part2
    );
};

const getSolution = (input: string[], part2 = false): number =>
    input.reduce(
        (sum, line) =>
            sum + solveExpression(resolveParentheses(line, part2), part2),
        0
    );

(async () => {
    const input = await getInput('./day18/input');
    console.log('Part 1 solution: ', getSolution(input));
    console.log('Part 2 solution: ', getSolution(input, true));
})();
