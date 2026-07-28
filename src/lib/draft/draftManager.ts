import { URI_BASE } from "../env";

export async function startDraft(fetch: typeof globalThis.fetch): Promise<void> {
    const response = await fetch(URI_BASE + "/draft/start", {method: "POST"});

    if (!response.ok) {
        throw new Error(await response.text());
    }
    return Promise.resolve();
}

export async function stopDraft(fetch: typeof globalThis.fetch): Promise<void> {
    const response = await fetch(URI_BASE + "/draft/stop", {method: "POST"});

    if (!response.ok) {
        throw new Error(await response.text());
    }
    return Promise.resolve();
}

export async function resetDraft(fetch: typeof globalThis.fetch): Promise<void> {
    const response = await fetch(URI_BASE + "/draft/reset", {method: "POST"});

    if (!response.ok) {
        throw new Error(await response.text());
    }
    return Promise.resolve();
}

export async function shortenDraft(fetch: typeof globalThis.fetch, gameId:string): Promise<void> {
    const response = await fetch(URI_BASE + "/draft/previous/"+ gameId, {method: "DELETE"});

    if (!response.ok) {
        throw new Error(await response.text());
    }
    return Promise.resolve();
}