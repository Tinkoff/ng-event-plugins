import {Injectable} from '@angular/core';

import {AbstractEventPlugin} from './abstract.plugin';

@Injectable()
export class StopEventPlugin extends AbstractEventPlugin {
    protected readonly modifier = '.stop';

    addEventListener(element: HTMLElement, event: string, handler: Function): Function {
        const wrapped = (event: Event): void => {
            event.stopPropagation();
            handler(event);
        };

        return this.manager.addEventListener(element, this.unwrap(event), wrapped);
    }
}
