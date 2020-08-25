/// <reference types="node" />
import { Socket } from "net";
import TypedEmitter from "typed-emitter";
export interface RconOptions {
    host: string;
    /** @default 25575 */
    port?: number;
    password: string;
    /**
     * Maximum time for a packet to arrive before an error is thrown
     * @default 2000 ms
     */
    timeout?: number;
    /**
     * Maximum number of parallel requests. Most minecraft servers can
     * only reliably process one packet at a time.
     * @default 1
     */
    maxPending?: number;
}
interface Events {
    connect: () => void;
    authenticated: () => void;
    end: () => void;
    error: (error: any) => void;
    chat_message: (message: any) => void;
}
export declare class Rcon {
    static connect(config: RconOptions): Promise<Rcon>;
    private sendQueue;
    private callbacks;
    private requestId;
    config: Required<RconOptions>;
    emitter: TypedEmitter<Events>;
    socket: Socket | null;
    authenticated: boolean;
    on: <E extends "error" | "end" | "connect" | "authenticated" | "chat_message">(event: E, listener: Events[E]) => TypedEmitter<Events>;
    once: <E extends "error" | "end" | "connect" | "authenticated" | "chat_message">(event: E, listener: Events[E]) => TypedEmitter<Events>;
    off: <E extends "error" | "end" | "connect" | "authenticated" | "chat_message">(event: E, listener: Events[E]) => TypedEmitter<Events>;
    constructor(config: RconOptions);
    connect(): Promise<this>;
    /**
      Close the connection to the server.
    */
    end(): Promise<void>;
    /**
      Send a command to the server.

      @param command The command that will be executed on the server.
      @returns A promise that will be resolved with the command's response from the server.
    */
    send(command: string): Promise<string>;
    sendRaw(buffer: Buffer): Promise<Buffer>;
    private sendPacket;
    private handlePacket;
}
export {};
