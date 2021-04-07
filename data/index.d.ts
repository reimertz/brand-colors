declare module "brand-colors" {
    type ColorMap = { [key: string]: string };

    export const _brandColors: ColorMap;
    export function getAll(): ColorMap;
    export function getByGroup(brandName?: string | string[]): 
        ReadonlyArray<string | string[] | { name: string; color: string[] }>;
    export function find(name: string): string | undefined;
}