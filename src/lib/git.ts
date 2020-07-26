import {exec} from "child_process";

function dedupeArray(array: string[]) {
    return array.filter((v, i) => array.indexOf(v) === i);
}

export function processGitOutput(stdout: string) {
    const lines = stdout.split("\n");

    let modified = lines
        .filter(line => line.search(/(modified:|new file:)/) >= 0)
        .map(line => line.split(':')[1].trim());

    return dedupeArray(modified);
}

export function getModifiedFiles() {
    return new Promise<string[]>((resolve, reject) => {
        exec('git status', (error, stdout, stderr) => {
            if (error === null) {
                resolve(processGitOutput(stdout));
            } else {
                reject(error);
            }
        });
    })
}
