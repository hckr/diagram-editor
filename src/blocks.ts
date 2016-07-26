import { DiagramBlock, BoundingSquare, Point } from 'diagramView'

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
    diagonalX = 100;
    diagonalY = 50;

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

        context.save();
        context.fillStyle = '#fff';
        context.beginPath();
        context.translate(posX, posY);
        context.moveTo(0, this.diagonalY / 2);
        context.lineTo(this.diagonalX / 2, 0);
        context.lineTo(this.diagonalX, this.diagonalY / 2);
        context.lineTo(this.diagonalX / 2, this.diagonalY);
        context.lineTo(0, this.diagonalY / 2);
        context.stroke();
        context.fill();
        context.restore();

        context.save();
        context.translate(posX, posY);
        context.translate(this.diagonalX / 2, this.diagonalY / 2);
        context.font = '16px sans-serif';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText(this.conditionText, 0, 0);
        context.restore();
    }

    getBoundingSquare(padding: number) {
        return new BoundingSquare(
            this.top - padding + this.dragOffsetY,
            this.left - padding + this.dragOffsetX,
            this.diagonalX + 2 * padding,
            this.diagonalY + 2 * padding
        );
    }

    getPossibleConnectionPoints() {
        return [
            new Point(
                this.left + this.diagonalX / 2 + this.dragOffsetX,
                this.top + this.dragOffsetY),
            new Point(
                this.left + this.diagonalX / 2 + this.dragOffsetX,
                this.top + this.diagonalY + this.dragOffsetY),
            new Point(
                this.left + this.dragOffsetX,
                this.top + this.diagonalY / 2 + this.dragOffsetY),
            new Point(
                this.left + this.diagonalX + this.dragOffsetX,
                this.top + this.diagonalY / 2 + this.dragOffsetY)
        ]
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
