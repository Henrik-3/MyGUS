<template>
  <ion-page v-if="loggedin == true">
    <ion-header>
      <ion-toolbar>
        <ion-title>Mensa</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-grid style="margin-top:auto;margin-bottom:auto;display: flex;align-items: left;justify-content: left;height:100%">
        <ion-row class="ion-align-items-center" style="margin: auto">
          <ion-col class="ion-align-self-center" style="text-align:center">
            <h4>Noch in Entwicklung</h4>
            <br>
            <h4>Erwarteter Release: 10.09.2021-19.09.2021</h4>
            <button type="button" class="btn btn-secondary" onclick="window.open('https://gus.sams-on.de', '_system', 'location=yes'); return false;">Im Browser öffnen</button>
          </ion-col>
        </ion-row>
      </ion-grid>
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
          <div class="col-md-7 mx-auto">
            <div class="card mb-4">
              <div class="card-header text-center"> 
                <h4>Mensa Login</h4>
              </div>
              <div class="card-body" style="padding-top:unset;">
                <form role="form text-left">
                  <div class="mb-3">
                    <input type="text" class="form-control" placeholder="Kartennummer" ref="logincardnumber">
                  </div>
                  <div class="mb-3">
                    <input class="form-control" placeholder="PIN" ref="loginpin" type="password">
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

<script lang="ts">
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/vue';
import axios from "axios";
import "../theme/soft-ui-dashboard.css"
import "../theme/variables.css"
import { Storage } from '@ionic/storage';
const store = new Storage();


export default  {
  name: 'Tab2',
  components: { IonHeader, IonToolbar, IonTitle, IonContent, IonPage },
  data() {
    return {
      loggedin: null,
      uname: null,
      tries: 2
    }
  },
  async ionViewWillEnter() {
    await store.create();
    const loggedin = await store.get('mensalogin');
    if(loggedin == null) {
      await store.set("mensalogin", false)
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
    const loggedin = await store.get('mensalogin');
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
  methods: {
    async login() {
      const name = this.$refs.logincardnumber.value
      const pw = this.$refs.loginpin.value
      const save = this.$refs.loginsave.checked
      await store.create();
      const check = await axios.post("http://127.0.0.1:3600/gus/v1/mensa/login", {card: name, pin: pw}).catch(error => {return error})
      if(check.response && check.response.status == 500 && check.response.data.message == "Falsche Login Daten") {
        this.$refs.buttonlogin.classList = "btn bg-gradient-secondary w-100 my-4 mb-2"
        this.$refs.buttonlogin.innerHTML = `Ungültige Anmeldedaten (Noch ${this.tries} Versuche)`
        this.tries = this.tries - 1
        setTimeout(() => {
          this.$refs.buttonlogin.classList = "btn bg-gradient-dark w-100 my-4 mb-2"
          this.$refs.buttonlogin.innerHTML = "Einloggen"
        }, 5000)
      }
      if(check.response && check.response.status == 500 && check.response.data.message == "Account gesperrt") {
        this.$refs.buttonlogin.classList = "btn bg-gradient-secondary w-100 my-4 mb-2"
        this.$refs.buttonlogin.innerHTML = `Der Account ist aktuell für 10 Minuten gesperrt`
        this.tries = this.tries - 1
        setTimeout(() => {
          this.$refs.buttonlogin.classList = "btn bg-gradient-dark w-100 my-4 mb-2"
          this.$refs.buttonlogin.innerHTML = "Einloggen"
        }, 5000)
      }
      console.log(check)
      if(check.status == 200) {
        if(save) {
          await store.set("mensalogin", true)
          await store.set("mensausername", name)
          await store.set("mensapw", pw)
          this.$refs.buttonlogin.classList = "btn bg-gradient-success w-100 my-4 mb-2"
          this.$refs.buttonlogin.innerHTML = '<i class="fas fa-check" style="margin-right:10px"></i>Erfolgreich eingeloggt'
          const delay = ms => new Promise(res => setTimeout(res, ms));
          await delay(2500)
          this.loggedin = true
        }
        this.$refs.buttonlogin.classList = "btn bg-gradient-success w-100 my-4 mb-2"
        this.$refs.buttonlogin.innerHTML = '<i class="fas fa-check" style="margin-right:10px"></i>Erfolgreich eingeloggt'
        const delay = ms => new Promise(res => setTimeout(res, ms));
        await delay(2500)
        this.loggedin = true
        this.uname = name
      }
    }
  }
}
</script>