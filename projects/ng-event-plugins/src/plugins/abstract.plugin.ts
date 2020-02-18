import {EventManager} from '@angular/platform-browser';
// this is not public API so we cannot extend it
// import {EventManagerPlugin} from '@angular/platform-browser/src/dom/events/event_manager';

// TODO: A subject to change: https://github.com/angular/angular/issues/3929
export abstract class AbstractEventPlugin {
    // extends EventManagerPlugin {
    manager!: EventManager;

    protected abstract readonly modifier: string;

    supports(event: string): boolean {
        return event.split('.').indexOf(this.modifier) !== -1;
    }

    abstract addEventListener(
        element: HTMLElement,
        event: string,
        handler: Function,
    ): Function;

    abstract addGlobalEventListener(
        element: string,
        event: string,
        handler: Function,
    ): Function;

    protected unwrap(event: string): string {
        return event
            .split('.')
            .filter(v => v !== this.modifier)
            .join('.');
    }
}
