export interface DrawableObject {
    id: string;
    drawOn(canvas: HTMLCanvasElement): any;
}

export class CanvasPainter {
    private canvas: HTMLCanvasElement;
    private drawableObjects: DrawableObject[];

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
    }

    addObject(object: DrawableObject): void {
        this.drawableObjects.push(object);
    }

    removeObject(id: string): void {

    }

    draw(): void {

    }
}
