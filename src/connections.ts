import { DiagramConnection, DiagramBlock, Point } from 'diagramView'

export class NormalConnection implements DiagramConnection {
    constructor(public from: DiagramBlock, public to: DiagramBlock) {

    }

    drawInContext(context: CanvasRenderingContext2D) {
        let connectionPointsFrom = this.from.getPossibleConnectionPoints();
        let connectionPointsTo = this.to.getPossibleConnectionPoints();

        let bestPointFrom: Point, bestPointTo: Point;
        let smallestDistance = Number.MAX_VALUE;

        for(let pointFrom of connectionPointsFrom) {
            for(let pointTo of connectionPointsTo) {
                let distance = Math.sqrt(
                    Math.abs(pointFrom.x - pointTo.x) +
                    Math.abs(pointFrom.y - pointTo.y));
                if(distance < smallestDistance) {
                    bestPointFrom = pointFrom;
                    bestPointTo = pointTo;
                    smallestDistance = distance;
                }
            }
        }

        context.beginPath();
        context.moveTo(bestPointFrom.x, bestPointFrom.y);
        context.lineTo(bestPointTo.x, bestPointTo.y);
        context.stroke();
    }
}
