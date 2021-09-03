<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Einstellungen</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-list>
        <ion-list-header>
          Vertretungsplan
        </ion-list-header>
        <ion-item>
          <ion-label>
            <h2>Login Daten</h2>
            <h3 v-if="vplogin == null">Keine Daten angegeben</h3>
            <h3 v-else-if="vplogin == false">Keine Daten angegeben</h3>
            <h3 v-else-if="vplogin == true">{{vplogindata.name}}</h3>
          </ion-label>
          <ion-button size="small" slot="end" color="medium" @click="vplist">Bearbeiten</ion-button>
        </ion-item>
        <ion-list-header>
          Mensasystem
        </ion-list-header>
        <ion-item>
          <ion-label>
            <h2>Login Daten</h2>
            <h3 v-if="mensalogin == null">Keine Daten angegeben</h3>
            <h3 v-else-if="mensalogin == false">Keine Daten angegeben</h3>
            <h3 v-else-if="mensalogin == true">{{mensalogindata.name}}</h3>
          </ion-label>
          <ion-button size="small" slot="end" color="medium" @click="mensalist">Bearbeiten</ion-button>
        </ion-item>
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonListHeader, IonItem, actionSheetController, modalController, IonButton} from '@ionic/vue';
import { Storage } from '@ionic/storage';
const store = new Storage();
import Modal from "./Modal.vue"
import ModalMensa from "./ModalMensa.vue"

export default  {
  name: 'Tab5',
  components: { IonHeader, IonToolbar, IonTitle, IonContent, IonPage, IonList, IonItem, IonListHeader, IonButton},
  async ionViewWillEnter() {
    await store.create()
    this.vplogin = await store.get("vplogin")
    this.vplogindata.name = await store.get("vpusername")
    this.vplogindata.pw = await store.get("vppw")
    this.mensalogin = await store.get("mensalogin")
    this.mensalogindata.name = await store.get("mensausername")
    this.mensalogindata.pw = await store.get("mensapw")
  },
  data() {
    return {
      vplogin: null,
      vplogindata: {
        name: String,
        pw: String
      },
      mensalogin: null,
      mensalogindata: {
        name: String,
        pw: String
      }
    }
  },
  methods: {
    async update() {
      await store.create()
      this.vplogin = await store.get("vplogin")
      this.vplogindata.name = await store.get("vpusername")
      this.vplogindata.pw = await store.get("vppw")
      this.mensalogin = await store.get("mensalogin")
      this.mensalogindata.name = await store.get("mensausername")
      this.mensalogindata.pw = await store.get("mensapw")
    },
    async vplist() {
      const actionSheet = await actionSheetController.create({
        buttons: [
          {
            text: "Entfernen",
            role: "destructive"
          },
          {
            text: "Ändern",
            role: "change"
          },
          {
            text: "Abbrechen",
            role: "cancel"
          }
        ]
      })
      actionSheet.present()
      const dismissevent = await actionSheet.onDidDismiss()
      if(dismissevent.role == "destructive") this.delete("vp")
      if(dismissevent.role == "change") this.edit("vp")
    },
    async mensalist() {
      const actionSheet = await actionSheetController.create({
        buttons: [
          {
            text: "Entfernen",
            role: "destructive"
          },
          {
            text: "Ändern",
            role: "change"
          },
          {
            text: "Abbrechen",
            role: "cancel"
          }
        ]
      })
      actionSheet.present()
      const dismissevent = await actionSheet.onDidDismiss()
      if(dismissevent.role == "destructive") this.delete("mensa")
      if(dismissevent.role == "change") this.edit("mensa")
    },
    async edit(type) {
      const modal = await modalController.create({
        component: type == "vp" ? Modal : ModalMensa
      })
      await modal.present()
      await modal.onDidDismiss()
      this.update()
    },
    async delete(type) {
      await store.create()
      type == "vp" ? await store.remove("vpusername") : await store.remove("mensausername")
      type == "vp" ? await store.remove("vppw") : await store.remove("mensapw")
      type == "vp" ? await store.set("vplogin", false) : store.set("mensalogin", false)
      this.update()
    }
  }
}
</script>