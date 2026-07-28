import type { DraftData, DraftPlayer } from "./DraftData";
import { URI_BASE } from "../env";
import type { ChampionData } from "./StateDto";



export interface FinishedDraft {
    gameId: string;
    picks: FinalPlayer[];
}

export interface FinalPlayer {
    team: Team;
    assignedPosition: string;
    champion: ChampionData | null;
    gameName: string;
    internalName: string;
    playerAlias: string;
    summonerId: string;
}

export enum Team {
    BLUE_SIDE ="BLUE_SIDE",
    RED_SIDE = "RED_SIDE"
}

export async function getPreviousDrafts(fetch: typeof globalThis.fetch): Promise<FinishedDraft[]> {
    const response = await fetch(URI_BASE + "/draft/previous");

    if (!response.ok) {
        throw new Error(await response.text());
    }
    return response.json() as Promise<FinishedDraft[]>;
}

    export function applyFearlessRules(incomingDraftData: DraftData, draftData: DraftData, callback: (res: FinishedDraft) => void) {
        if (incomingDraftData.gameId != draftData.gameId) {
            if (draftData.phase === "FINALIZATION") {
                console.log("New Game detected with old draft completed!");
                callback(mapDraftToFinal(draftData));
            }
        }
    }

    function mapDraftToFinal(draftData: DraftData): FinishedDraft{
        var players = draftData.blueTeam.map(player => mapDraftPlayerToFinalPlayer(player))
        let res: FinishedDraft = {gameId: draftData.gameId, picks: players};
        return res;
    }

    function mapDraftPlayerToFinalPlayer(draftPlayer: DraftPlayer): FinalPlayer {
        const team: Team = draftPlayer.playerInfo.team === "BLUE_SIDE" ? Team.BLUE_SIDE : Team.RED_SIDE;
        return {
            assignedPosition: draftPlayer.playerInfo.assignedPosition,
            gameName: draftPlayer.playerInfo.gameName,
            internalName: draftPlayer.playerInfo.internalName,
            summonerId: draftPlayer.playerInfo.summonerId,
            playerAlias: draftPlayer.playerInfo.playerAlias,
            team,
            champion: draftPlayer.playerInfo.champion
        }
    }