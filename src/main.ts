import {getModifiedFiles} from './lib/git';

export default function main() {
    getModifiedFiles().then(files => {
        files.map(file => console.log(`file: ${file}`));
    });
}
