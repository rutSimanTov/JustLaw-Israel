export const snakeToCamel = <T extends Record<string, any>>(obj: T): any => {
    const ret: any = {};
    for (const key in obj) {
        const camel = key.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
        ret[camel] = obj[key];
    }
    return ret;
}

export const camelToSnake = <T extends Record<string, any>>(obj: T): any => {
    const ret: any = {};
    for (const key in obj) {
        const snake = key.replace(/[A-Z]/g, c => '_' + c.toLowerCase());
        ret[snake] = obj[key];
    }
    return ret;

}