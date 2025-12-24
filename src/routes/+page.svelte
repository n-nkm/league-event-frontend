<script lang="ts">
    import { onMount } from "svelte";
    import { Client, type messageCallbackType } from "@stomp/stompjs";
    import {
        ANIMATION_KEYFRAMES,
        ANIMATION_OPTIONS,
        ANIMATION_OPTIONS_TEXT,
        overWriteOptions,
    } from "$lib/constants";
    import { encodeToUrlParam } from "$lib/urls";

    let playerList: string[] = [];
    let positionOverwrites: { riotId: string; overwrite: string }[] = [];
    let panelContent: HTMLElement;
    let urlButton: HTMLElement;

    const readEvent: messageCallbackType = (msg) => {
        var body = JSON.parse(msg.body);
        updatePlayerList(body.riotId);
        var ref =
            body.team + "." + overrideIfNeeded(body.riotId, body.position);
        switch (body.type) {
            case "LeveledUpV1":
                reactToTextEvent(`Level<br/> ${body.level}`, ref);
                break;
            case "ItemEventV1":
                reactToItemEvent(
                    body.item.displayName,
                    body.item.itemImage,
                    ref,
                );
                break;
            default:
                break;
        }
    };

    const reactToItemEvent = (
        itemName: string,
        image: string,
        elementRef: string,
    ) => {
        const field = document.getElementById(elementRef)!;
        field.innerHTML = "";
        const img = document.createElement("img");
        const p = document.createElement("p");
        // p.innerText = itemName;
        img.src = image;
        field.appendChild(img);
        field.appendChild(p);
        img.classList.add("image-round");
        field.animate(ANIMATION_KEYFRAMES, ANIMATION_OPTIONS);
    };

    const reactToTextEvent = (msg: string, elementRef: string) => {
        const textField = document.getElementById(elementRef)!;
        textField.innerHTML = "";
        const textContent = document.createElement("div");
        textContent.innerHTML = msg;
        textField.appendChild(textContent);
        textContent.classList.add("level-text");
        textField.animate(ANIMATION_KEYFRAMES, ANIMATION_OPTIONS_TEXT);
    };

    onMount(() => {
        // This runs only in the browser after the component mounts

        const client = new Client({
            brokerURL: "ws://localhost:8080/spectate",
        });

        client.onConnect = (frame) => {
            console.log("connected");
            client.subscribe("/topic/spectate-events", readEvent);
        };
        client.activate();

        urlButton.addEventListener("click", navigateToState);

        document.addEventListener("keydown", (event) => {
            if (event.key === "c" && !event.repeat) {
                toggleClass(
                    document.getElementById("panel"),
                    "panel-hidden",
                    "panel-shown",
                );
            }
        });
        loadPlayersFromParam();
        loadSizeSpecFromParams();
    });

    function updatePlayerList(riotId: any) {
        if (!playerList.includes(riotId)) {
            playerList.push(riotId);
            redrawPanel();
        }
    }

    function toggleClass(
        el: HTMLElement | null,
        classA: string,
        classB: string,
    ) {
        if (el === null) {
            return;
        }
        if (el.classList.contains(classA)) {
            el.classList.remove(classA);
            el.classList.add(classB);
        } else {
            el.classList.remove(classB);
            el.classList.add(classA);
        }
    }

    function redrawPanel() {
        const container = panelContent;
        container.innerHTML = "";
        playerList.forEach((player, index) => {
            const row = document.createElement("div");
            row.style.display = "flex";
            row.style.alignItems = "center";
            row.style.gap = "8px";

            const label = document.createElement("span");
            label.textContent = player;
            row.appendChild(label);

            for (let pos = 0; pos < 7; pos++) {
                const id = `player-${index}-pos-${pos}`;
                const radio = document.createElement("input");
                radio.type = "radio";
                radio.id = id;
                const desc = document.createElement("label");
                desc.htmlFor = id;
                desc.textContent = overWriteOptions[pos];

                radio.name = player;
                radio.value = overWriteOptions[pos];
                radio.checked = positionOverwrites.some(
                    (elem) =>
                        elem.riotId === player &&
                        elem.overwrite === overWriteOptions[pos],
                );

                radio.addEventListener("change", () => {
                    const otherWrites = positionOverwrites.filter(
                        (val) => val.riotId !== player,
                    );
                    positionOverwrites = [
                        ...otherWrites,
                        { riotId: player, overwrite: overWriteOptions[pos] },
                    ];
                    console.log(
                        player,
                        "set to position",
                        overWriteOptions[pos],
                    );
                });

                row.appendChild(radio);
                row.appendChild(desc);
            }

            container.appendChild(row);
        });
    }

    function navigateToState() {
        const url = encodeToUrlParam(positionOverwrites);
        history.replaceState(null, "", url);
    }

    function loadPlayersFromParam() {
        const params = new URLSearchParams(window.location.search);
        const encoded = params.get("state");
        if (!encoded) return;

        try {
            const json = decodeURIComponent(atob(encoded));
            const overwrites = JSON.parse(json);
            positionOverwrites = overwrites;
            playerList = positionOverwrites.map((val) => val.riotId);
            console.dir(playerList);
            redrawPanel();
        } catch (e) {
            console.error("Invalid URL state", e);
        }
    }

    function loadSizeSpecFromParams() {
        const params = new URLSearchParams(window.location.search);

        const size = params.get("size");
        const margin = params.get("margin");
        const root = document.documentElement;

        if (size) root.style.setProperty("--item-size", `${size}px`);
        if (margin) root.style.setProperty("--item-margin", `${margin}px`);
    }

    function overrideIfNeeded(riotId: any, position: any): string {
        const overwrite = positionOverwrites.find(
            (ow) => ow.riotId === riotId,
        )?.overwrite;
        return !!overwrite ? overwrite : position;
    }
</script>

<div class="column left">
    <div id="BLUE_SIDE.TOP" class="item item-left">L1</div>
    <div id="BLUE_SIDE.JUNGLE" class="item item-left">L2</div>
    <div id="BLUE_SIDE.MIDDLE" class="item item-left">L3</div>
    <div id="BLUE_SIDE.ADC" class="item item-left">L4</div>
    <div id="BLUE_SIDE.SUPPORT" class="item item-left">L5</div>
    <div id="BLUE_SIDE.NONE" class="item item-left">L6</div>
</div>

<div class="column right">
    <div id="RED_SIDE.TOP" class="item item-right">R1</div>
    <div id="RED_SIDE.JUNGLE" class="item item-right">R2</div>
    <div id="RED_SIDE.MIDDLE" class="item item-right">R3</div>
    <div id="RED_SIDE.ADC" class="item item-right">R4</div>
    <div id="RED_SIDE.SUPPORT" class="item item-right">R5</div>
    <div id="RED_SIDE.NONE" class="item item-right">R6</div>
</div>
<div id="panel" class="panel-hidden middle">
    <div id="panel-content" bind:this={panelContent}></div>
    <div class="to-url-container">
        <input type="button" id="to-url" bind:this={urlButton} value="to-url" />
    </div>
</div>

<style>
    .panel-hidden {
        opacity: 0;
        display: none;
    }
    .panel-shown {
        opacity: 1;
        background-color: white;
    }

    .middle {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: white;
    }

    .column {
        position: absolute;
        top: 0;
        width: 20%;
    }

    .left {
        left: 0;
    }

    .right {
        right: 0;
    }

    .item {
        height: var(--item-size, 70px);
        margin-bottom: var(--item-margin, 32px);
        opacity: 0;
        display: flex;
        /* align-items: ; */

        font-family: sans-serif;
    }

    .item-left {
        justify-content: left;
    }
    .item-right {
        justify-content: right;
    }

    :global(.level-text) {
        height: 70%;
        align-self: flex-start;
        align-content: center;
        margin-right: 30px;
        margin-left: 30px;
        text-align: center;
        font-family: "Georgia Bold", "Georgia", "Times New Roman", Times, serif;
        font-weight: bold;
        background-color: #181d29;
        color: #eeb91a;
        border-radius: 7px;
    }

    :global(.image-round){
        border-radius: 7px;
    }
</style>
