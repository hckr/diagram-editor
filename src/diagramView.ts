export class Point {
    constructor(public x: number, public y: number) { }

    distanceTo(other: Point) {
        return Math.sqrt(
            Math.abs(this.x - other.x) +
            Math.abs(this.y - other.y));
    }
}

export class BoundingSquare {
    constructor(public top: number, public left: number, public width: number, public height: number) { }

    getCenterPoint(): Point {
        return new Point(
            this.left + Math.floor(this.width / 2),
            this.top + Math.floor(this.height / 2));
    }
}

interface DiagramElement {
    drawInContext(context: CanvasRenderingContext2D): void;
}

export interface DiagramBlock extends DiagramElement {
    id?: string; // optional; replaced during addition if object with provided id already exists on diagram
    resizable: boolean;
    draggable: boolean;
    getBoundingSquare(padding: number): BoundingSquare;
    getPossibleConnectionPoints(): Point[];
    setDragOffset?(x: number, y: number): void;
    dragEnd?(): void;
}

export interface DiagramConnection extends DiagramElement {
    id?: string; // optional; replaced during addition if object with provided id already exists on diagram
    from: DiagramBlock;
    to: DiagramBlock;
}

export class DiagramView {
    canvas: HTMLCanvasElement;
    private context: CanvasRenderingContext2D;

    blocks: DiagramBlock[] = [];
    selectedBlocks: DiagramBlock[] = [];
    connections: DiagramConnection[] = [];
    dragging = false;
    resizing = false;

    mouseDownPositionX = 0;
    mouseDownPositionY = 0;

    constructor(width: number, height: number) {
        let canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        this.canvas = canvas;
        this.context = canvas.getContext('2d');

        this.registerEvents();
        this.drawingLoop();
    }

    addBlock(block: DiagramBlock): void {
        this.blocks.push(block);
    }

    addConnection(connection: DiagramConnection): void {
        this.connections.push(connection);
    }

    private registerEvents(): void {
        this.canvas.addEventListener('mousedown', e => { this.onMouseDown(e) }, false);
        this.canvas.addEventListener('mousemove', e => { this.onMouseMove(e) }, false);
        this.canvas.addEventListener('mouseup', e => { this.onMouseUp(e) }, false);
    }

    private getBlockUnderCursor(event: MouseEvent): DiagramBlock {
        let mouseX = event.pageX - this.canvas.offsetLeft;
        let mouseY = event.pageY - this.canvas.offsetTop;

        for(let block of this.blocks) {
            let boundingSquare = block.getBoundingSquare(0);
            let bounds = {
                top: boundingSquare.top,
                right: boundingSquare.left + boundingSquare.width,
                bottom: boundingSquare.top + boundingSquare.height,
                left: boundingSquare.left
            }
            if(mouseY > bounds.top && mouseY < bounds.bottom &&
               mouseX > bounds.left && mouseX < bounds.right)
            {
                return block;
            }
        }

        return null;
    }

    private handleSelection(event: MouseEvent) {
        let block = this.getBlockUnderCursor(event);
        let wasPreviouslySelected = this.selectedBlocks.indexOf(block) != -1;
        if(block) {
            if(event.ctrlKey) {
                if(wasPreviouslySelected) {
                    this.selectedBlocks = this.selectedBlocks.filter(el => el != block);
                    return;
                }
                this.selectedBlocks.push(block);
                return;
            }
            if(!wasPreviouslySelected) {
                this.selectedBlocks = [block];
            }
            if(block.draggable) {
                this.onDragStart(event);
            }
            return;
        }
        if(!event.ctrlKey) {
            this.selectedBlocks = [];
        }
    }

    private onDragStart(event: MouseEvent) {
        this.canvas.style.cursor = 'move';
        this.dragging = true;
    }

    private onDragMove(event: MouseEvent) {
        this.selectedBlocks.filter(b => b.draggable).forEach(block => {
            block.setDragOffset(event.clientX - this.mouseDownPositionX,
                                event.clientY - this.mouseDownPositionY);
        });
    }

    private onDragEnd(event: MouseEvent) {
        this.selectedBlocks.filter(b => b.draggable).forEach(block => {
            block.dragEnd();
        });
        this.canvas.style.cursor = 'default';
        this.dragging = false;
    }

    private onMouseDown(event: MouseEvent) {
        this.handleSelection(event);
        this.mouseDownPositionX = event.clientX;
        this.mouseDownPositionY = event.clientY;
    }

    private onMouseMove(event: MouseEvent) {
        if(this.dragging) {
            this.onDragMove(event);
        }
        if(this.resizing) {
            this.selectedBlocks.forEach(obj => {

            });
        }
    }

    private onMouseUp(event: MouseEvent) {
        if(this.dragging) {
            this.onDragEnd(event);
        }
        this.resizing = false;
    }

    private drawingLoop(): void {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.connections.forEach(connection => {
            connection.drawInContext(this.context);
        });
        this.blocks.forEach(block => {
            block.drawInContext(this.context);
        });
        this.context.save();
        this.context.setLineDash([1, 1]);
        this.selectedBlocks.forEach(block => {
            let boundingSquare = block.getBoundingSquare(5);
            this.context.strokeRect(boundingSquare.left, boundingSquare.top,
                                    boundingSquare.width, boundingSquare.height);
        });
        this.context.restore();
        window.requestAnimationFrame(() => {
            this.drawingLoop();
        });
    }
}
