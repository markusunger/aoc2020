import { readFile } from 'fs';
import { promisify } from 'util';

const readFileAsync = promisify(readFile);

export const getInput = async (fileName: string): Promise<string[]> => {
    const input = await readFileAsync(fileName, { encoding: 'utf-8' });
    return input.split('\n');
};
