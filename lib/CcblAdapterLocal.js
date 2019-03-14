"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ExecutionEnvironment_1 = require("ccbl-js/lib/ExecutionEnvironment");
const Clock_1 = require("ccbl-js/lib/Clock");
const Channel_1 = require("ccbl-js/lib/Channel");
const EmitterValue_1 = require("ccbl-js/lib/EmitterValue");
const rxjs_1 = require("rxjs");
const ProgramObject_1 = require("ccbl-js/lib/ProgramObject");
const operators_1 = require("rxjs/operators");
const Event_1 = require("ccbl-js/lib/Event");
class CcblAdapterLocal {
    constructor() {
        this.channels = new Map();
        this.emitters = new Map();
        this.events = new Map();
        this.subjUpdateFromOutside = new rxjs_1.Subject();
        this.clock = new Clock_1.CCBLTestClock();
        this.env = new ExecutionEnvironment_1.CCBLEnvironmentExecution(this.clock);
        this.obsUpdateFromOutside = this.subjUpdateFromOutside.pipe(operators_1.bufferTime(100), operators_1.filter(updates => updates.length > 0));
        this.obsUpdateFromOutside.subscribe(updates => this.applyUpdatesToCCBL(...updates));
    }
    getValueFromCCBL(varName) {
        return this._progRoot ? this._progRoot.getValue(varName) : undefined;
    }
    getCcblRootProgram() {
        return this._progRoot;
    }
    getRootProgram() {
        return this._progRoot.toHumanReadableProgram();
    }
    setEnvForProgram(program) {
        program.dependencies = program.dependencies || {};
        program.dependencies.import = program.dependencies.import || {};
        program.dependencies.import.emitters = program.dependencies.import.emitters || [];
        program.dependencies.import.events = program.dependencies.import.events || [];
        program.dependencies.import.channels = program.dependencies.import.channels || [];
        program.dependencies.import.emitters.forEach(e => this.appendEmitters(e, undefined));
        program.dependencies.import.channels.forEach(c => this.appendChannels(c, undefined));
        program.dependencies.import.events.forEach(e => this.appendEvents(e));
    }
    setRootProgram(program) {
        if (this._progRoot) {
            this._progRoot.dispose();
        }
        this._progRoot = new ProgramObject_1.CCBLProgramObject("progRoot", this.clock);
        this._progRoot.loadHumanReadableProgram(program, this.env, {});
        this._progRoot.activate();
        Channel_1.commitStateActions();
        const dependencies = program.dependencies || {};
        const imports = dependencies.import || {};
        const exports = dependencies.export || {};
        const channels = [
            ...(imports.channels ? imports.channels : []),
            ...(exports.channels ? exports.channels : [])
        ];
        channels.forEach(c => {
            const chan = this._progRoot.getChannel(c.name);
            const subj = new rxjs_1.BehaviorSubject(chan.getValueEmitter().get());
            const chanDescr = {
                descr: c,
                chan,
                emitter: chan.getValueEmitter(),
                subj,
                obs: subj.asObservable(),
                cbUpdate: v => subj.next(v)
            };
            this.channels.set(c.name, chanDescr);
            chan.getValueEmitter().on(chanDescr.cbUpdate);
        });
        const emitters = [
            ...(imports.emitters ? imports.emitters : [])
        ];
        emitters.forEach(e => {
            const emitter = this._progRoot.getEmitter(e.name);
            const subj = new rxjs_1.BehaviorSubject(emitter.get());
            const emitterDescr = {
                descr: e,
                emitter,
                subj,
                obs: subj.asObservable(),
                cbUpdate: v => subj.next(v)
            };
            this.emitters.set(e.name, emitterDescr);
        });
        const events = [
            ...(imports.events ? imports.events : [])
        ];
        events.forEach(evt => {
            const event = this._progRoot.getEventer(evt.name);
            const subj = new rxjs_1.Subject();
            const eventDescription = {
                descr: evt,
                event,
                subj,
                obs: subj.asObservable(),
                cbUpdate: v => subj.next(v)
            };
            this.events.set(evt.name, eventDescription);
        });
    }
    instanciateSubProgram(conf) {
        const prog = conf.programsPath.reduce((P, instanceName) => {
            return P;
        }, this._progRoot);
        prog.plugSubProgramAs({
            programId: conf.programName,
            as: conf.instanceName,
            mapInputs: conf.mapInputs,
            allen: conf.viaAllenRelation,
            hostContextName: conf.insideContextNamed
        });
    }
    loadSubProgram(conf) {
        const prog = this.getProgFromPath(conf.programName, conf.programsPath);
        prog.appendSubProgram(conf.programName, conf.program);
    }
    unloadProgram(name, fromPath) {
        if (fromPath.length > 0) {
            const parentName = fromPath.pop();
            const parentProg = this.getProgFromPath(parentName, fromPath);
            parentProg.removeSubProgram(name);
        }
        else {
            this._progRoot.removeSubProgram(name);
        }
    }
    unloadProgramInstance(name, fromPath) {
        const prog = this.getProgFromPath(name, fromPath);
        if (prog) {
            if (fromPath.length > 0) {
                const parentName = fromPath.pop();
                const parentProg = this.getProgFromPath(parentName, fromPath);
                parentProg.unplugSubProgramInstance(name);
            }
            else {
                this._progRoot.unplugSubProgramInstance(name);
            }
        }
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
        env.emitters.forEach(e => this.appendEmitters(e, undefined));
        env.events.forEach(e => this.appendEvents(e));
    }
    appendChannels(c, value) {
        const channel = new Channel_1.Channel(new EmitterValue_1.CCBLEmitterValue(value));
        this.env.register_Channel(c.name, channel);
    }
    appendEmitters(e, value) {
        const emitter = new EmitterValue_1.CCBLEmitterValue(value);
        this.env.register_CCBLEmitterValue(e.name, emitter);
    }
    appendEvents(e) {
        const event = new Event_1.CCBLEvent({
            eventName: e.name,
            env: this.env
        });
        this.env.registerCCBLEvent(e.name, event);
    }
    updatesFromOutside(...updates) {
        updates.forEach(u => this.subjUpdateFromOutside.next(u));
    }
    getObsForChan(name) {
        const chanDescr = this.channels.get(name);
        return chanDescr ? chanDescr.obs : undefined;
    }
    sync(ms) {
        this.clock.goto(ms);
        Channel_1.commitStateActions();
    }
    getProgFromPath(progName, path) {
        return path.reduce((P, instanceName) => {
            return P ? P.getProgramInstance(instanceName) : P;
        }, this._progRoot);
    }
    applyUpdatesToCCBL(...updates) {
        updates.forEach(update => {
            switch (update.type) {
                case "channel":
                    const chanDescr = this.channels.get(update.varName);
                    if (chanDescr && chanDescr.chan) {
                        chanDescr.chan.getValueEmitter().set(update.value);
                    }
                    break;
                case "emitter":
                    const emitterDescr = this.emitters.get(update.varName);
                    if (emitterDescr && emitterDescr.emitter) {
                        emitterDescr.emitter.set(update.value);
                    }
                    break;
                case "event":
                    const eventDescr = this.events.get(update.varName);
                    if (eventDescr && eventDescr.event) {
                        this.clock.goto(update.timestamp);
                        eventDescr.event.trigger({
                            value: update.value,
                            ms: update.timestamp
                        });
                    }
                    break;
                default:
                    console.error("Receiving an update of an unknow outside variable", update);
            }
            this.clock.goto(update.timestamp);
        });
        Channel_1.commitStateActions();
    }
}
exports.CcblAdapterLocal = CcblAdapterLocal;
//# sourceMappingURL=CcblAdapterLocal.js.map