<template>
    <ion-header>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css" />
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button @click="close" default-href=""></ion-back-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <div style="display: flex;align-items: center;min-height: 100%;">
        <div class="container" style="padding-top:auto;padding-bottom:auto;">
          <div class="col-md-7 mx-auto">
            <div class="card mb-4">
              <div class="card-header text-center"> 
                <h4>Einloggen</h4>
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
</template>

<script>
import { IonContent, IonHeader, IonBackButton, IonToolbar, IonButtons, modalController } from '@ionic/vue';
import { defineComponent } from 'vue';
import { Storage } from '@ionic/storage';
const store = new Storage();
import axios from "axios";
import "../theme/soft-ui-dashboard.css"

export default defineComponent({
  name: 'Modal',
  data() {
    return {
      show: false
    }
  },
  components: { IonContent, IonHeader, IonBackButton, IonToolbar, IonButtons },
  methods: {
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
      console.log(save)
      if(check.status == 200) {
        if(save) {
          await store.set("vplogin", true)
          await store.set("vpusername", name)
          await store.set("vppw", pw)
          this.$refs.buttonlogin.classList = "btn bg-gradient-success w-100 my-4 mb-2"
          this.$refs.buttonlogin.innerHTML = '<i class="fas fa-check" style="margin-right:10px"></i>Erfolgreich eingeloggt'
          setTimeout(async () => {
            await modalController.dismiss()
          }, 2500)
        }
      }
    },
    async close() {
      await modalController.dismiss()
    }
  }
});
</script>