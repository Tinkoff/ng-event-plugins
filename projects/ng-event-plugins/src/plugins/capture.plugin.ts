import {Injectable} from '@angular/core';
import {AbstractEventPlugin} from './abstract.plugin';

@Injectable()
export class CaptureEventPlugin extends AbstractEventPlugin {
    protected readonly modifier = 'capture';

    supports(event: string): boolean {
        const split = event.split('.');

        return split.length === 2 && split.indexOf(this.modifier) !== -1;
    }

    addEventListener(
        element: HTMLElement,
        event: string,
        handler: EventListener,
    ): Function {
        element.addEventListener(this.unwrap(event), handler, true);

        return () => element.removeEventListener(this.unwrap(event), handler);
    }
}
