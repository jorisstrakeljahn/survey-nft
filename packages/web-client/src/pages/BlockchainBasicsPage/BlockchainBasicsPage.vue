<template>
  <div class="vpp-page" lang="de">
    <section class="header-section">
      <img
        :src="HeaderImage"
        alt="Header Image"
        class="header-section__image"
      />
      <h1 class="header-section__title">
        {{ t('blockchain-basics-page.title') }}
      </h1>
      <p class="header-section__subtitle">
        {{ t('blockchain-basics-page.subtitle') }}
      </p>
    </section>

    <!-- Dokumentation Section -->
    <section class="documentation-section">
      <h2 class="documentation-section__title">
        {{ t('blockchain-basics-page.guide-title') }}
      </h2>

      <div class="documentation-section__group">
        <accordion-item
          v-for="(item, index) in participantItems"
          :key="index"
          :title="item.title"
        >
          <!-- eslint-disable-next-line vue/no-v-html -->
          <div v-html="item.content"></div>
        </accordion-item>
      </div>
    </section>
  </div>
  <app-footer />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import AppFooter from '@/common/AppFooter.vue'
import AccordionItem from '@/common/AccordionItem.vue'
import HeaderImage from '@/assets/blockchain-basisc-start-image.jpg'
import { ROUTE_NAMES } from '@/enums'

export default defineComponent({
  name: 'vpp-doc-page',
  components: {
    AppFooter,
    AccordionItem,
  },
  setup() {
    const { t } = useI18n()
    return {
      t,
      ROUTE_NAMES,
    }
  },
  data() {
    return {
      HeaderImage,
      participantItems: [
        {
          title: 'Block',
          content:
            ' Ein Block ist eine Sammlung von Transaktionsdaten, die in der Blockchain gespeichert werden. Jeder Block enthält einen kryptografischen Hash des vorherigen Blocks, wodurch die Integrität der gesamten Kette gesichert wird.',
        },
        {
          title: 'Cryptography (Kryptografie)',
          content:
            'Kryptografie ist die Wissenschaft der Verschlüsselung von Informationen. In der Blockchain wird sie genutzt, um die Sicherheit und Integrität von Transaktionen zu gewährleisten.',
        },
        {
          title: 'Decentralization (Dezentralisierung)',
          content:
            'Dezentralisierung bedeutet, dass keine zentrale Instanz das Netzwerk kontrolliert. Stattdessen wird die Kontrolle auf viele unabhängige Teilnehmer (Nodes) verteilt.',
        },
        {
          title: 'Hash',
          content:
            'Ein Hash ist eine kryptografische Funktion, die eine Eingabe in eine einzigartige Zeichenfolge mit fester Länge umwandelt. Jeder Block enthält den Hash des vorherigen Blocks, was die Sicherheit und Unveränderlichkeit der Blockchain gewährleistet.',
        },
        {
          title: 'Mining',
          content:
            'Mining ist der Prozess der Verifizierung und Validierung von Transaktionen in der Blockchain. Miner konkurrieren darum, komplexe mathematische Probleme zu lösen und neue Blöcke zur Blockchain hinzuzufügen, wofür sie Belohnungen in Form von Kryptowährung erhalten.',
        },
        {
          title: 'Node',
          content:
            'Ein Node ist ein Computer oder Netzwerkknoten, der Teil des Blockchain-Netzwerks ist. Er speichert eine Kopie des gesamten Blockchain-Ledgers und validiert Transaktionen.\n' +
            'Permissioned Blockchain – Eine Permissioned Blockchain erlaubt nur bestimmten Teilnehmern, Transaktionen zu validieren oder neue Blöcke zur Kette hinzuzufügen. Dies unterscheidet sich von öffentlichen Blockchains, die für alle offen sind.',
        },
        {
          title: 'Private Key',
          content:
            'Ein Private Key ist ein geheimer Schlüssel, den nur der Besitzer kennt und verwendet, um auf seine Blockchain-Daten und -Tokens zuzugreifen oder Transaktionen zu signieren.\n' +
            'Proof of Stake (PoS) – Ein Konsensusmechanismus, bei dem Teilnehmer je nach Anzahl ihrer gehaltenen Token das Recht erhalten, Transaktionen zu validieren und neue Blöcke hinzuzufügen. Dies reduziert den Energieverbrauch im Vergleich zu Proof of Work.',
        },
        {
          title: 'Proof of Work (PoW)',
          content:
            'Ein Konsensusmechanismus, bei dem Teilnehmer (Miner) komplexe Rechenaufgaben lösen, um Transaktionen zu validieren und neue Blöcke hinzuzufügen. Es ist energieintensiv, bietet aber ein hohes Maß an Sicherheit.\n' +
            'Public Key – Ein Public Key ist ein öffentlich zugänglicher Schlüssel, der verwendet wird, um Transaktionen zu empfangen oder Nachrichten zu verifizieren. Er steht im Zusammenhang mit einem Private Key.',
        },
        {
          title: 'Smart Contracts',
          content:
            'Smart Contracts sind selbstausführende Verträge, deren Bedingungen und Ausführungen in Code festgelegt sind. Sie werden auf der Blockchain gespeichert und können ohne Zwischenhändler durchgeführt werden.',
        },
        {
          title: 'Token',
          content:
            'Ein Token ist ein digitaler Vermögenswert, der auf der Blockchain existiert und verschiedene Funktionen erfüllen kann, wie etwa als Währung, Eigentumsnachweis oder Stimmrecht.',
        },
        {
          title: 'Blockchain Governance',
          content:
            'Dies bezeichnet die Regelwerke und Mechanismen, die die Verwaltung und den Betrieb einer Blockchain bestimmen. Dazu gehören Entscheidungsprozesse und Protokolländerungen, die von der Community oder spezifischen Autoritäten gesteuert werden.',
        },
        {
          title: 'Consensus Mechanism (Konsensusmechanismus)',
          content:
            'Ein Verfahren, das es den Teilnehmern eines Blockchain-Netzwerks ermöglicht, sich über den aktuellen Zustand der Blockchain zu einigen. Gängige Mechanismen sind Proof of Work (PoW) und Proof of Stake (PoS).',
        },
        {
          title: 'Distributed Ledger',
          content:
            'Ein verteiltes Hauptbuch (Distributed Ledger) ist eine Datenbank, die auf verschiedenen Knotenpunkten (Nodes) gleichzeitig gespeichert und aktualisiert wird, was die Transparenz und Sicherheit erhöht.',
        },
      ],
    }
  },
})
</script>

<style lang="scss" scoped>
/* Header Section Styles */
.header-section {
  text-align: center;
  padding: 2rem 1rem;

  &__image {
    max-width: 700px;
    width: 480px;
    height: 320px;
    border-radius: 8px;
    object-fit: cover;
  }

  &__title {
    font-size: 2rem;
    margin-top: 1.5rem;
  }

  &__subtitle {
    max-width: 1000px;
    font-size: 1.4rem;
    line-height: 1.5;
    text-align: justify;
    hyphens: auto;
    margin: 1rem auto 0;
  }
}

/* Dokumentation Section Styles */
.documentation-section {
  padding: 2rem 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;

  &__title {
    font-size: 2rem;
    margin-bottom: 2rem;
    text-align: center;
  }

  &__group {
    max-width: 1000px;
    width: 100%;
    margin-bottom: 2rem;
  }

  &__subtitle {
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }
}

/* Media Queries für kleinere Bildschirme */
@media (max-width: 768px) {
  .header-section__title {
    font-size: 1.5rem;
  }

  .header-section__image {
    width: 100%;
    height: auto;
  }

  .header-section__subtitle {
    font-size: 1rem;
  }

  .documentation-section__title {
    font-size: 1.5rem;
  }

  .documentation-section__subtitle {
    font-size: 1.2rem;
  }
}
</style>
