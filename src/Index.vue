<template>
    <div id="app">
        <v-app light>
            <v-toolbar class="white">
                <v-toolbar-title v-text="title"></v-toolbar-title>
            </v-toolbar>
            <main>
                <v-content>
                    <section>
                        <v-parallax src="assets/coal.jpeg" height="600">
                            <v-layout
                                    column
                                    align-center
                                    justify-center
                                    class="white--text"
                            >
                                <img src="assets/vuetify.png" alt="Vuetify.js" height="200">
                                <h1 class="white--text mb-2 display-1 text-xs-center">Aneesh SPA</h1>
                            </v-layout>
                        </v-parallax>
                    </section>

                    <section>
                        <v-layout
                                column
                                wrap
                                class="my-5"
                                align-center
                        >
                            <v-flex xs12>
                                <v-container grid-list-xl>
                                    <v-layout row wrap align-center>
                                        <v-flex xs12 md4>
                                            <v-card class="elevation-0 transparent">
                                                <v-card-text class="text-xs-center">
                                                    <v-icon x-large class="blue--text text--lighten-2">fitness_center</v-icon>
                                                </v-card-text>
                                                <v-card-title primary-title class="layout justify-center">
                                                    <div class="headline text-xs-center">Training Zone</div>
                                                </v-card-title>
                                                <v-card-text>
                                                    This app helps to calculate the optimal amount of exercise required depending on your age
                                                </v-card-text>
                                            </v-card>
                                        </v-flex>
                                        <v-flex xs12 md4>
                                            <v-card class="elevation-0 transparent">
                                                <v-card-text class="text-xs-center">
                                                    <v-icon x-large class="blue--text text--lighten-2">grade</v-icon>
                                                </v-card-text>
                                                <v-card-title primary-title class="layout justify-center">
                                                    <div class="headline">GPA Calculator</div>
                                                </v-card-title>
                                                <v-card-text>
                                                    This app calculates an individuals GPA and can be used to plan an individuals college career
                                                </v-card-text>
                                            </v-card>
                                        </v-flex>
                                        <v-flex xs12 md4>
                                            <v-card class="elevation-0 transparent">
                                                <v-card-text class="text-xs-center">
                                                    <v-icon x-large class="blue--text text--lighten-2">watch</v-icon>
                                                </v-card-text>
                                                <v-card-title primary-title class="layout justify-center">
                                                    <div class="headline text-xs-center">Clock</div>
                                                </v-card-title>
                                                <v-card-text>
                                                    This app displays the current time based on the device's system clock.
                                                </v-card-text>
                                            </v-card>
                                        </v-flex>
                                    </v-layout>
                                </v-container>
                            </v-flex>
                        </v-layout>
                    </section>


                    <v-footer class="blue darken-2">
                        <v-layout row wrap align-center>
                            <v-flex xs12>
                                <div class="white--text ml-3">
                                    Made with
                                    <v-icon class="red--text">favorite</v-icon>
                                    by <a class="white--text" href="https://vuetifyjs.com" target="_blank">Vuetify</a>
                                    and <a class="white--text" href="https://github.com/vwxyzjn">Costa Huang</a>, modified by Aneesh Borah
                                </div>
                            </v-flex>
                        </v-layout>
                    </v-footer>
                </v-content>
            </main>
        </v-app>
    </div>
</template>
