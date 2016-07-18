import { DrawableObject } from 'canvasPainter'
import { Block } from 'blocks'

export interface Connection extends DrawableObject {
    from: Block;
    to: Block;
}
