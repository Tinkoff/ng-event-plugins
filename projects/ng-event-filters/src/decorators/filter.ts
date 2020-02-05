import {HostListener, NgZone} from '@angular/core';
import {Filter} from '../types/filter';

/**
 * TODO: This will not be needed in Angular 10
 * when libraries are allowed to use Ivy renderer and markDirty becomes stable API
 */
export function filter<T extends object>(filter: Filter<T>): MethodDecorator {
    return (target: Object, key: string | symbol, desc: PropertyDescriptor) => {
        const hostListener = HostListener('init.' + String(key), ['$event']);
        const {value} = desc;

        desc.value = function() {
            const zone = arguments[0] as NgZone;

            Object.defineProperty(this, key, {
                value(this: T, ...args: any[]) {
                    if (filter.apply(this, args)) {
                        zone.run(() => {
                            value.apply(this, args);
                        });
                    }
                },
            });
        };

        return hostListener(target, key, desc);
    };
}

/**
 * TODO: Use this in Angular 10
 */
// export function filter<T extends object>(filter: Filter<T>): MethodDecorator {
//     return (_: Object, _key: string | symbol, desc: PropertyDescriptor) => {
//         const {value} = desc;
//
//         desc.value = function(this: T, ...args: any[]) {
//             if (filter.apply(this, args)) {
//                 value.apply(this, args);
//                 markDirty(this);
//             }
//         };
//     };
// }
