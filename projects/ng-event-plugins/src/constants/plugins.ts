import {Provider} from '@angular/core';
import {EVENT_MANAGER_PLUGINS} from '@angular/platform-browser';

import {BindEventPlugin} from '../plugins/bind.plugin';
import {OptionsEventPlugin} from '../plugins/options.plugin';
import {PreventEventPlugin} from '../plugins/prevent.plugin';
import {SelfEventPlugin} from '../plugins/self.plugin';
import {SilentEventPlugin} from '../plugins/silent.plugin';
import {StopEventPlugin} from '../plugins/stop.plugin';
import {ZoneEventPlugin} from '../plugins/zone.plugin';

const PLUGINS = [
    SilentEventPlugin,
    BindEventPlugin,
    OptionsEventPlugin,
    PreventEventPlugin,
    SelfEventPlugin,
    StopEventPlugin,
    ZoneEventPlugin,
];

export const NG_EVENT_PLUGINS: Provider[] = PLUGINS.map(useClass => ({
    provide: EVENT_MANAGER_PLUGINS,
    multi: true,
    useClass,
}));
