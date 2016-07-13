import { ArgumentType } from 'argumentTypes';

export interface ArgumentDeclaration {
    name: string;
    type: ArgumentType;
}

export default class Action {
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
