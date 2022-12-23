import {Injectable} from '@angular/core';

import {AbstractEventPlugin} from './abstract.plugin';

/**
 * TODO: Remove in v4.0.0
 * @deprecated
 */
@Injectable()
export class ZoneEventPlugin extends AbstractEventPlugin {
    protected readonly modifier = '.init';

    addEventListener(_element: HTMLElement, _event: string): Function {
        console.warn('.init plugin is no longer necessary as of v3.1.0');

        return () => {};
    }

    addGlobalEventListener(_element: string, _event: string): Function {
        console.warn('.init plugin is no longer necessary as of v3.1.0');

        return () => {};
    }
}
