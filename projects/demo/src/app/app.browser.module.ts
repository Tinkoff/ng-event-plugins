import * as less from 'highlight.js/lib/languages/less';
import * as typescript from 'highlight.js/lib/languages/typescript';
import * as xml from 'highlight.js/lib/languages/xml';

import {APP_BASE_HREF, LocationStrategy, PathLocationStrategy} from '@angular/common';
import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {PLUGINS} from '@tinkoff/ng-event-filters';
import {HighlightLanguage, HighlightModule} from 'ngx-highlightjs';
import {AppComponent} from './app.component';
import {AppRoutingModule} from './app.routes';
import {StaticModule} from './modules/static/static.module';

export function hljsLanguages(): ReadonlyArray<HighlightLanguage> {
    return [
        {name: 'typescript', func: typescript},
        {name: 'less', func: less},
        {name: 'xml', func: xml},
    ];
}

@NgModule({
    bootstrap: [AppComponent],
    imports: [
        BrowserModule.withServerTransition({appId: 'demo'}),
        AppRoutingModule,
        StaticModule,
        HighlightModule.forRoot({
            languages: hljsLanguages,
        }),
    ],
    declarations: [AppComponent],
    providers: [
        {
            provide: LocationStrategy,
            useClass: PathLocationStrategy,
        },
        {
            provide: APP_BASE_HREF,
            useValue: '',
        },
        ...PLUGINS,
    ],
})
export class AppBrowserModule {}
