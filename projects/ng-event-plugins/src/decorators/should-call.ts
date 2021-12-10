import {NgZone} from '@angular/core';
import {Predicate} from '../types/predicate';

/**
 * TODO: This will not be needed when markDirty becomes stable API
 */
export function shouldCall<T>(predicate: Predicate<T>): MethodDecorator {
    return (_, key, desc: PropertyDescriptor) => {
        const {value} = desc;

        desc.value = function (this: T, ...args: any[]) {
            const zone = arguments[0];

            if (zone instanceof NgZone) {
                Object.defineProperty(this, key, {
                    value(this: T, ...args: any[]) {
                        if (predicate.apply(this, args)) {
                            zone.run(() => {
                                value.apply(this, args);
                            });
                        }
                    },
                });
            } else if (predicate.apply(this, args)) {
                value.apply(this, args);
            }
        };
    };
}

/**
 * TODO: Use this after markDirty becomes public API
 */
// export function shouldCall<T extends object>(predicate: Predicate<T>): MethodDecorator {
//     return (_: Object, _key: string | symbol, desc: PropertyDescriptor) => {
//         const {value} = desc;
//
//         desc.value = function(this: T, ...args: any[]) {
//             if (predicate.apply(this, args)) {
//                 value.apply(this, args);
//                 markDirty(this);
//             }
//         };
//     };
// }
