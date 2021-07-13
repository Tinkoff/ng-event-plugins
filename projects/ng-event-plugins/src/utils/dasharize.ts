export function dasharize(camel: string): string {
    return camel.replace(/[a-z][A-Z]/g, letterLetter => {
        return `${letterLetter[0]}-${letterLetter[1].toLowerCase()}`;
    });
}
