interface DrawableObject {
    drawOn(canvas: HTMLCanvasElement): any;
}

type BlockType = "Entry" | "Choice" | "Action" | "Exit";

interface ArgumentType {
    name: string;
    fromString(str: string): any;
}

interface ArgumentDeclaration {
    name: string;
    type: ArgumentType;
}

export class Action {
    name: string;
    func: (args: any[]) => any;
    argDeclarations: ArgumentDeclaration[];

    constructor(name: string, func: (args: any[]) => any, argDeclarations: ArgumentDeclaration[]) {
        this.name = name;
        this.func = func;
        this.argDeclarations = argDeclarations;
    }

    exec(args: string[]) {
        return this.func(args.map((argument, index) => this.argDeclarations[index].type.fromString(argument)));
    }
}

interface Block extends DrawableObject {
    type: BlockType;
}

interface Connection extends DrawableObject {
    from: Block;
    to: Block;
}

export let stringArg: ArgumentType = { name: "string", fromString: str => str };
export let numberArg: ArgumentType = { name: "number", fromString: str => Number(str) };
