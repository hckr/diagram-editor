import { DiagramView } from 'diagramView'
import { ConditionBlock } from 'blocks'

export class DiagramEditor {
    private canvas: HTMLCanvasElement;
    private diagramView: DiagramView;

    constructor(width: number, height: number) {
        this.diagramView = new DiagramView(width, height);

        this.diagramView.addBlock(new ConditionBlock(20, 20, "one"));
        this.diagramView.addBlock(new ConditionBlock(100, 200, "two"));
    }

    appendTo(element: HTMLElement): void {
        element.appendChild(this.diagramView.canvas);
    }
}
