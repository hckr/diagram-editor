import { DiagramView } from 'diagramView'
import { EntryBlock, ConditionBlock } from 'blocks'
import { NormalConnection } from 'connections'

export class DiagramEditor {
    private diagramView: DiagramView;

    constructor(width: number, height: number) {
        this.diagramView = new DiagramView(width, height);

        let blocks = [
            new EntryBlock(20, 40, 'START'),
            new ConditionBlock(100, 300, 'two'),
            new ConditionBlock(200, 100, 'three', true, false)
        ];
        blocks.forEach(b => this.diagramView.addBlock(b));
        this.diagramView.addConnection(new NormalConnection(blocks[0], blocks[1]));
    }

    appendTo(element: HTMLElement): void {
        element.appendChild(this.diagramView.canvas);
    }
}
