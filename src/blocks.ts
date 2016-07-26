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

interface Draggable {

}

function mixinDraggable(block: DiagramBlock) {
    block.setDragOffset = (function(x: number, y: number) {
        this.dragOffsetX = x;
        this.dragOffsetY = y;
    }).bind(block);

    block.dragEnd = (function() {
        this.top += this.dragOffsetY;
        this.left += this.dragOffsetX;

        this.dragOffsetX = 0;
        this.dragOffsetY = 0;
    }).bind(block);
}

export class ConditionBlock implements Block, DiagramBlock {
    type = BlockType.Condition;

    diagonalX = 100;
    diagonalY = 50;

    dragOffsetX = 0;
    dragOffsetY = 0;

    constructor(public top: number, public left: number, public conditionText: string,
                public resizable = true, public draggable = true)
    {
        this.top = top;
        this.left = left;
        this.conditionText = conditionText;
        if(draggable) {
            mixinDraggable(this);
        }
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
}

export class EntryBlock implements Block, DiagramBlock {
    type = BlockType.Entry;

    radiusX = 50;
    radiusY = 25;

    dragOffsetX = 0;
    dragOffsetY = 0;

    constructor(public top: number, public left: number, public conditionText: string,
                public resizable = true, public draggable = true)
    {
        if(draggable) {
            mixinDraggable(this);
        }
    }

    drawInContext(context: CanvasRenderingContext2D) {
        let posX = this.left + this.dragOffsetX;
        let posY = this.top + this.dragOffsetY;
        let centerX = posX + this.radiusX;
        let centerY = posY + this.radiusY;
        let scaleY = this.radiusY / this.radiusX;

        context.save();
        context.fillStyle = '#fff';
        context.beginPath();
        context.moveTo(centerX + this.radiusX * Math.cos(0),
                       centerY + this.radiusY * Math.sin(0));
        for(let step = 0.01, a = step; a < 2 * Math.PI; a += step) {
            context.lineTo(centerX + this.radiusX * Math.cos(a),
                           centerY + this.radiusY * Math.sin(a));
        }
        context.stroke();
        context.fill();
        context.restore();

        context.save();
        context.translate(posX, posY);
        context.translate(this.radiusX, this.radiusY);
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
            (this.radiusX + padding) * 2,
            (this.radiusY + padding) * 2
        );
    }

    getPossibleConnectionPoints() {
        return [
            new Point(
                this.left + this.radiusX + this.dragOffsetX,
                this.top + this.dragOffsetY),
            new Point(
                this.left + this.radiusX + this.dragOffsetX,
                this.top + this.radiusY / 2 + this.dragOffsetY),
            new Point(
                this.left + this.dragOffsetX,
                this.top + this.radiusY + this.dragOffsetY),
            new Point(
                this.left + this.radiusX * 2 + this.dragOffsetX,
                this.top + this.radiusY + this.dragOffsetY)
        ]
    }
}
