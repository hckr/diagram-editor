export interface DrawableObject {
    drawOn(canvas: HTMLCanvasElement): any;
}

// enum value can be read as string, e.g.: blockType[blockType.Entry]
export enum BlockType {
    Entry,
    Condition,
    Action,
    Exit
}

export interface Block extends DrawableObject {
    type: BlockType;
}

export interface Connection extends DrawableObject {
    from: Block;
    to: Block;
}
