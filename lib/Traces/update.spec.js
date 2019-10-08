"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const DomicubeUsage_1 = require("ccbl-js/lib/testsProg/DomicubeUsage");
const main_1 = require("ccbl-js/lib/main");
const CcblAdapterLocal_1 = require("../CcblAdapterLocal");
const ProgramObjectInterface_1 = require("ccbl-js/lib/ProgramObjectInterface");
const update_domicube_traces_1 = require("./update.domicube.traces");
const update_1 = require("./update");
main_1.initCCBL();
describe("Update.spec.ts: Domicube usage: ", () => {
    const ccblAdapter = new CcblAdapterLocal_1.CcblAdapterLocal();
    it("setting root program", () => {
        ccblAdapter.setEnvForProgram(DomicubeUsage_1.domicubePlus);
        ccblAdapter.setRootProgram(DomicubeUsage_1.domicubePlus);
        expect(ProgramObjectInterface_1.progEquivalent(DomicubeUsage_1.domicubePlus, ccblAdapter.getRootProgram())).toBe(true);
        expect(ccblAdapter.getValueFromCCBL("Volume")).toEqual(0);
    });
    it("sending some initiale traces", () => __awaiter(void 0, void 0, void 0, function* () {
        ccblAdapter.updatesFromOutside(...update_domicube_traces_1.initTraceFrom());
        yield update_1.waitP(101);
        expect(ccblAdapter.getValueFromCCBL("Volume")).toEqual(0);
        expect(ccblAdapter.getValueFromCCBL("face")).toEqual(1);
    }));
    it("Face to 2", () => __awaiter(void 0, void 0, void 0, function* () {
        ccblAdapter.updatesFromOutside({ timestamp: 1, type: "emitter", varName: "acc", value: { x: 0, y: 9.81, z: 0 } });
        yield update_1.waitP(101);
        expect(ccblAdapter.getValueFromCCBL("Volume")).toEqual(0);
        expect(ccblAdapter.getValueFromCCBL("face")).toEqual(2);
        expect(ccblAdapter.getValueFromCCBL("rotation")).toEqual("none");
    }));
    it("Face to 1 plus alpha > 0", () => __awaiter(void 0, void 0, void 0, function* () {
        ccblAdapter.updatesFromOutside({ timestamp: 2, type: "emitter", varName: "acc", value: { x: 9.81, y: 0, z: 0 } }, { timestamp: 2, type: "emitter", varName: "gyro", value: { alpha: 1, beta: 0, gamma: 0 } });
        yield update_1.waitP(101);
        expect(ccblAdapter.getValueFromCCBL("Volume")).toEqual(0);
        expect(ccblAdapter.getValueFromCCBL("face")).toEqual(1);
        expect(ccblAdapter.getValueFromCCBL("N")).toEqual(1);
        expect(ccblAdapter.getValueFromCCBL("rotation")).toEqual("clockwise");
    }));
    it("Sync clock at 1000", () => __awaiter(void 0, void 0, void 0, function* () {
        ccblAdapter.sync(502);
        expect(ccblAdapter.getValueFromCCBL("Volume")).toEqual(50);
        expect(ccblAdapter.getValueFromCCBL("N")).toEqual(51);
        expect(ccblAdapter.getValueFromCCBL("face")).toEqual(1);
        expect(ccblAdapter.getValueFromCCBL("rotation")).toEqual("clockwise");
    }));
    it("sending face 1 and rotation alpha traces", () => __awaiter(void 0, void 0, void 0, function* () {
        ccblAdapter.updatesFromOutside(...update_domicube_traces_1.genRotationFace1(502, 1002, 10));
        yield update_1.waitP(111);
        expect(ccblAdapter.getValueFromCCBL("log")).toEqual("IncreaseVolume");
        expect(ccblAdapter.getValueFromCCBL("Volume")).toEqual(100);
        expect(ccblAdapter.getValueFromCCBL("N")).toEqual(101);
        expect(ccblAdapter.getValueFromCCBL("face")).toEqual(1);
        expect(ccblAdapter.getValueFromCCBL("rotation")).toEqual("clockwise");
    }));
    it("sending face 1 and rotation -alpha traces", () => __awaiter(void 0, void 0, void 0, function* () {
        ccblAdapter.updatesFromOutside({ timestamp: 1010, type: "emitter", varName: "acc", value: { x: 9.81, y: 0, z: 0 } }, { timestamp: 1010, type: "emitter", varName: "gyro", value: { alpha: -1, beta: 0, gamma: 0 } });
        yield update_1.waitP(101);
        ccblAdapter.updatesFromOutside(...update_domicube_traces_1.genRotationFace1Inv(1010, 2010, 10));
        yield update_1.waitP(111);
        expect(ccblAdapter.getValueFromCCBL("log")).toEqual("DecreaseVolume");
        expect(ccblAdapter.getValueFromCCBL("Volume")).toEqual(0);
        expect(ccblAdapter.getValueFromCCBL("face")).toEqual(1);
        expect(ccblAdapter.getValueFromCCBL("rotation")).toEqual("anticlockwise");
    }));
    it("sending face 1 and no rotation", () => __awaiter(void 0, void 0, void 0, function* () {
        ccblAdapter.updatesFromOutside({ timestamp: 2015, type: "emitter", varName: "acc", value: { x: 9.81, y: 0, z: 0 } }, { timestamp: 2015, type: "emitter", varName: "gyro", value: { alpha: 0, beta: 0, gamma: 0 } });
        yield update_1.waitP(101);
        expect(ccblAdapter.getValueFromCCBL("log")).toEqual(`DomicubeBase__face == 1`);
        expect(ccblAdapter.getValueFromCCBL("Volume")).toEqual(0);
        expect(ccblAdapter.getValueFromCCBL("face")).toEqual(1);
        expect(ccblAdapter.getValueFromCCBL("rotation")).toEqual("none");
    }));
    it("sending face 1 and no rotation", () => __awaiter(void 0, void 0, void 0, function* () {
        ccblAdapter.updatesFromOutside({ timestamp: 2020, type: "event", varName: "resetVolume", value: true });
        yield update_1.waitP(101);
        expect(ccblAdapter.getValueFromCCBL("Volume")).toEqual(0);
        expect(ccblAdapter.getValueFromCCBL("face")).toEqual(1);
    }));
    it("sending face 1 and no rotation", () => __awaiter(void 0, void 0, void 0, function* () {
        ccblAdapter.sync(2120);
        expect(ccblAdapter.getValueFromCCBL("Volume")).toEqual(100);
        expect(ccblAdapter.getValueFromCCBL("face")).toEqual(1);
    }));
});
//# sourceMappingURL=update.spec.js.map