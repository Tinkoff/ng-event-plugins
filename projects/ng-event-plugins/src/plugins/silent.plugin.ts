import {Injectable} from '@angular/core';
import {AbstractEventPlugin} from './abstract.plugin';

@Injectable()
export class SilentEventPlugin extends AbstractEventPlugin {
    protected readonly modifier = 'silent';

    addEventListener(element: HTMLElement, event: string, handler: Function): Function {
        return this.manager
            .getZone()
            .runOutsideAngular(() =>
                this.manager.addEventListener(element, this.unwrap(event), handler),
            );
    }

    addGlobalEventListener(element: string, event: string, handler: Function): Function {
        return this.manager
            .getZone()
            .runOutsideAngular(() =>
                this.manager.addGlobalEventListener(element, this.unwrap(event), handler),
            );
    }
}
