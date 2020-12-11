declare module '*';

/* SystemJS module definition */
declare var module: NodeModule;

declare module '!!raw-loader!*' {
    const result: string;

    export = result;
}
