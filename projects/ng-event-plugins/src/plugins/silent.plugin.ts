import {Injectable, NgZone} from '@angular/core';

import {AbstractEventPlugin} from './abstract.plugin';

@Injectable()
export class SilentEventPlugin extends AbstractEventPlugin {
    static ngZone?: NgZone;

    protected readonly modifier = '.silent';

    addEventListener(element: HTMLElement, event: string, handler: Function): Function {
        SilentEventPlugin.ngZone = this.manager.getZone();

        return SilentEventPlugin.ngZone.runOutsideAngular(() =>
            this.manager.addEventListener(element, this.unwrap(event), handler),
        );
    }

    addGlobalEventListener(element: string, event: string, handler: Function): Function {
        SilentEventPlugin.ngZone = this.manager.getZone();

        return SilentEventPlugin.ngZone.runOutsideAngular(() =>
            this.manager.addGlobalEventListener(element, this.unwrap(event), handler),
        );
    }
}
