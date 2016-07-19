import { DiagramBlock, BoundingSquare } from 'diagramView'

// enum value can be read as string, e.g.: blockType[blockType.Entry]
export enum BlockType {
    Entry,
    Condition,
    Action,
    Exit
}

export interface Block {
    type: BlockType;
}

export class ConditionBlock implements Block, DiagramBlock {
    type = BlockType.Condition;
    resizable = true;
    movable = true;

    top: number;
    left: number;
    conditionText: string;
    diagonal = 100;

    constructor(top: number, left: number, conditionText: string) {
        this.top = top;
        this.left = left;
        this.conditionText = conditionText;
    }

    drawInContext(context: CanvasRenderingContext2D) {
        let rectangleSide = this.diagonal / Math.sqrt(2);
        context.save();
        context.translate(this.left, this.top);
        context.save();
        context.translate(this.diagonal/2, this.diagonal/2);
        context.font = "16px sans-serif";
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.fillText(this.conditionText, 0, 0);
        context.restore();
        context.rotate(0.25 * Math.PI);
        context.translate(rectangleSide/2, -rectangleSide/2);
        context.strokeRect(0, 0, rectangleSide, rectangleSide);
        context.restore();
    }

    getBoundingSquare(padding: number): BoundingSquare {
        return {
            top: this.top - padding,
            left: this.left - padding,
            width: this.diagonal + 2 * padding,
            height: this.diagonal + 2 * padding
        }
    }
}
