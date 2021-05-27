export function asCallable<T>(a: T): T & Function {
    return a as any;
}
