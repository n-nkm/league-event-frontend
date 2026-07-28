<script lang="ts">
    import { startSpec, stopSpec } from "$lib/spectate/spectateManager";

    let spectateStatus = $state("Spectate nicht gestartet");

    

    function startSpecClick() {
        try {
            startSpec(fetch).then(() => {
                spectateStatus = "Spectate gestartet";
            }, (rejected) => {
                spectateStatus = "Fehler beim Spectate-Start";
            });
        } catch (err) {
            spectateStatus = "Fehler beim Spectate-Start";
        }
    }

    function stopSpecClick() {
        try {
            stopSpec(fetch).then(() => {
                spectateStatus = "Spectate gestoppt";
            }, (rejected) => {
                spectateStatus = "Fehler beim Spectate-Stop";
            });
        } catch (err) {
            spectateStatus = "Fehler beim Spectate-Stop";
        }
    }
    
</script>

<div class="spectate">
        <div class="spectate-status">{spectateStatus}</div>
    <button onclick={startSpecClick}>Start</button>
    <button onclick={stopSpecClick}>Stop</button>
</div>