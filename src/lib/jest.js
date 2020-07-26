import {exec} from 'child_process';

export function jest() {
    exec('jest --coverage', (error, stdout, stderr) => {
        console.log(`jest output: ${stdout}`);
    });
}
