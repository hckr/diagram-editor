export interface BoundingSquare {
    top: number;
    left: number;
    width: number;
    height: number;
}

export interface DiagramBlock {
    id?: string; // optional; replaced during addition if object with provided id already exists on diagram
    resizable: Boolean;
    movable: Boolean;
    drawInContext(context: CanvasRenderingContext2D): any;
    getBoundingSquare(padding: number): BoundingSquare;
}

export class DiagramView {
    canvas: HTMLCanvasElement;
    private context: CanvasRenderingContext2D;

    blocks: DiagramBlock[] = [];
    selectedBlocks: DiagramBlock[] = [];
    dragging = false;
    resizing = false;

    constructor(width: number, height: number) {
        let canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        this.canvas = canvas;
        this.context = canvas.getContext("2d");

        this.registerEvents();
        this.drawingLoop();
    }

    addBlock(block: DiagramBlock): void {
        this.blocks.push(block);
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
            this.onDragStart(event);
            return;
        }
        if(!event.ctrlKey) {
            this.selectedBlocks = [];
        }
    }

    private onDragStart(event: MouseEvent) {
        this.dragging = true;
    }

    private onDragEnd(event: MouseEvent) {
        let block = this.getBlockUnderCursor(event);
        if(this.selectedBlocks.indexOf(block) == -1) {
            this.selectedBlocks = [block];
        }

        this.dragging = false;
    }

    private onMouseDown(event: MouseEvent) {
        this.handleSelection(event);
    }

    private onMouseMove(event: MouseEvent) {
        if(this.getBlockUnderCursor(event)) {
            this.canvas.style.cursor = 'move';
        } else {
            this.canvas.style.cursor = 'default';
        }

        if(this.dragging) {
            this.selectedBlocks.forEach(obj => {

            });
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
