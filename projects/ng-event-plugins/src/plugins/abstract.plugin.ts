import {EventManager} from '@angular/platform-browser';

// TODO: A subject to change: https://github.com/angular/angular/issues/3929
type EventManagerArg = ConstructorParameters<typeof EventManager>[0][0];
type EventManagerPlugin = {
    [K in keyof EventManagerArg]: EventManagerArg[K];
};

export abstract class AbstractEventPlugin implements EventManagerPlugin {
    protected abstract readonly modifier: string;

    manager!: EventManager;

    supports(event: string): boolean {
        return event.split('.').indexOf(this.modifier) !== -1;
    }

    addGlobalEventListener(
        _element: string,
        _event: string,
        _handler: Function,
    ): Function {
        throw new Error(
            `Global event targets are not supported by ${this.modifier} plugin`,
        );
    }

    abstract addEventListener(
        element: HTMLElement,
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
