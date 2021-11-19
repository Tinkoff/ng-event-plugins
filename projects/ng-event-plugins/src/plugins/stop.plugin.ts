import {Injectable} from '@angular/core';
import {AbstractEventPlugin} from './abstract.plugin';

@Injectable()
export class StopEventPlugin extends AbstractEventPlugin {
    protected readonly modifier = '.stop';

    addEventListener(element: HTMLElement, event: string, handler: Function): Function {
        const wrapped = (event: Event) => {
            event.stopPropagation();
            handler(event);
        };

        return this.manager.addEventListener(element, this.unwrap(event), wrapped);
    }

    addGlobalEventListener(element: string, event: string, handler: Function): Function {
        const wrapped = (event: Event) => {
            event.stopPropagation();
            handler(event);
        };

        return this.manager.addGlobalEventListener(element, this.unwrap(event), wrapped);
    }
}
