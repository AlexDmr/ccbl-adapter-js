"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ExecutionEnvironment_1 = require("ccbl-js/lib/ExecutionEnvironment");
const Clock_1 = require("ccbl-js/lib/Clock");
const Channel_1 = require("ccbl-js/lib/Channel");
const EmitterValue_1 = require("ccbl-js/lib/EmitterValue");
const src_1 = require("@reactivex/rxjs/dist-compat/typings/src");
class CcblAdapterLocal {
    constructor() {
        this.channels = new Map();
        this.clock = new Clock_1.CCBLTestClock();
        this.env = new ExecutionEnvironment_1.CCBLEnvironmentExecution(this.clock);
    }
    getRootProgram() {
        return undefined;
    }
    setRootProgram(program) {
    }
    load(program, name, insideContextNamed, viaAllenRelation) {
    }
    instanciateSubProgram(descr) {
    }
    loadSubProgram(conf) {
    }
    unloadProgram(name, fromPath) {
    }
    unloadProgramInstance(name, fromPath) {
    }
    getEnvironment() {
        return {
            channels: this.getChannels(),
            emitters: this.getEmitters(),
            events: this.getEvents()
        };
    }
    getChannels() {
        const TC = [];
        this.channels.forEach(({ descr }) => {
            TC.push(descr);
        });
        return TC;
    }
    getEmitters() {
        return [];
    }
    getEvents() {
        return [];
    }
    appendEnvironment(env) {
        env.channels.forEach(c => this.appendChannels(c, undefined));
        env.emitters.forEach(e => this.appendEmitters(e));
        env.events.forEach(e => this.appendEvents(e));
    }
    appendChannels(c, value) {
        const channel = new Channel_1.Channel(new EmitterValue_1.CCBLEmitterValue(value));
        const subj = new src_1.BehaviorSubject(value);
        this.channels.set(c.name, {
            descr: c,
            chan: channel,
            subj,
            obs: subj.asObservable()
        });
        this.env.register_Channel(c.name, channel);
    }
    appendEmitters(e) {
    }
    appendEvents(e) {
    }
    updatesFromOutside(...updates) {
    }
    updatesFromCCBL(...updates) {
        updates.forEach(update => {
        });
    }
    getObsForChan(name) {
        const chanDescr = this.channels.get(name);
        return chanDescr ? chanDescr.obs : undefined;
    }
    sync(ms) {
        this.clock.goto(ms);
        Channel_1.commitStateActions();
    }
}
exports.CcblAdapterLocal = CcblAdapterLocal;
//# sourceMappingURL=CcblAdapterLocal.js.map