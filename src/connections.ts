import { DiagramObject } from 'diagramView'
import { Block } from 'blocks'

export interface Connection extends DiagramObject {
    from: Block;
    to: Block;
}
