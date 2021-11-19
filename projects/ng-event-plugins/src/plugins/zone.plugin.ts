import {Injectable} from '@angular/core';
import {AbstractEventPlugin} from './abstract.plugin';

/**
 * TODO: This will not be needed in Angular 10
 * when libraries are allowed to use Ivy renderer and markDirty becomes stable API
 */
@Injectable()
export class ZoneEventPlugin extends AbstractEventPlugin {
    protected readonly modifier = '.init';

    addEventListener(_element: HTMLElement, _event: string, handler: Function): Function {
        return this.handle(handler);
    }

    addGlobalEventListener(
        _element: string,
        _event: string,
        handler: Function,
    ): Function {
        return this.handle(handler);
    }

    private handle(handler: Function): Function {
        const zone = this.manager.getZone();
        const subscription = zone.onStable.subscribe(() => {
            subscription.unsubscribe();
            handler(zone);
        });

        return () => {};
    }
}
