"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const progAvatar_1 = require("ccbl-js/lib/testsProg/progAvatar");
const CcblAdapterLocal_1 = require("./CcblAdapterLocal");
const rootProgAvatar_1 = require("./programs/rootProgAvatar");
const AllenInterface_1 = require("ccbl-js/lib/AllenInterface");
const ProgramObjectInterface_1 = require("ccbl-js/lib/ProgramObjectInterface");
const deepEqual = require("deep-equal");
describe("Loading Avatar program, exo 4 fropm CCBL EICS paper", () => {
    const ccblAdapter = new CcblAdapterLocal_1.CcblAdapterLocal();
    ccblAdapter.appendChannels({ name: "lampAvatar", type: "color" }, undefined);
    ccblAdapter.appendChannels({ name: "MusicMode", type: "string" }, undefined);
    ccblAdapter.appendEmitters({ name: "BobAtHome", type: "boolean" });
    ccblAdapter.appendEmitters({ name: "AliceAtHome", type: "boolean" });
    ccblAdapter.appendEmitters({ name: "AliceAtBobHome", type: "boolean" });
    ccblAdapter.appendEmitters({ name: "AliceAvailable", type: "boolean" });
    ccblAdapter.appendEmitters({ name: "securityMode", type: "boolean" });
    it("All imported and exported channels are set for the root program", () => {
        const importexportChannels = [
            ...rootProgAvatar_1.rootProgDescr.dependencies.import.channels,
            ...rootProgAvatar_1.rootProgDescr.dependencies.export.channels
        ];
        const channels = ccblAdapter.getChannels();
        console.log(channels, importexportChannels);
        expect(deepEqual(channels, importexportChannels)).toBe(true);
    });
    it("Should be possible to load the root program", () => {
        ccblAdapter.setRootProgram(rootProgAvatar_1.rootProgDescr);
        const p = ccblAdapter.getRootProgram();
        expect(ProgramObjectInterface_1.progEquivalent(p, rootProgAvatar_1.rootProgDescr)).toBe(true);
    });
    it("Should be possible to load the subprogram Avatar", () => {
        ccblAdapter.loadSubProgram({
            program: progAvatar_1.AvatarProgDescr,
            programName: "Avatar",
            programsPath: []
        });
        const P = ccblAdapter.getRootProgram();
        const expectedP = Object.assign({}, rootProgAvatar_1.rootProgDescr, { subPrograms: {
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
        const expectedP = Object.assign({}, JSON.parse(JSON.stringify(rootProgAvatar_1.rootProgDescr)), { subPrograms: {
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
        expect(deepEqual(P, expectedP)).toBe(true);
    });
    it("Should be possible to unload the AvatarAlice instance", () => {
        ccblAdapter.unloadProgramInstance("AvatarAlice", []);
        const P = ccblAdapter.getRootProgram();
        const expectedP = Object.assign({}, JSON.parse(JSON.stringify(rootProgAvatar_1.rootProgDescr)), { subPrograms: {
                "Avatar": progAvatar_1.AvatarProgDescr
            } });
        expect(ProgramObjectInterface_1.progEquivalent(P, expectedP)).toBe(true);
    });
    it("Should be possible to unload the Avatar program", () => {
        ccblAdapter.unloadProgram("Avatar", []);
        const p = ccblAdapter.getRootProgram();
        expect(ProgramObjectInterface_1.progEquivalent(p, rootProgAvatar_1.rootProgDescr)).toBe(true);
    });
});
describe("Playing with Avatar program, channels are updated correctly", () => {
    const ccblAdapter = new CcblAdapterLocal_1.CcblAdapterLocal();
    ccblAdapter.appendChannels({ name: "lampAvatar", type: "color" }, undefined);
    ccblAdapter.appendChannels({ name: "MusicMode", type: "string" }, undefined);
    ccblAdapter.appendEmitters({ name: "BobAtHome", type: "boolean" });
    ccblAdapter.appendEmitters({ name: "AliceAtHome", type: "boolean" });
    ccblAdapter.appendEmitters({ name: "AliceAtBobHome", type: "boolean" });
    ccblAdapter.appendEmitters({ name: "AliceAvailable", type: "boolean" });
    ccblAdapter.appendEmitters({ name: "securityMode", type: "boolean" });
    let lampAvatar = "";
    ccblAdapter.getObsForChan("lampAvatar").subscribe(v => lampAvatar = v);
    let MusicMode = "";
    ccblAdapter.getObsForChan("MusicMode").subscribe(v => MusicMode = v);
    it("Registered channels are the ones needed for the root program", () => {
        const importexportChannels = [
            ...rootProgAvatar_1.rootProgDescr.dependencies.import.channels,
            ...rootProgAvatar_1.rootProgDescr.dependencies.export.channels
        ];
        const channels = ccblAdapter.getChannels();
        console.log(channels, importexportChannels);
        expect(deepEqual(channels, importexportChannels)).toBe(true);
    });
    it("Initialization of data are OK", () => {
        ccblAdapter.updatesFromOutside({ varName: "BobAtHome", value: false }, { varName: "AliceAtHome", value: false }, { varName: "AliceAtBobHome", value: false }, { varName: "AliceAvailable", value: false }, { varName: "securityMode", value: false });
        ccblAdapter.sync(100);
        expect(lampAvatar).toEqual("off");
        expect(MusicMode).toEqual("off");
    });
});
//# sourceMappingURL=CcblAdapterLocal.spec.js.map