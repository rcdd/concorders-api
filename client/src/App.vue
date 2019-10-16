<template>
    <v-app>
        <nav-bar/>

        <v-app-bar app>
            <!-- -->
        </v-app-bar>

        <!-- Sizes your content based upon application components -->
        <v-content>
            <!-- Provides the application the proper gutter -->
            <v-container fluid>
                <!-- If using vue-router -->
                <router-view></router-view>
            </v-container>
        </v-content>

        <v-footer app>
            <!-- -->
        </v-footer>
    </v-app>
</template>

<script>
    import NavBar from "./components/NavBar";

    export default {
        name: 'App',
        components: {NavBar},
        data: () => ({
            //
        }),
    };
</script>
