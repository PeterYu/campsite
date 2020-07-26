import {getModifiedFiles} from './lib/git';
import {jestCoverage} from './lib/jest';

export default function main() {
    getModifiedFiles().then(files => {
        files.map(file => console.log(`file: ${file}`));
    });

    jestCoverage();
}
