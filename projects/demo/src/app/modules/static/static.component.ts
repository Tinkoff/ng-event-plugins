import * as typescript from '!!raw-loader!../select/select.component.ts';
import * as html from '!!raw-loader!../select/select.template.html';
import {AfterViewChecked, ChangeDetectionStrategy, Component} from '@angular/core';

@Component({
    selector: 'static',
    templateUrl: './static.template.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StaticComponent implements AfterViewChecked {
    readonly typescript = typescript;

    readonly html = html;

    readonly items = ['Option 1', 'Option 2', 'Option 3', 'Option 4'];

    popup = false;

    ngAfterViewChecked() {
        // tslint:disable-next-line:no-console
        console.log('change detection cycle', Date.now());
    }

    onOpened() {
        this.popup = true;
    }

    onClosed() {
        this.popup = false;
    }
}
