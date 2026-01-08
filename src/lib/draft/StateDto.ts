interface ChampSelectStateEvent {
    phase: string;
    remainingTime: number;
    players: PlayerData[]
    actions: ActionData[];
    gameId: string;
    id: string;
}

interface ChampionData {
    name: string;
    htmlImageSrc: string;
}

interface SummonerData {
    spellId: number;
    htmlImageSrc: string;
}

interface ActionData {actionType: string; targetChampion: ChampionData | null; cellId: number; pickTurn: number; team: string; isInProgress: boolean}
interface PlayerData { team: string; assignedPosition: string; cellId: number; champion: ChampionData | null; championPickIntent: ChampionData | null; gameName: string; internalName: string; pickTurn: number; playerAlias: string; spell1Id: SummonerData | null; spell2Id: SummonerData | null; summonerId: string; }