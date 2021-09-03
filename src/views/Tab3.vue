<template>
  <ion-page>
    <ion-header>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css" />
      <ion-toolbar>
        <ion-title>Website</ion-title>
        <i slot="end" class="fas fa-external-link-alt fa-2x" onclick="window.open('https://www.gymnasium-unterrieden.de/', '_system', 'location=yes'); return false;" style="margin-right:25px"></i>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true" style="overflow:hidden">
        <div class="card mb-4" v-for="article of articles" :key="article" :value="article" style="width:75%">
          <div class="card-header" style="text-align:center">
            <img class="img-fluid border-radius-lg" :src=article.image>
          </div>
          <div class="card-body" style="padding:0">
            <h5 style="text-align:center">
              <a class="font-weight-bold">{{article.title}}</a>
            </h5>
            <p style="text-align:center;font-family: roboto; padding:1.5rem;padding-bottom:unset">
              {{article.short_text}}
            </p>
            <div class="author align-items-center" style="padding: 1rem; padding-top:unset">
              <div class="name ps-2">
                <a :href=article.link class="text-info icon-move-right">Weiterlesen
                  <i class="fas fa-arrow-right text-sm" aria-hidden="true"></i>
                </a>
                <div class="stats">
                  <small>{{article.time}}</small>
                </div>
              </div>
            </div>
          </div>
        </div>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, loadingController, toastController } from '@ionic/vue';
import axios from "axios";
import "../theme/soft-ui-dashboard.css"
import "../theme/variables.css"


export default  {
  name: 'Tab3',
  components: { IonHeader, IonToolbar, IonTitle, IonContent, IonPage },
  data() {
    return {
      articles: []
    }
  },
  created() {
    this.loadData()
  },
  methods: {
    async loadData() {
      const loading = await loadingController.create({
        message: "Website wird geladen",
        animated: true
      })
      await loading.present()
      const data = await axios.get("https://api.henrikdev.xyz/gus/v1/website").catch(error => {return error})
      if(data.response) {
        await loading.dismiss()
        const toast = await toastController.create({
          header: "Fehler",
          message: "Es gab ein Problem beim Herunterladen der aktuellen Website Daten, bitte versuche es später noch einmal",
          duration: 5000,
          animated: true,
          position: "top"
        })
        toast.present()
        return
      }
      loading.dismiss()
      this.articles = data.data
    }
  }
}
</script>