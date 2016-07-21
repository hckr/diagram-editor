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
    draggable = true;

    top: number;
    left: number;
    conditionText: string;
    diagonal = 100;

    dragOffsetX = 0;
    dragOffsetY = 0;

    constructor(top: number, left: number, conditionText: string) {
        this.top = top;
        this.left = left;
        this.conditionText = conditionText;
    }

    drawInContext(context: CanvasRenderingContext2D) {
        let posX = this.left + this.dragOffsetX;
        let posY = this.top + this.dragOffsetY;

        let rectangleSide = this.diagonal / Math.sqrt(2);
        context.save();
        context.translate(posX, posY);
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
            top: this.top - padding + this.dragOffsetY,
            left: this.left - padding + this.dragOffsetX,
            width: this.diagonal + 2 * padding,
            height: this.diagonal + 2 * padding
        }
    }

    setDragOffset(x: number, y: number) {
        this.dragOffsetX = x;
        this.dragOffsetY = y;
    }

    dragEnd() {
        this.top += this.dragOffsetY;
        this.left += this.dragOffsetX;

        this.dragOffsetX = 0;
        this.dragOffsetY = 0;
    }
}
