import Action from 'action';
import { number } from 'argumentTypes'

export let addition = new Action('addition', ([x, y]) => x + y, [{ name: 'first', type: number}, {name: 'second', type: number}]);
