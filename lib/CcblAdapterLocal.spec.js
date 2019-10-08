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
const progAvatar_1 = require("ccbl-js/lib/testsProg/progAvatar");
const CcblAdapterLocal_1 = require("./CcblAdapterLocal");
const rootProgAvatar_1 = require("./programs/rootProgAvatar");
const AllenInterface_1 = require("ccbl-js/lib/AllenInterface");
const ProgramObjectInterface_1 = require("ccbl-js/lib/ProgramObjectInterface");
const deepEqual = require("deep-equal");
const main_1 = require("ccbl-js/lib/main");
const update_1 = require("./Traces/update");
main_1.initCCBL();
describe("Loading Avatar program, exo 4 fropm CCBL EICS paper", () => {
    const ccblAdapter = new CcblAdapterLocal_1.CcblAdapterLocal();
    ccblAdapter.appendChannels({ name: "lampAvatar", type: "color" }, "");
    ccblAdapter.appendChannels({ name: "MusicMode", type: "string" }, "");
    ccblAdapter.appendEmitters({ name: "BobAtHome", type: "boolean" }, false);
    ccblAdapter.appendEmitters({ name: "AliceAtHome", type: "boolean" }, false);
    ccblAdapter.appendEmitters({ name: "AliceAtBobHome", type: "boolean" }, false);
    ccblAdapter.appendEmitters({ name: "AliceAvailable", type: "boolean" }, false);
    ccblAdapter.appendEmitters({ name: "securityMode", type: "boolean" }, false);
    it("Loading of rootProgAvatar as root program", () => {
        ccblAdapter.setRootProgram(rootProgAvatar_1.rootProgAvatar);
        expect(ProgramObjectInterface_1.progEquivalent(rootProgAvatar_1.rootProgAvatar, ccblAdapter.getRootProgram())).toBe(true);
    });
    it("All imported and exported channels are set for the root program", () => {
        const importexportChannels = [
            ...rootProgAvatar_1.rootProgAvatar.dependencies.import.channels,
            ...rootProgAvatar_1.rootProgAvatar.dependencies.export.channels
        ];
        const channels = ccblAdapter.getChannels();
        console.log(channels, importexportChannels);
        expect(deepEqual(channels, importexportChannels)).toBe(true);
    });
    it("Should be possible to load the root program", () => {
        ccblAdapter.setRootProgram(rootProgAvatar_1.rootProgAvatar);
        const p = ccblAdapter.getRootProgram();
        expect(ProgramObjectInterface_1.progEquivalent(p, rootProgAvatar_1.rootProgAvatar)).toBe(true);
    });
    it("Should be possible to load the subprogram Avatar", () => {
        ccblAdapter.loadSubProgram({
            program: progAvatar_1.AvatarProgDescr,
            programName: "Avatar",
            programsPath: []
        });
        const P = ccblAdapter.getRootProgram();
        const expectedP = Object.assign(Object.assign({}, rootProgAvatar_1.rootProgAvatar), { subPrograms: {
                "Avatar": progAvatar_1.AvatarProgDescr
            } });
        expect(ProgramObjectInterface_1.progEquivalent(P, expectedP)).toBe(true);
    });
    it("Should be possible to load the Avatar program inside the root program, in context 'rootProgChild' via Allen.During'", () => {
        ccblAdapter.instanciateSubProgram({
            instanceName: "AvatarAlice",
            programName: "Avatar",
            programsPath: [],
            insideContextNamed: "rootProgChild",
            viaAllenRelation: AllenInterface_1.AllenType.During,
            mapInputs: {}
        });
        const P = ccblAdapter.getRootProgram();
        const expectedP = Object.assign(Object.assign({}, JSON.parse(JSON.stringify(rootProgAvatar_1.rootProgAvatar))), { subPrograms: {
                "Avatar": progAvatar_1.AvatarProgDescr
            } });
        const rootProgChild = expectedP.allen.During[0];
        rootProgChild.allen = {
            During: [{
                    programId: "Avatar",
                    as: "AvatarAlice",
                    mapInputs: {}
                }]
        };
        expect(ProgramObjectInterface_1.progEquivalent(P, expectedP)).toBe(true);
    });
    it("Should be possible to unload the AvatarAlice instance", () => {
        ccblAdapter.unloadProgramInstance("AvatarAlice", []);
        const P = ccblAdapter.getRootProgram();
        const expectedP = Object.assign(Object.assign({}, JSON.parse(JSON.stringify(rootProgAvatar_1.rootProgAvatar))), { subPrograms: {
                "Avatar": progAvatar_1.AvatarProgDescr
            } });
        expect(ProgramObjectInterface_1.progEquivalent(P, expectedP)).toBe(true);
    });
    it("Should be possible to unload the Avatar program", () => {
        ccblAdapter.unloadProgram("Avatar", []);
        const p = ccblAdapter.getRootProgram();
        expect(ProgramObjectInterface_1.progEquivalent(p, rootProgAvatar_1.rootProgAvatar)).toBe(true);
    });
});
describe("Playing with Avatar program, channels are updated correctly", () => {
    const ccblAdapter = new CcblAdapterLocal_1.CcblAdapterLocal();
    ccblAdapter.appendChannels({ name: "lampAvatar", type: "color" }, "");
    ccblAdapter.appendEmitters({ name: "BobAtHome", type: "boolean" }, false);
    ccblAdapter.appendEmitters({ name: "AliceAtHome", type: "boolean" }, false);
    ccblAdapter.appendEmitters({ name: "AliceAtBobHome", type: "boolean" }, false);
    ccblAdapter.appendEmitters({ name: "AliceAvailable", type: "boolean" }, false);
    ccblAdapter.appendEmitters({ name: "securityMode", type: "boolean" }, false);
    let lampAvatar = "";
    let MusicMode = "";
    it("Loading of rootProgAvatar as root program", () => {
        ccblAdapter.setRootProgram(rootProgAvatar_1.rootProgAvatar);
        console.log(lampAvatar, MusicMode);
        ccblAdapter.getObsForChan("lampAvatar").subscribe(v => lampAvatar = v);
        ccblAdapter.getObsForChan("MusicMode").subscribe(v => MusicMode = v);
    });
    it("Registered channels are the ones needed for the root program", () => {
        const importexportChannels = [
            ...rootProgAvatar_1.rootProgAvatar.dependencies.import.channels,
            ...rootProgAvatar_1.rootProgAvatar.dependencies.export.channels
        ];
        const channels = ccblAdapter.getChannels();
        console.log(channels, importexportChannels);
        expect(deepEqual(channels, importexportChannels)).toBe(true);
    });
    it("Initialization of data are OK in CCBL", () => {
        const progRoot = ccblAdapter.getCcblRootProgram();
        expect(progRoot.getValue("lampAvatar")).toEqual("off");
        expect(progRoot.getValue("MusicMode")).toEqual("off");
    });
    it("Initialization of data are OK outside CCBL", () => {
        expect(lampAvatar).toEqual("off");
        expect(MusicMode).toEqual("off");
    });
    it("when security mode is on then lamp is white", () => __awaiter(void 0, void 0, void 0, function* () {
        ccblAdapter.updatesFromOutside({ timestamp: 0, type: "emitter", varName: "securityMode", value: true });
        yield update_1.waitP(101);
        expect(lampAvatar).toEqual("white");
        expect(MusicMode).toEqual("off");
    }));
});
//# sourceMappingURL=CcblAdapterLocal.spec.js.map