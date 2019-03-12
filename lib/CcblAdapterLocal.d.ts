import { CCBLProgramObjectInterface, HumanReadableProgram, VariableDescription, Vocabulary } from "ccbl-js/lib/ProgramObjectInterface";
import { CcblAdapterInterface, PROGRAM_ID, subProgDeclaration, subProgInstanciation } from "./CcblAdapterInterface";
import { Observable } from "rxjs";
import { Update } from "./Traces/update";
export declare class CcblAdapterLocal implements CcblAdapterInterface {
    private env;
    private clock;
    private _progRoot;
    private channels;
    private emitters;
    private events;
    private subjUpdateFromOutside;
    private obsUpdateFromOutside;
    constructor();
    getValueFromCCBL(varName: string): any;
    getCcblRootProgram(): CCBLProgramObjectInterface;
    getRootProgram(): HumanReadableProgram;
    setEnvForProgram(program: HumanReadableProgram): void;
    setRootProgram(program: HumanReadableProgram): void;
    instanciateSubProgram(conf: subProgInstanciation): void;
    loadSubProgram(conf: subProgDeclaration): void;
    unloadProgram(name: string, fromPath: PROGRAM_ID[]): void;
    unloadProgramInstance(name: string, fromPath: PROGRAM_ID[]): void;
    getEnvironment(): Vocabulary;
    getChannels(): VariableDescription[];
    getEmitters(): VariableDescription[];
    getEvents(): VariableDescription[];
    appendEnvironment(env: Vocabulary): void;
    appendChannels<T>(c: VariableDescription, value: T): void;
    appendEmitters<T>(e: VariableDescription, value: T): void;
    appendEvents(e: VariableDescription): void;
    updatesFromOutside(...updates: Update[]): void;
    getObsForChan<T>(name: string): Observable<T>;
    sync(ms: number): void;
    private getProgFromPath;
    private applyUpdatesToCCBL;
}
