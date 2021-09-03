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
</template>

<script>
import { IonContent, IonHeader, IonBackButton, IonToolbar, IonButtons, modalController } from '@ionic/vue';
import { defineComponent } from 'vue';
import { Storage } from '@ionic/storage';
const store = new Storage();
import axios from "axios";
import "../theme/soft-ui-dashboard.css"

export default defineComponent({
  name: 'ModalMensa',
  data() {
    return {
      show: false
    }
  },
  components: { IonContent, IonHeader, IonBackButton, IonToolbar, IonButtons },
  methods: {
    async login() {
      const name = this.$refs.logincardnumber.value
      const pw = this.$refs.loginpin.value
      const save = this.$refs.loginsave.checked
      await store.create();
      const check = await axios.post("http://127.0.0.1:3600/gus/v1/mensa/login", {card: name, pin: pw}).catch(error => {return error})
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
          await store.set("mensalogin", true)
          await store.set("mensausername", name)
          await store.set("mensapw", pw)
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