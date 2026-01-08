import championImage from '$lib/assets/ban_champion_placeholder.png';

export const returnemptyBan: (team: string) => ActionData = (team) => {
    const result = {
        actionType: "BAN",
        targetChampion: {
            name: "-",
            htmlImageSrc: championImage
        },
        cellId: 0,
        pickTurn: 0,
        team,
        isInProgress: false
    };
    return result;
}

export const returnEmptyPlayer: (team: string, cellId: number) => { playerInfo: PlayerData; playerActions: ActionData[];} = (team, cellId) => {
    return {
        playerInfo: {
            assignedPosition: "",
            cellId: 0,
            champion: null,
            championPickIntent: null,
            gameName: "-",
            internalName: "",
            pickTurn: cellId,
            playerAlias: "",
            spell1Id: null,
            spell2Id: null,
            summonerId: "12",
            team
        },
        playerActions: []
    }
}