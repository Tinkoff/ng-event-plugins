import {Provider} from '@angular/core';
import {EVENT_MANAGER_PLUGINS} from '@angular/platform-browser';
import {BindEventPlugin} from '../plugins/bind.plugin';
import {CaptureEventPlugin} from '../plugins/capture.plugin';
import {PreventEventPlugin} from '../plugins/prevent.plugin';
import {SilentEventPlugin} from '../plugins/silent.plugin';
import {StopEventPlugin} from '../plugins/stop.plugin';
import {ZoneEventPlugin} from '../plugins/zone.plugin';

export const NG_EVENT_PLUGINS: Provider[] = [
    {
        provide: EVENT_MANAGER_PLUGINS,
        useClass: SilentEventPlugin,
        multi: true,
    },
    {
        provide: EVENT_MANAGER_PLUGINS,
        useClass: PreventEventPlugin,
        multi: true,
    },
    {
        provide: EVENT_MANAGER_PLUGINS,
        useClass: StopEventPlugin,
        multi: true,
    },
    {
        provide: EVENT_MANAGER_PLUGINS,
        useClass: ZoneEventPlugin,
        multi: true,
    },
    {
        provide: EVENT_MANAGER_PLUGINS,
        useClass: CaptureEventPlugin,
        multi: true,
    },
    {
        provide: EVENT_MANAGER_PLUGINS,
        useClass: BindEventPlugin,
        multi: true,
    },
];
