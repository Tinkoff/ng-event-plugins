import {AfterViewChecked, ChangeDetectionStrategy, Component} from '@angular/core';

@Component({
    selector: 'static',
    templateUrl: './static.template.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StaticComponent implements AfterViewChecked {
    readonly typescript = import('!!raw-loader!../select/select.component.ts');

    readonly html = import('!!raw-loader!../select/select.template.html');

    readonly items = ['Option 1', 'Option 2', 'Option 3', 'Option 4'];

    popup = false;

    ngAfterViewChecked(): void {
        console.info('change detection cycle', Date.now());
    }

    onOpened(): void {
        this.popup = true;
    }

    onClosed(): void {
        this.popup = false;
    }
}
