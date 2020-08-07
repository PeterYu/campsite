import {Args, jestCoverage} from './lib/jest/jest';

export default function main(args: string[]) {
    // getModifiedFiles().then(files => {
    //     files.map(file => console.log(`file: ${file}`));
    // });

    const bsArgs:Args = {};

    if (args.find(arg => arg.search(/--baseline/) >= 0)) {
        bsArgs.baseline = true;
    }

    jestCoverage(bsArgs);
}
