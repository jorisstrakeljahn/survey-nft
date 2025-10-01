<script setup lang="ts">
import { ref } from 'vue';
import { ethers } from 'ethers';
// Wir hängen uns später an deinen use-erc721 Store/Composable

const holder = ref('');
const maxCount = ref(50);
const status = ref('');

async function burnAll() {
  try {
    status.value = 'Sende Transaktion...';
    // hier später: erc721.contract.burnAllFor(holder.value, maxCount.value)
    status.value = 'Funktion noch nicht verdrahtet.';
  } catch (e:any) {
    status.value = e?.message ?? String(e);
  }
}
</script>

<template>
  <section class="p-6">
    <h2>Professor:innen – NFTs löschen</h2>
    <p>Gib die Studierenden-Wallet ein und lösche deren NFTs (nur mit DELETER_ROLE).</p>

    <div style="margin-top:1rem;">
      <label>Studierenden-Adresse</label><br />
      <input v-model="holder" placeholder="0x..." style="width:420px;padding:8px;" />
    </div>
    <div style="margin-top:0.5rem;">
      <label>Max Count</label><br />
      <input type="number" v-model.number="maxCount" style="width:120px;padding:8px;" />
    </div>

    <button @click="burnAll" style="margin-top:1rem;padding:8px 16px;">Alle NFTs löschen</button>

    <p style="margin-top:1rem;white-space:pre-wrap">{{ status }}</p>
  </section>
</template>
