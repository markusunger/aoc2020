import { readFile } from 'fs';
import { promisify } from 'util';

export type Input = string[];
export type RawInput = string;

const readFileAsync = promisify(readFile);

export const getInput = async (fileName: string): Promise<string[]> => {
    const input = await readFileAsync(fileName, { encoding: 'utf-8' });
    return input.split('\n');
};

export const getRawInput = async (fileName: string): Promise<string> => {
    const input = await readFileAsync(fileName, { encoding: 'utf-8' });
    return input;
};
