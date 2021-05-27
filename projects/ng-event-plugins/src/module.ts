import {Inject, NgModule} from '@angular/core';
import {EVENT_MANAGER_PLUGINS} from '@angular/platform-browser';
import {NG_EVENT_PLUGINS} from './constants/plugins';
import {SilentEventPlugin} from './plugins/silent.plugin';

// @dynamic
@NgModule({
    providers: NG_EVENT_PLUGINS,
})
export class EventPluginsModule {
    constructor(@Inject(EVENT_MANAGER_PLUGINS) plugins: readonly unknown[]) {
        console.assert(
            !(plugins[0] instanceof SilentEventPlugin),
            'EventManagerModule must come after BrowserModule in imports',
        );
    }
}
