import {Injectable} from '@angular/core';
import {EMPTY, Observable} from 'rxjs';
import {switchMap} from 'rxjs/operators';
import {AbstractEventPlugin} from './abstract.plugin';

@Injectable()
export class BindEventPlugin extends AbstractEventPlugin {
    protected readonly modifier = '$';

    addEventListener(
        element: HTMLElement & Record<string, Observable<unknown>>,
        event: string,
    ): Function {
        element[event] = EMPTY;

        const method = this.getMethod(element, event);
        const sub = this.manager
            .getZone()
            .onStable.pipe(switchMap(() => element[event]))
            .subscribe(method);

        return () => sub.unsubscribe();
    }

    private getMethod(
        element: HTMLElement & Record<string, unknown>,
        event: string,
    ): (v: unknown) => void {
        const [, key, value, unit = ''] = event.split('.');

        if (event.endsWith('.attr')) {
            return v => element.setAttribute(key, String(v));
        }

        if (key === 'class') {
            return v => element.classList.toggle(value, !!v);
        }

        if (key === 'style') {
            return v => element.style.setProperty(value, `${v}${unit}`);
        }

        return v => (element[key] = v);
    }
}
