import { DrawableObject } from 'canvasPainter'

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
