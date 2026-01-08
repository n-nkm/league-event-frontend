<script lang="ts">
    import { onMount } from "svelte";
    import { Client, type messageCallbackType } from "@stomp/stompjs";
    import { exampleDraft } from "$lib/draft/Example";
    import { returnemptyBan, returnEmptyPlayer } from "$lib/draft/DefaultData";
    import type { DraftData, DraftPlayer } from "$lib/draft/DraftData";
    import { asset } from "$app/paths";
    import pickPlaceholder from "$lib/assets/pick_champion_placeholder.png";

    let draftData: DraftData = $state({
        blueTeamBans: [],
        redTeamBans: [],
        blueTeam: [],
        redTeam: [],
        phase: "",
        remainingTime: 0,
    });

    const handleChampSelectEvent: messageCallbackType = (msg) => {
        var body: ChampSelectStateEvent = JSON.parse(msg.body);
        var incomingSorted = sortChampSelectState(body);
        var viewDraftData = padDraftData(incomingSorted);
        draftData = viewDraftData;
    };

    function padDraftData(rawDraft: DraftData): DraftData {
        let paddedDraft: DraftData = {
            ...rawDraft,
        };
        while (paddedDraft.blueTeamBans.length < 5) {
            const bane = returnemptyBan("BLUE_TEAM");
            console.dir(bane);
            paddedDraft.blueTeamBans.push(bane);
        }
        while (paddedDraft.redTeamBans.length < 5) {
            paddedDraft.redTeamBans.push(returnemptyBan("RED_TEAM"));
        }

        for (let i = 0; paddedDraft.blueTeam.length < 5; i++) {
            paddedDraft.blueTeam.push(returnEmptyPlayer("BLUE_TEAM", 90 + i));
        }
        for (let i = 0; paddedDraft.redTeam.length < 5; i++) {
            paddedDraft.redTeam.push(returnEmptyPlayer("RED_TEAM", 90 + i));
        }
        return paddedDraft;
    }

    function sortChampSelectState(event: ChampSelectStateEvent): DraftData {
        let incomingDraftData: DraftData = {
            blueTeamBans: [],
            redTeamBans: [],
            blueTeam: [],
            redTeam: [],
            remainingTime: 0,
            phase: "",
        };
        incomingDraftData.remainingTime = event.remainingTime;
        incomingDraftData.phase = event.phase;
        event.players.forEach((player) => {
            if (player.team === "BLUE_SIDE") {
                incomingDraftData.blueTeam.push({
                    playerInfo: player,
                    playerActions: [],
                });
            } else if (player.team === "RED_SIDE") {
                incomingDraftData.redTeam.push({
                    playerInfo: player,
                    playerActions: [],
                });
            }
        });

        event.actions
            .filter((action) => !!action?.targetChampion)
            .forEach((action) => {
                if (action.actionType === "BAN") {
                    if (action.team === "BLUE_SIDE") {
                        incomingDraftData.blueTeamBans.push(action);
                    } else {
                        incomingDraftData.redTeamBans.push(action);
                    }
                }

                if (action.actionType === "PICK") {
                    if (action.team === "BLUE_SIDE") {
                        incomingDraftData.blueTeam
                            .find(
                                (player) =>
                                    player.playerInfo.cellId == action.cellId,
                            )
                            ?.playerActions.push(action);
                    } else {
                        incomingDraftData.redTeam
                            .find(
                                (player) =>
                                    player.playerInfo.cellId == action.cellId,
                            )
                            ?.playerActions.push(action);
                    }
                }
            });
        return incomingDraftData;
    }

    function startTimerSeconds() {
        setInterval(() => {
            if (draftData.remainingTime >= 0)
                draftData.remainingTime = draftData.remainingTime - 1000;
        }, 1000);
    }

    onMount(() => {
        // draftData = padDraftData(exampleDraft);
        startTimerSeconds();
        const client = new Client({
            brokerURL: "ws://localhost:8080/spectate",
        });

        client.onConnect = (frame) => {
            console.log("connected");
            client.subscribe("/topic/draft-events", handleChampSelectEvent);
        };
        client.activate();
    });
</script>

{#snippet renderTeam(bans: ActionData[], players: DraftPlayer[])}
    <div class="bans">
        {#each bans as ban}
            <div class="ban {ban.isInProgress ? 'active' : ''}">
                <!-- <div>{ban.targetChampion?.name}</div> -->
                <img
                    src={ban.targetChampion?.htmlImageSrc}
                    alt={ban.targetChampion?.name}
                />
            </div>
        {/each}
    </div>
    <div class="players">
        {#each players as player}
            {@const active =
                !player.playerInfo.champion &&
                !!player.playerActions.find(
                    (action) =>
                        action.actionType === "PICK" && action.isInProgress,
                )}
            {@const hover =
                !!!player.playerInfo.champion &&
                !!!player.playerActions.find(
                    (action) =>
                        action.actionType === "PICK" && action.isInProgress,
                ) &&
                !!player.playerActions.find(
                    (action) => action.actionType === "PICK",
                )?.targetChampion}
            <div class="player">
                <div
                    class={{
                        container: true,
                        active: active,
                        hover: hover,
                    }}
                >
                    <img
                        src={player.playerInfo.champion?.htmlImageSrc ??
                            player.playerInfo.championPickIntent
                                ?.htmlImageSrc ??
                            player.playerActions.find(
                                (playeraction) =>
                                    playeraction.actionType === "PICK",
                            )?.targetChampion?.htmlImageSrc ??
                            pickPlaceholder}
                        alt=""
                    />
                    <div class="champion-name">
                        {player.playerInfo.champion?.name ??
                            player.playerInfo.championPickIntent?.name ??
                            player.playerActions.find(
                                (playeraction) =>
                                    playeraction.actionType === "PICK",
                            )?.targetChampion?.name ??
                            ""}
                        {#if hover}
                            <br />(Hover)
                        {/if}
                    </div>
                    <div class="summoners">
                        <div class="summoner-inner">
                            <img
                                src={player.playerInfo.spell1Id?.htmlImageSrc}
                                alt=""
                            />
                            <img
                                src={player.playerInfo.spell2Id?.htmlImageSrc}
                                alt=""
                            />
                        </div>
                    </div>
                </div>
                <div>{player.playerInfo.gameName}</div>
            </div>
        {/each}
    </div>
{/snippet}

<div>
    <div class="draftbox">
        <div class="blue-team team">
            {@render renderTeam(draftData.blueTeamBans, draftData.blueTeam)}
        </div>
        <div class="counter">
            <div class="logo">
                <img src={asset("/images/bootz_logo.png")} alt="" srcset="" />
            </div>
            <div>Timer</div>
            {#if draftData.remainingTime > 0}
                <div>{Math.floor(draftData.remainingTime / 1000)}</div>
            {:else}
                <div>0</div>
            {/if}
        </div>
        <div class="red-team team">
            {@render renderTeam(draftData.redTeamBans, draftData.redTeam)}
        </div>
    </div>
    <div class="teaminfo-container">
        <div class="teaminfo teaminfo-blue" contenteditable="true">Team 1</div>
        <div class="versus">VS</div>
        <div class="teaminfo teaminfo-red" contenteditable="true">Team 2</div>
    </div>
</div>

<style>
    img {
        max-width: 100%;
        height: auto;
    }

    .draftbox {
        width: 100%;
        display: flex;
        flex-direction: row;
        justify-content: center;
    }
    .teaminfo-container {
        display: grid;
        grid-template-columns: 47.8% auto 47.8%;
        align-items: center;
        width: 100%;
    }

    .teaminfo {
        font-size: 2rem;
    }

    .teaminfo-blue {
        text-align: right;
        background: #00e5ff;
        background: linear-gradient(
            270deg,
            rgba(0, 229, 255, 1) 0%,
            rgba(255, 255, 255, 0) 100%
        );
        padding-right: 10px;
    }
    .versus {
        text-align: center;
        white-space: nowrap;
        /* margin-left: 5px; */
        /* margin-right: 5px; */
        font-size: 2rem;
    }
    .teaminfo-red {
        background: #ff1a00;
        background: linear-gradient(
            90deg,
            rgba(255, 26, 0, 1) 0%,
            rgba(255, 255, 255, 0) 100%
        );
        text-align: left;
        padding-left: 10px;
    }

    .bans {
        display: flex;
        max-width: 50%;
    }
    .blue-team > .bans {
        margin-left: auto;
    }
    .blue-team .ban {
        margin-left: 5px;
    }

    .red-team > .bans {
        flex-direction: row-reverse;
    }
    .red-team .ban {
        margin-right: 5px;
    }

    .ban {
        text-align: center;
        flex: 1 1 0;
        min-width: 0;
    }
    .players {
        display: flex;
    }
    .blue-team .player {
        margin-left: 5px;
    }

    .red-team .players {
        flex-direction: row-reverse;
    }
    .red-team .player {
        margin-right: 5px;
    }

    .player {
        flex: 1 1 0;
        text-align: center;
        position: relative;
    }

    .container > .champion-name {
        position: absolute;
        top: 3%;
        text-align: center;
        width: 100%;
        text-shadow:
            -1px 0 black,
            0 1px black,
            1px 0 black,
            0 -1px black;
        color: white;
        font-size: 1.5em;
    }

    .summoners {
        position: absolute;
        bottom: 10%;
        left: 0;
        height: 10%;
        width: 100%;
    }

    .summoner-inner {
        display: flex;
        padding-right: 2%;
        justify-content: flex-end;
        gap: 5px;
        height: 100%;
    }
    .summoner-inner > img {
        height: 100%;
        width: auto;
        object-fit: contain;
    }

    .hover {
        opacity: 75%;
    }

    .counter {
        margin-top: auto;
        text-align: center;
        margin-bottom: 1rem;
        margin-left: 5px;
        margin-right: 5px;
        max-width: 4%;
        font-size: 1.5rem;
    }

    .active {
        animation-name: active;
        animation-duration: 3s;
        animation-iteration-count: infinite;
    }

    @keyframes active {
        0% {
            opacity: 100%;
        }
        50% {
            opacity: 15%;
        }
        100% {
            opacity: 100%;
        }
    }
</style>
