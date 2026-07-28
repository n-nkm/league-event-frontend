<script lang="ts">
    import {
        resetDraft,
        shortenDraft,
        startDraft,
        stopDraft,
    } from "$lib/draft/draftManager";
    import { onMount } from "svelte";
    import { getPreviousDrafts, type FinishedDraft } from "./previousDrafts";

    let draftStatus = $state("Draft nicht gestartet");
    let drafts: FinishedDraft[] = $state([]);

    function startDraftClick() {
        try {
            startDraft(fetch).then(
                () => {
                    draftStatus = "Draft gestartet";
                },
                (rejected) => {
                    draftStatus = "Fehler beim Draft-Start";
                },
            );
        } catch (err) {
            draftStatus = "Fehler beim Draft-Start";
        }
    }

    function stopDraftClick() {
        try {
            stopDraft(fetch).then(
                () => {
                    draftStatus = "Draft gestoppt";
                },
                (rejected) => {
                    draftStatus = "Fehler beim Draft-Stop";
                },
            );
        } catch (err) {
            draftStatus = "Fehler beim Draft-Stop";
        }
    }

    function resetDraftClick() {
        try {
            resetDraft(fetch).then(
                () => {
                    draftStatus = "Fearless genullt";
                },
                (rejected) => {
                    draftStatus = "Fehler beim Fearless-reset";
                },
            );
        } catch (err) {
            draftStatus = "Fehler beim Fearless-reset";
        }
    }

    onMount(() => {
        getPreviousDrafts(fetch).then((incoming) => {
            drafts.push(...incoming);
        });
    });

    function shortenDraftClick(gameId: string) {
        shortenDraft(fetch, gameId).then(
            () => {
                getPreviousDrafts(fetch).then((incoming) => {
                    drafts = incoming;
                });
            },
            (_) => {},
        );
    }
</script>

<div class="draft">
    <div class="draft-status">{draftStatus}</div>
    <button onclick={startDraftClick}>Start</button>
    <button onclick={stopDraftClick}>Stop</button>
    <button onclick={resetDraftClick}>Fearless zurücksetzen</button>
    <div class="prev-drafts">
        {#each drafts as draft}
            <div class="draft">
                gameId: {draft.gameId}, {#each draft.picks as pick}
                    {pick.champion?.name},
                {/each}
                <button
                    onclick={() => {
                        shortenDraftClick(draft.gameId);
                    }}>Weg damit</button
                >
            </div>
        {/each}
    </div>
</div>
