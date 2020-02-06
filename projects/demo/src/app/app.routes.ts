import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {StaticComponent} from './modules/static/static.component';

export const appRoutes: Routes = [
    {
        path: '',
        component: StaticComponent,
    },
];

@NgModule({
    imports: [
        RouterModule.forRoot(appRoutes, {
            initialNavigation: 'enabled',
        }),
    ],
    exports: [RouterModule],
})
export class AppRoutingModule {}
