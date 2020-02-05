import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {SelectComponent} from './select.component';

@NgModule({
    imports: [CommonModule],
    declarations: [SelectComponent],
    exports: [SelectComponent],
})
export class SelectModule {}
