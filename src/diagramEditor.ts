import { DiagramView } from 'diagramView'

export class DiagramEditor {
    private canvas: HTMLCanvasElement;
    private diagramView: DiagramView;

    constructor(width: number, height: number) {
        this.diagramView = new DiagramView(width, height);
    }

    appendTo(element: HTMLElement): void {
        element.appendChild(this.diagramView.canvas);
    }
}
