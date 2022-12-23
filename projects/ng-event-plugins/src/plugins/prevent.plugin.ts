import {Injectable} from '@angular/core';

import {AbstractEventPlugin} from './abstract.plugin';

@Injectable()
export class PreventEventPlugin extends AbstractEventPlugin {
    protected readonly modifier = '.prevent';

    addEventListener(element: HTMLElement, event: string, handler: Function): Function {
        const wrapped = (event: Event): void => {
            event.preventDefault();
            handler(event);
        };

        return this.manager.addEventListener(element, this.unwrap(event), wrapped);
    }
}
