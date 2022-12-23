import {EventManager} from '@angular/platform-browser';

// TODO: A subject to change: https://github.com/angular/angular/issues/3929
type EventManagerArg = ConstructorParameters<typeof EventManager>[0][0];

type EventManagerPlugin = {
    [K in keyof EventManagerArg]: EventManagerArg[K];
};

export abstract class AbstractEventPlugin implements EventManagerPlugin {
    protected abstract readonly modifier: string;

    manager!: EventManager;

    abstract addEventListener(
        element: HTMLElement,
        event: string,
        handler: Function,
    ): Function;

    supports(event: string): boolean {
        return event.includes(this.modifier);
    }

    /** This is not used in Ivy anymore */
    addGlobalEventListener(): Function {
        return () => {};
    }

    protected unwrap(event: string): string {
        return event
            .split('.')
            .filter(v => !this.modifier.includes(v))
            .join('.');
    }
}
