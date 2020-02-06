import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {HighlightModule} from 'ngx-highlightjs';
import {PopupModule} from '../popup/popup.module';
import {SelectModule} from '../select/select.module';
import {StaticComponent} from './static.component';

@NgModule({
    imports: [CommonModule, HighlightModule, PopupModule, SelectModule],
    declarations: [StaticComponent],
    exports: [StaticComponent],
})
export class StaticModule {}
