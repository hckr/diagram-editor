export interface DrawableObject {
    drawOn(canvas: HTMLCanvasElement): any;
}

export type BlockType = "Entry" | "Choice" | "Action" | "Exit";

export interface Block extends DrawableObject {
    type: BlockType;
}

export interface Connection extends DrawableObject {
    from: Block;
    to: Block;
}
