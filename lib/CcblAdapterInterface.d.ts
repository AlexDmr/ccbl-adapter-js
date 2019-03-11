import { HumanReadableProgram, VariableDescription, Vocabulary } from "ccbl-js/lib/ProgramObjectInterface";
import { AllenType } from "ccbl-js/lib/AllenInterface";
import { Observable } from "@reactivex/rxjs/dist-compat/typings/src";
export declare type PROGRAM_ID = string;
export interface subProgInstanciation {
    programName: string;
    instanceName: PROGRAM_ID;
    programsPath: PROGRAM_ID[];
    insideContextNamed: string;
    viaAllenRelation: AllenType;
    mapInputs: {
        [key: string]: string;
    };
}
export interface subProgDeclaration {
    programName: string;
    programsPath: PROGRAM_ID[];
    program: HumanReadableProgram;
}
export interface varUpdate {
    varName: string;
    value: any;
}
export interface CcblAdapterInterface {
    setRootProgram(program: HumanReadableProgram): any;
    loadSubProgram(conf: subProgDeclaration): any;
    instanciateSubProgram(conf: subProgInstanciation): any;
    getRootProgram(): HumanReadableProgram;
    unloadProgramInstance(name: string, fromPath: PROGRAM_ID[]): any;
    unloadProgram(name: string, fromPath: PROGRAM_ID[]): any;
    getEnvironment(): Vocabulary;
    getChannels(): VariableDescription[];
    getEmitters(): VariableDescription[];
    getEvents(): VariableDescription[];
    getObsForChan<T>(name: string): Observable<T>;
    appendEnvironment(env: Vocabulary): any;
    appendChannels(c: VariableDescription, value: any): any;
    appendEmitters(e: VariableDescription): any;
    appendEvents(e: VariableDescription): any;
    updatesFromOutside(...updates: varUpdate[]): any;
    updatesFromCCBL(...updates: varUpdate[]): any;
    sync(ms: number): any;
}
