import {Injectable} from '@angular/core';

import {AbstractEventPlugin} from './abstract.plugin';

/**
 * TODO: Remove in v4.0.0
 * @deprecated
 */
@Injectable()
export class ZoneEventPlugin extends AbstractEventPlugin {
    protected readonly modifier = '.init';

    addEventListener(): Function {
        console.warn('.init plugin is no longer necessary as of v3.1.0');

        return () => {};
    }
}
