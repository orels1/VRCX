declare module "vrcx-native" {
    export function sample(): string;
    export function sum(...args: any[]): number;
    export function setFrameBuffer(id: number, bitmap: Buffer): boolean;
}
