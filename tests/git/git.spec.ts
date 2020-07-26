import {processGitOutput} from "../../src/lib/git";

describe('git module', () => {
    test('no modified files', () => {
        const output = `
On branch master
nothing to commit, working tree clean
`;
        const modifiedFiles = processGitOutput(output);

        expect(modifiedFiles).toEqual([]);
    });

    test.skip('untracked file', () => {
        const output = `
On branch master
Untracked files:
  (use "git add <file>..." to include in what will be committed)

\tafile

nothing added to commit but untracked files present (use "git add" to track)
`;
        const modifiedFiles = processGitOutput(output);

        expect(modifiedFiles).toEqual(['afile']);
    });

    test('new file', () => {
        const output = `
On branch master
Changes to be committed:
  (use "git reset HEAD <file>..." to unstage)

\tnew file:   afile
`;
        const modifiedFiles = processGitOutput(output);

        expect(modifiedFiles).toEqual(['afile']);

    });

    test('modified file', () => {
        const output = `
On branch master
Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git checkout -- <file>..." to discard changes in working directory)

\tmodified:   afile

no changes added to commit (use "git add" and/or "git commit -a")
`;
        const modifiedFiles = processGitOutput(output);

        expect(modifiedFiles).toEqual(['afile']);

    });

    test('deleted file', () => {
        const output = `
On branch master
Changes to be committed:
  (use "git reset HEAD <file>..." to unstage)

\tdeleted:    afile
`;
        const modifiedFiles = processGitOutput(output);

        expect(modifiedFiles).toEqual(['afile']);

    });
});
