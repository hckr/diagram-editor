export interface ArgumentType {
    name: string;
    fromString(str: string): any;
}

export let string: ArgumentType = { name: "string", fromString: str => str };
export let number: ArgumentType = { name: "number", fromString: str => Number(str) };
