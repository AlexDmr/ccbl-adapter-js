import { HumanReadableProgram, VariableDescription, Vocabulary } from "ccbl-js/lib/ProgramObjectInterface";
import { CcblAdapterInterface, PROGRAM_ID, subProgDeclaration, subProgInstanciation, varUpdate } from "./CcblAdapterInterface";
import { AllenType } from "ccbl-js/lib/AllenInterface";
import { Observable } from "@reactivex/rxjs/dist-compat/typings/src";
export declare class CcblAdapterLocal implements CcblAdapterInterface {
    private env;
    private clock;
    private channels;
    constructor();
    getRootProgram(): HumanReadableProgram;
    setRootProgram(program: HumanReadableProgram): void;
    load(program: HumanReadableProgram, name?: string, insideContextNamed?: string, viaAllenRelation?: AllenType): void;
    instanciateSubProgram(descr: subProgInstanciation): void;
    loadSubProgram(conf: subProgDeclaration): void;
    unloadProgram(name: string, fromPath: PROGRAM_ID[]): void;
    unloadProgramInstance(name: string, fromPath: PROGRAM_ID[]): void;
    getEnvironment(): Vocabulary;
    getChannels(): VariableDescription[];
    getEmitters(): VariableDescription[];
    getEvents(): VariableDescription[];
    appendEnvironment(env: Vocabulary): void;
    appendChannels<T>(c: VariableDescription, value: T): void;
    appendEmitters(e: VariableDescription): void;
    appendEvents(e: VariableDescription): void;
    updatesFromOutside(...updates: varUpdate[]): void;
    updatesFromCCBL(...updates: varUpdate[]): void;
    getObsForChan<T>(name: string): Observable<T>;
    sync(ms: number): void;
}
