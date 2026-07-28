import type { ActionData, PlayerData } from "./StateDto";

export interface DraftData {
    blueTeamBans: ActionData[];
    redTeamBans: ActionData[];
    blueTeam: DraftPlayer[] ;
    redTeam: DraftPlayer[] ;
    remainingTime: number;
    phase: string;
    gameId: string;
}

export interface DraftPlayer { playerInfo: PlayerData; playerActions: ActionData[];}