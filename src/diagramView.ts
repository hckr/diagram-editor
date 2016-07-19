export interface BoundingSquare {
    top: number;
    left: number;
    width: number;
    height: number;
}

export interface DiagramObject {
    id?: string; // optional; replaced during addition if object with provided id already exists on diagram
    resizable: Boolean;
    movable: Boolean;
    drawInContext(context: CanvasRenderingContext2D): any;
    getBoundingSquare(padding: number): BoundingSquare;
}

export class DiagramView {
    canvas: HTMLCanvasElement;
    private context: CanvasRenderingContext2D;

    drawableObjects: DiagramObject[];
    selectedObjects: DiagramObject[];
    moving: Boolean = false;
    resizing: Boolean = false;

    constructor(width: number, height: number) {
        let canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        this.canvas = canvas;
        this.context = canvas.getContext("2d");

        this.registerEvents();
        this.drawingLoop();
    }

    addObject(object: DiagramObject): void {
        this.drawableObjects.push(object);
    }

    private registerEvents(): void {
        this.canvas.addEventListener('mousedown', this.onMouseDown, false);
        this.canvas.addEventListener('mousemove', this.onMouseMove, false);
        this.canvas.addEventListener('mouseup', this.onMouseUp, false);
    }

    private onMouseDown(event: MouseEvent) {

    }

    private onMouseMove(event: MouseEvent) {
        if(this.moving) {
            this.selectedObjects.forEach(obj => {
                
            })
        }
        if(this.resizing) {
            this.selectedObjects.forEach(obj => {
                
            })
        }
    }

    private onMouseUp(event: MouseEvent) {
        this.moving = false;
        this.resizing = false;
    }

    private drawingLoop(): void {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawableObjects.forEach(obj => {
            obj.drawInContext(this.context);
        });
        window.requestAnimationFrame(this.drawingLoop);
    }
}
