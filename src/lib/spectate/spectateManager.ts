import { URI_BASE } from "../env";

export async function startSpec(fetch: typeof globalThis.fetch): Promise<void> {
    const response = await fetch(URI_BASE + "/spectate/start", {method: "POST"});

    if (!response.ok) {
        throw new Error(await response.text());
    }
    return Promise.resolve();
}

export async function stopSpec(fetch: typeof globalThis.fetch): Promise<void> {
    const response = await fetch(URI_BASE + "/spectate/stop", {method: "POST"});

    if (!response.ok) {
        throw new Error(await response.text());
    }
    return Promise.resolve();
}