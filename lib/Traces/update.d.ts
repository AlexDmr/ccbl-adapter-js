export interface Update {
    type: 'channel' | 'emitter' | 'event';
    varName: string;
    value: any;
    timestamp: number;
}
export declare function waitP(ms: number): Promise<void>;
