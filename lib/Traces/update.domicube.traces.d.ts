import { Update } from "./update";
declare type ACC = {
    x: number;
    y: number;
    z: number;
};
declare type GYR = {
    alpha: number;
    beta: number;
    gamma: number;
};
export declare function initTraceFrom(t?: number): Update[];
interface RotationConf {
    fromT: number;
    toT: number;
    frequency: number;
    accRef: ACC;
    accDelta: ACC;
    gyrRef: GYR;
    gyrDelta: GYR;
}
export declare function genRotation(conf: RotationConf): Update[];
export declare function genRotationFace1(fromT: number, toT: number, frequency: number): Update[];
export declare function genRotationFace1Inv(fromT: number, toT: number, frequency: number): Update[];
export {};
