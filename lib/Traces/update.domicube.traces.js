"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function initTraceFrom(t = 0) {
    const T = [
        { timestamp: t, type: "emitter", varName: "gyro", value: { alpha: 0, beta: 0, gamma: 0 } },
        { timestamp: t, type: "emitter", varName: "acc", value: { x: 9.81, y: 0, z: 0 } }
    ];
    return T;
}
exports.initTraceFrom = initTraceFrom;
function getScalar(ref, delta) {
    const r = 2 * (Math.random() - 0.5);
    return ref + r * delta;
}
function genRotation(conf) {
    const { fromT, toT, frequency, accRef, accDelta, gyrRef, gyrDelta } = conf;
    const T = [];
    const nbIterations = (toT - fromT) * frequency / 1000;
    const dt = (toT - fromT) / nbIterations;
    for (let i = 0; i <= nbIterations; i++) {
        const t = Math.round(fromT + i * dt);
        const acc = {
            x: getScalar(accRef.x, accDelta.x),
            y: getScalar(accRef.y, accDelta.y),
            z: getScalar(accRef.z, accDelta.z)
        };
        const gyr = {
            alpha: getScalar(gyrRef.alpha, gyrDelta.alpha),
            beta: getScalar(gyrRef.beta, gyrDelta.beta),
            gamma: getScalar(gyrRef.gamma, gyrDelta.gamma)
        };
        T.push({ type: "emitter", varName: "acc", value: acc, timestamp: t }, { type: "emitter", varName: "gyro", value: gyr, timestamp: t });
    }
    return T;
}
exports.genRotation = genRotation;
function genRotationFace1(fromT, toT, frequency) {
    return genRotation({
        fromT, toT, frequency,
        accRef: { x: 9.81, y: 0, z: 0 },
        accDelta: { x: 0.1, y: 0.1, z: 0.1 },
        gyrRef: { alpha: 1, beta: 0, gamma: 0 },
        gyrDelta: { alpha: 0.2, beta: 0, gamma: 0 }
    });
}
exports.genRotationFace1 = genRotationFace1;
function genRotationFace1Inv(fromT, toT, frequency) {
    return genRotation({
        fromT, toT, frequency,
        accRef: { x: 9.81, y: 0, z: 0 },
        accDelta: { x: 0.1, y: 0.1, z: 0.1 },
        gyrRef: { alpha: -1, beta: 0, gamma: 0 },
        gyrDelta: { alpha: 0, beta: 0, gamma: 0 }
    });
}
exports.genRotationFace1Inv = genRotationFace1Inv;
//# sourceMappingURL=update.domicube.traces.js.map