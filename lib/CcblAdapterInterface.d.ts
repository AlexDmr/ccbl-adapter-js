import { CCBLProgramObjectInterface, HumanReadableProgram, VariableDescription, Vocabulary } from "ccbl-js/lib/ProgramObjectInterface";
import { AllenType } from "ccbl-js/lib/AllenInterface";
import { Observable } from "rxjs";
import { Update } from "./Traces/update";
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
export interface CcblAdapterInterface {
    getCcblRootProgram(): CCBLProgramObjectInterface;
    getRootProgram(): HumanReadableProgram;
    setRootProgram(program: HumanReadableProgram): any;
    loadSubProgram(conf: subProgDeclaration): any;
    instanciateSubProgram(conf: subProgInstanciation): any;
    setEnvForProgram(program: HumanReadableProgram): any;
    getRootProgram(): HumanReadableProgram;
    unloadProgramInstance(name: string, fromPath: PROGRAM_ID[]): any;
    unloadProgram(name: string, fromPath: PROGRAM_ID[]): any;
    getEnvironment(): Vocabulary;
    getChannels(): VariableDescription[];
    getEmitters(): VariableDescription[];
    getEvents(): VariableDescription[];
    getObsForChan<T>(name: string): Observable<T>;
    getValueFromCCBL(varName: string): any;
    appendEnvironment(env: Vocabulary): any;
    appendChannels<T>(c: VariableDescription, value: T): any;
    appendEmitters<T>(e: VariableDescription, value: T): any;
    appendEvents<T>(e: VariableDescription): any;
    updatesFromOutside(...updates: Update[]): any;
    sync(ms: number): any;
}
