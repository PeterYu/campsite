export class Line {
    constructor(public line: string) {}
}

export function parseLines(lines: string): Line[] {
    return lines
        .split("\n")
        .filter(l => !!l)
        .map(l => new Line(l.trimRight()));
}
