<template>
  <ion-page>
    <ion-header>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css" />
      <ion-toolbar>
        <ion-title>SMV</ion-title>
        <i slot="end" class="fab fa-instagram fa-2x" onclick="window.open('https://www.instagram.com/smv.unterrieden/', '_system', 'location=yes'); return false;" style="margin-right:25px"></i>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-grid style="margin-top:auto;margin-bottom:auto;display: flex;align-items: left;justify-content: left;height:100%">
        <ion-row class="ion-align-items-center" style="margin: auto">
          <ion-col class="ion-align-self-center" style="text-align:center">
            <h4>Warten auf Anweisungen und Wünsche der SMV :O</h4>
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/vue';
import "../theme/soft-ui-dashboard.css"

export default  {
  name: 'Tab4',
  components: { IonHeader, IonToolbar, IonTitle, IonContent, IonPage }
}
</script>