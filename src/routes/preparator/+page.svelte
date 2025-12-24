<script lang="ts">
    import { onMount } from "svelte";
    import {overWriteOptions } from '$lib/constants';
    import { encodeToUrlParam } from "$lib/urls";
    let positionOverwrites: { riotId: string; overwrite: string }[] = [];
    let generate: HTMLElement;
    let blueTop: HTMLInputElement;
    let blueJungle: HTMLInputElement;
    let blueMid: HTMLInputElement;
    let blueAdc: HTMLInputElement;
    let blueSupport: HTMLInputElement;
    let redTop: HTMLInputElement;
    let redJungle: HTMLInputElement;
    let redMid: HTMLInputElement;
    let redAdc: HTMLInputElement;
    let redSupport: HTMLInputElement;
    let result: HTMLElement;

    onMount(() => {
        generate.addEventListener("click", () => {
            positionOverwrites = [
                {riotId: blueTop.value, overwrite: overWriteOptions[0]},
                {riotId: blueJungle.value, overwrite: overWriteOptions[1]},
                {riotId: blueMid.value, overwrite: overWriteOptions[2]},
                {riotId: blueAdc.value, overwrite: overWriteOptions[3]},
                {riotId: blueSupport.value, overwrite: overWriteOptions[4]},
                {riotId: redTop.value, overwrite: overWriteOptions[0]},
                {riotId: redJungle.value, overwrite: overWriteOptions[1]},
                {riotId: redMid.value, overwrite: overWriteOptions[2]},
                {riotId: redAdc.value, overwrite: overWriteOptions[3]},
                {riotId: redSupport.value, overwrite: overWriteOptions[4]}
            ].filter((val) => val.riotId !== null && val.riotId !== "" && val.riotId.length > 0);
            result.textContent = encodeToUrlParam(positionOverwrites).toString();
        });
    });
</script>

<div>
    <div class="flex-me">
        <div class="blue-side">
            <h2>Blue Side</h2>
            <label for="BLUE_TOP">TOP:</label><br>
            <input type="text" id="BLUE_TOP" name="BLUE_TOP" bind:this={blueTop} ><br><br>
            <label for="BLUE_JUNGLE">JUNGLE:</label><br>
            <input type="text" id="BLUE_JUNGLE" name="BLUE_JUNGLE" bind:this={blueJungle}><br><br>
            <label for="BLUE_MID">MIDDLE:</label><br>
            <input type="text" id="BLUE_MID" name="BLUE_MID" bind:this={blueMid}><br><br>
            <label for="BLUE_ADC">ADC:</label><br>
            <input type="text" id="BLUE_ADC" name="BLUE_ADC" bind:this={blueAdc}><br><br>
            <label for="BLUE_SUPPORT">SUPPORT:</label><br>
            <input type="text" id="BLUE_SUPPORT" name="BLUE_SUPPORT" bind:this={blueSupport}><br><br>
        </div>
        <div class="red-side">
            <h2>Red Side</h2>
            <label for="RED_TOP">TOP:</label><br>
            <input type="text" id="RED_TOP" name="RED_TOP" bind:this={redTop}><br><br>
            <label for="RED_JUNGLE">JUNGLE:</label><br>
            <input type="text" id="RED_JUNGLE" name="RED_JUNGLE" bind:this={redJungle}><br><br>
            <label for="RED_MID">MIDDLE:</label><br>
            <input type="text" id="RED_MID" name="RED_MID" bind:this={redMid}><br><br>
            <label for="RED_ADC">ADC:</label><br>
            <input type="text" id="RED_ADC" name="RED_ADC" bind:this={redAdc}><br><br>
            <label for="RED_SUPPORT">SUPPORT:</label><br>
            <input type="text" id="RED_SUPPORT" name="RED_SUPPORT" bind:this={redSupport}><br><br>
        </div>
    </div>
    <div class="flex-me">
        <input type="button" id="generate" bind:this={generate} value="Generate">
    </div>
    <div class="flex-me">
        <p id="result" bind:this={result}></p>
    </div>
</div>

<style>
    .flex-me {
        display: flex;
        flex-direction: row;
        justify-content: center;
        gap: 1em;
    }
    #result {
        max-width: 20vw;
        line-break: anywhere;
    }

</style>