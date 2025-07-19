import * as dotenv from "dotenv";

dotenv.config();

export function checkEnv(envVal: string) {
    const env = process.env[envVal]

    if (env !== undefined) {
        return env
    } else {
        throw new Error(`ENV ${envVal} is undefined`);
    }
}