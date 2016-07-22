import { DiagramConnection, DiagramBlock } from 'diagramView'

export class NormalConnection implements DiagramConnection {
    constructor(public from: DiagramBlock, public to: DiagramBlock) {

    }

    drawInContext(context: CanvasRenderingContext2D) {
        let center1 = this.from.getBoundingSquare(0).getCenterPoint();
        let center2 = this.to.getBoundingSquare(0).getCenterPoint();
        context.beginPath();
        context.moveTo(center1.x, center1.y);
        context.lineTo(center2.x, center2.y);
        context.stroke();
    }
}
