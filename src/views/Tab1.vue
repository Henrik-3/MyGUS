<template>
  <ion-page v-if="loggedin == true">
    <ion-header>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css" />
      <ion-toolbar>
        <ion-title style="margin-left:auto;margin-right:auto">Vertretungsplan</ion-title>
        <i slot="end" class="fas fa-external-link-alt fa-2x" onclick="window.open('https://vp.gymnasium-unterrieden.de/', '_system', 'location=yes'); return false;" style="margin-right:25px"></i>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-refresher slot="fixed" @ionRefresh="loadDataRefresher($event)">
        <ion-refresher-content></ion-refresher-content>
      </ion-refresher>
      <ion-fab vertical="bottom" horizontal="end" slot="fixed">
        <ion-fab-button @click="filterData" color="danger">
         <ion-icon :icon="filterOutline"></ion-icon>
        </ion-fab-button>
      </ion-fab>
      <ion-grid style="margin-top: 30px;display: flex;align-items: left;justify-content: left;">
        <ion-row class="ion-align-items-center" style="margin-left: auto;margin-right: auto">
          <ion-col class="ion-align-self-center">
            <ion-datetime class="btn bg-gradient-dark" style="--placeholder-opacity:1;display:inline-flex;margin-bottom:auto" display-format="MMM DD, YYYY" :value="current" :min="min" :max="max" @ionChange="updateData" v-model="placeholder2"></ion-datetime>
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
                  <th class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Klasse</th>
                  <th class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">Stunde</th>
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
                      <div class="d-flex flex-column" style="margin-left: auto;margin-right: auto;">
                        <h4 class="mb-0 text-sm">{{entry.form}}</h4>
                      </div>
                    </div>
                  </td>
                  <td class="align-middle text-center text-sm">
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
                    <span v-if="entry.note.toLowerCase().includes('findet statt')" class="badge bg-gradient-success" style="margin-left:5px">{{entry.note}}</span>
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
  <ion-page v-else-if="loggedin == false">
    <ion-header>
      <ion-toolbar>
        <ion-title style="margin-left:auto;margin-right:auto">Login</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <div style="display: flex;align-items: center;min-height: 100%;">
        <div class="container" style="padding-top:auto;padding-bottom:auto;">
          <div class="col-xl-4 col-lg-5 col-md-7 mx-auto">
            <div class="card mb-4">
              <div class="card-header text-center"> 
                <h4>Vertretungsplan Login</h4>
              </div>
              <div class="card-body" style="padding-top:unset;">
                <form role="form text-left">
                  <div class="mb-3">
                    <input type="text" class="form-control" placeholder="Klasse" ref="loginusername" aria-label="Klasse">
                  </div>
                  <div class="mb-3">
                    <input class="form-control" placeholder="Passwort" aria-label="Passwort" ref="loginpw" type="password">
                  </div>
                  <div class="form-check form-switch">
                    <input class="form-check-input" type="checkbox" checked="" ref="loginsave">
                    <label class="form-check-label" for="flexSwitchCheckDefault">Eingeloggt bleiben</label>
                  </div>
                  <div class="text-center">
                    <button type="button" class="btn bg-gradient-dark w-100 my-4 mb-2" ref="buttonlogin" @click="login">Einloggen</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script async lang="ts">
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, loadingController, toastController, IonRow, IonCol, IonGrid, IonIcon, IonFab, IonFabButton, IonDatetime} from '@ionic/vue';
import axios from "axios";
import { filterOutline } from 'ionicons/icons';
import "../theme/soft-ui-dashboard.css"
import "../theme/variables.css"
import moment from "moment";
import { Storage } from '@ionic/storage';
const store = new Storage();
moment.locale("de")

export default {
  name: 'Tab1',
  components: { IonHeader, IonToolbar, IonTitle, IonContent, IonPage, IonRow, IonCol, IonGrid, IonIcon, IonFab, IonFabButton, IonDatetime},
  data() {
    return {
      vdata: [],
      placeholder: null,
      vmdata: [],
      version: null,
      notes: null,
      filtered: null,
      raw: [],
      loggedin: null,
      min: null,
      max: null,
      current: null,
      uname: null
    }
  },
  async ionViewWillEnter() {
    await store.create();
    const loggedin = await store.get('vplogin');
    if(loggedin == null) {
      await store.set("vplogin", false)
      this.loggedin = false
      this.$refs.loadingcycle.showing = false
    }
    if(loggedin == false) {
      this.loggedin = false
    }
    if(loggedin == true) {
      this.loggedin = true
    }
  },
  async created() {
    await store.create();
    const loggedin = await store.get('vplogin');
    if(loggedin == null) {
      await store.set("vplogin", false)
      this.loggedin = false
      this.$refs.loadingcycle.showing = false
    }
    if(loggedin == false) {
      this.loggedin = false
    }
    if(loggedin == true) {
      this.loggedin = true
      this.loadData()
    }
  },
  setup() {
    return {
      filterOutline
    }
  },
  methods: {
    formatMoment (date) {
      return moment(date).format("MMM DD, YYYY");
    },
    async updateData() {
      console.log(this)
      this.placeholder = this.placeholder2
      const filter = this.vdata.find(item => moment(item.date).format("DD") == moment(this.placeholder).format("DD"))
      const filter2 = filter.entries
      this.vmdata = filter2
      this.version = filter.version
      const split = filter.studentNotes.split("\n")
      this.notes = `Aktualisiert: ${moment(filter.lastUpdated).format("DD.MM.YY HH:mm")}\n${split[1]}\nMaskenpflicht:${split[2].substr(28)}`
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
      this.vdata = data.data
      this.current = moment(data.data[0].date).format("MMM DD, YYYY")
      this.placeholder = data.data[0].date
      this.placeholder2 = data.data[0].date
      let filter = data.data.find(item => item.date == data.data[0].date)
      filter = filter.entries
      this.vmdata = filter
      this.version = data.data[0].version
      const split = data.data[0].studentNotes.split("\n")
      this.notes = `Aktualisiert: ${moment(data.data[0].lastUpdated).format("DD.MM.YY HH:mm")}\n${split[1]}\nMaskenpflicht:${split[2].substr(28)}`
      this.min = moment(data.data[0].date).format("YYYY-MM-DD");
      this.max = moment(data.data[data.data.length - 1].date).format("YYYY-MM-DD");
    },
    async loadDataRefresher(event) {
      const data = await axios.get("https://api.henrikdev.xyz/gus/v1/vertretungsplan").catch(error => {return error})
      if(data.response) {
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
      this.vdata = data.data
      this.current = moment(data.data[0].date).format("MMM DD, YYYY")
      this.placeholder = data.data[0].date
      let filter = data.data.find(item => item.date == data.data[0].date)
      filter = filter.entries
      this.vmdata = filter
      this.version = data.data[0].version
      const split = data.data[0].studentNotes.split("\n")
      this.notes = `Aktualisiert: ${moment(data.data[0].lastUpdated).format("DD.MM.YY HH:mm")}\n${split[1]}\nMaskenpflicht:${split[2].substr(28)}`
      this.min = moment(data.data[0].date).format("YYYY-MM-DD");
      this.max = moment(data.data[data.data.length - 1].date).format("YYYY-MM-DD");
      event.target.complete()
    },
    async filterData() {
      if(this.filtered == false || this.filtered == null) {
        await store.create()
        this.raw = Array.from([...this.vmdata])
        this.vmdata = [];
        let uname = await store.get("vpusername")
        let f;
        if(uname != null) return f = uname.length == 2 ? this.raw.filter(item => item.form.includes(uname.split("")[0]) && item.form.includes(uname.split("")[1])) : this.raw.filter(item => item.form.includes(uname.split("")[0]) && item.form.includes(uname.split("")[1]) && item.form.includes(uname.split("")[2]))
        uname = this.uname
        if(uname != null) f = uname.length == 2 ? this.raw.filter(item => item.form.includes(uname.split("")[0]) && item.form.includes(uname.split("")[1])) : this.raw.filter(item => item.form.includes(uname.split("")[0]) && item.form.includes(uname.split("")[1]) && item.form.includes(uname.split("")[2]))
        this.vmdata = f
        this.filtered = true
        return
      }
      if(this.filtered == true) {
        this.vmdata = []
        this.vmdata = this.raw
        this.raw = []
        this.filtered = false
        return
      }
    },
    async login() {
      const name = this.$refs.loginusername.value
      const pw = this.$refs.loginpw.value
      const save = this.$refs.loginsave.checked
      await store.create();
      const check = await axios.post("https://api.henrikdev.xyz/gus/v1/vertretungsplan/login", {username: name, pw: pw}).catch(error => {return error})
      if(check.response && check.response.status == 404) {
        this.$refs.buttonlogin.classList = "btn bg-gradient-danger w-100 my-4 mb-2"
        this.$refs.buttonlogin.innerHTML = "Ungültige Anmeldedaten"
        this.$refs.buttonlogin.disabled = true
        setTimeout(() => {
          this.$refs.buttonlogin.classList = "btn bg-gradient-dark w-100 my-4 mb-2"
          this.$refs.buttonlogin.innerHTML = "Einloggen"
          this.$refs.buttonlogin.disabled = false
        }, 5000)
        return
      }
      if(check.response && check.response.status == 500) {
        this.$refs.buttonlogin.classList = "btn bg-gradient-secondary w-100 my-4 mb-2"
        this.$refs.buttonlogin.innerHTML = "Unbekannter Fehler beim Einloggen"
        setTimeout(() => {
          this.$refs.buttonlogin.classList = "btn bg-gradient-dark w-100 my-4 mb-2"
          this.$refs.buttonlogin.innerHTML = "Einloggen"
        }, 5000)
      }
      console.log(check)
      if(check.status == 200) {
        if(save) {
          await store.set("vplogin", true)
          await store.set("vpusername", name)
          await store.set("vppw", pw)
          this.$refs.buttonlogin.classList = "btn bg-gradient-success w-100 my-4 mb-2"
          this.$refs.buttonlogin.innerHTML = '<i class="fas fa-check" style="margin-right:10px"></i>Erfolgreich eingeloggt'
          const delay = ms => new Promise(res => setTimeout(res, ms));
          await delay(2500)
          this.loggedin = true
          this.loadData()
        }
        this.$refs.buttonlogin.classList = "btn bg-gradient-success w-100 my-4 mb-2"
        this.$refs.buttonlogin.innerHTML = '<i class="fas fa-check" style="margin-right:10px"></i>Erfolgreich eingeloggt'
        const delay = ms => new Promise(res => setTimeout(res, ms));
        await delay(2500)
        this.loggedin = true
        this.uname = name
        this.loadData()
      }
    }
  }
}
</script>