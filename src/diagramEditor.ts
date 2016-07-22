import { DiagramView } from 'diagramView'
import { ConditionBlock } from 'blocks'
import { NormalConnection } from 'connections'

export class DiagramEditor {
    private canvas: HTMLCanvasElement;
    private diagramView: DiagramView;

    constructor(width: number, height: number) {
        this.diagramView = new DiagramView(width, height);

        let blocks = [
            new ConditionBlock(20, 20, 'one'),
            new ConditionBlock(100, 300, 'two'),
            new ConditionBlock(200, 100, 'three')
        ];
        blocks.forEach(b => this.diagramView.addBlock(b));
        this.diagramView.addConnection(new NormalConnection(blocks[0], blocks[1]));
    }

    appendTo(element: HTMLElement): void {
        element.appendChild(this.diagramView.canvas);
    }
}
