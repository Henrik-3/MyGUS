<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title style="margin-left:auto;margin-right:auto">Vertretungsplan</ion-title>
        <ion-button @click="loadData" color="dark" slot="end" style="margin-right: 1em">Update</ion-button>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-grid style="margin-top: 30px;display: flex;align-items: left;justify-content: left;">
        <ion-row class="ion-align-items-center" style="margin-left: auto;margin-right: auto">
          <ion-col class="ion-align-self-center">
            <ion-select class="btn bg-gradient-dark" style="--placeholder-opacity:1;display:inline-flex;margin-bottom:auto" :placeholder="patchMoment(placeholder)" @ionChange="updateData" v-model="placeholder2" ok-text="Auswählen" cancel-text="Abbrechen">
              <ion-select-option v-for="day of vdata" :key="day" :value="day">
                {{patchMoment(day.date)}}
              </ion-select-option>
            </ion-select>
          </ion-col>
          <ion-col>
            <h4 class="mb-0 text-sm" style="white-space: pre-wrap;width: 175px">
              {{notes}}
            </h4>
          </ion-col>
        </ion-row>
      </ion-grid>
      <div class="card mb-4">
        <div class="card-body">
          <div class="table-responsive p-0">
            <table class="table align-items-center mb-0">
              <thead>
                <tr>
                  <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Klasse</th>
                  <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">Stunde</th>
                  <th class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Lehrer/Fach</th>
                  <th class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Änderung</th>
                  <th class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Raum</th>
                  <th class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Notiz</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="entry of vmdata" :key="entry" :value="entry">
                  <td>
                    <div class="d-flex px-2 py-1">
                      <div class="d-flex flex-column justify-content-center">
                        <h4 class="mb-0 text-sm">{{entry.form}}</h4>
                      </div>
                    </div>
                  </td>
                  <td>
                    <h4 class="mb-0 text-sm">{{entry.lesson}}</h4>
                  </td>
                  <td class="align-middle text-center text-sm">
                    <h4 class="mb-0 text-sm">{{entry.originalTeacher}} / {{entry.originalSubject}}</h4>
                  </td>
                  <td class="align-middle text-center">
                    <span v-if="entry.note.toLowerCase().includes('verlegt') && entry.substitutionTeacher === 'entfällt'" class="badge bg-gradient-light" style="color: #000;margin-left:5px">Verlegung auf {{entry.note.substr(12)}}</span>
                    <span v-if="entry.substitutionTeacher === 'entfällt'" class="badge bg-gradient-danger" style="margin-left:5px">Entfällt</span>
                    <span v-if="entry.substitutionSubject === 'Aufs.'" class="badge bg-gradient-warning" style="margin-left:5px">Aufsicht bei {{entry.substitutionTeacher}}</span>
                    <span v-if="entry.note.toLowerCase().includes('verlegt') && entry.substitutionTeacher !== 'entfällt'" class="badge bg-gradient-light" style="margin-left:5px">Verlegung auf {{entry.note.substr(12)}}</span>
                    <span v-if="entry.note.toLowerCase().includes('raumänderung')" class="badge bg-gradient-dark" style="margin-left:5px">Raumänderung</span>
                    <span v-if="entry.note.toLowerCase().includes('extrastunde') || entry.note.toLowerCase().includes('zusatzstunde')" class="badge bg-gradient-primary" style="margin-left:5px">Extrastunde</span>
                    <span v-if="entry.note.toLowerCase().includes('statt') && entry.substitutionTeacher !== '—'" class="badge bg-gradient-success" style="margin-left:5px">{{entry.substitutionTeacher}} / {{entry.substitutionSubject}} / STATT {{entry.note.substr(6)}}</span>
                    <span v-if="entry.note.toLowerCase().includes('statt') && entry.substitutionTeacher === '—'" class="badge bg-gradient-success" style="margin-left:5px">{{entry.note.substr(12)}}</span>
                  </td>
                  <td class="align-middle text-center">
                    <span v-if="entry.substitutionTeacher === 'entfällt'">-</span>
                    <h4 v-else-if="entry.substitutionSubject === 'Aufs.'" class="mb-0 text-sm">{{entry.substitutionRoom}}</h4>
                    <h4 v-else-if="entry.note.includes('Raumänderung')" class="mb-0 text-sm">{{entry.substitutionRoom}}</h4>
                    <h4 v-else class="mb-0 text-sm">{{entry.substitutionRoom}}</h4>
                  </td>
                  <td class="align-middle text-center">
                    <h4 class="mb-0 text-sm">{{entry.note}}</h4>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script async lang="ts">
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, loadingController, toastController, IonButton, IonSelect, IonSelectOption, IonRow, IonCol, IonGrid} from '@ionic/vue';
import axios from "axios";
import "../theme/soft-ui-dashboard.css"
import "../theme/variables.css"
import moment from "moment"

moment.locale("de")

export default {
  name: 'Tab1',
  components: { IonHeader, IonToolbar, IonTitle, IonContent, IonPage, IonButton, IonSelect, IonSelectOption, IonRow, IonCol, IonGrid},
  data() {
    return {
      vdata: [],
      placeholder: null,
      vmdata: [],
      version: null,
      notes: null
    }
  },
  created() {
    this.loadData()
  },
  methods: {
    patchMoment (date) {
      return moment(date).format('LL');
    },
    async updateData() {
      this.placeholder = this.placeholder2.date
      const filter = this.vdata.find(item => item.date == this.placeholder)
      const filter2 = filter.entries
      this.vmdata = filter2
      this.version = filter.version
      const split = filter.studentNotes.split("\n")
      this.notes = `Aktualisiert: ${moment(filter.lastUpdated).format("DD.MM.YY HH:mm")}\n${split[1]}\nMaskenpflicht:${split[2].substr(28)}`
      const toast = await toastController.create({
          header: "Fertig",
          message: "Vertretungsplandaten wurden erfolgreich geladen",
          duration: 5000,
          animated: true,
          position: "top"
        })
      toast.present()
    },
    async loadData() {
      const loading = await loadingController.create({
        message: "Vertretungsplan wird geladen",
        animated: true
      })
      await loading.present()
      const data = await axios.get("https://api.henrikdev.xyz/gus/v1/vertretungsplan").catch(error => {return error})
      if(data.response) {
        await loading.dismiss()
        const toast = await toastController.create({
          header: "Fehler",
          message: "Es gab ein Problem beim Herunterladen der aktuellen Vertretungsplan Daten, bitte versuche es später noch einmal",
          duration: 5000,
          animated: true,
          position: "top"
        })
        toast.present()
        return
      }
      loading.dismiss()
      const toast = await toastController.create({
        header: "Fertig",
        message: "Vertretungsplandaten wurden erfolgreich geladen",
        duration: 3500,
        animated: true,
        position: "top"
      })
      toast.present()
      this.vdata = data.data
      this.placeholder = data.data[0].date
      let filter = data.data.find(item => item.date == data.data[0].date)
      filter = filter.entries
      this.vmdata = filter
      this.version = data.data[0].version
      const split = data.data[0].studentNotes.split("\n")
      this.notes = `Aktualisiert: ${moment(data.data[0].lastUpdated).format("DD.MM.YY HH:mm")}\n${split[1]}\nMaskenpflicht:${split[2].substr(28)}`
    }
  }
}
</script>