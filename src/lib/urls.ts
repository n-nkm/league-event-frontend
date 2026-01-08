
export function encodeToUrlParam(positionOverwrites: { riotId: string; overwrite: string }[]): URL {
        const json = JSON.stringify(positionOverwrites);
        const base64 = btoa(encodeURIComponent(json));

        const url = new URL(window.location.href.replace(/\/preparator\/?/, "/index"));
        url.searchParams.set("state", base64);

        return url;
    }

    