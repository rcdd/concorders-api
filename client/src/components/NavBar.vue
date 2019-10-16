<template>
    <v-navigation-drawer app
                         expand-on-hover
                         permanent>
        <template v-slot:prepend>
            <v-list>
                <v-list-item>
                    <v-list-item-icon>
                        <v-icon>mdi-menu</v-icon>
                    </v-list-item-icon>
                    <v-list-item-title>Menu</v-list-item-title>
                </v-list-item>
            </v-list>
        </template>

        <v-divider></v-divider>

        <v-list nav dense>
            <v-list-item link v-for="(item,index) of navItems" :key="index" @click="goTo(item.link)">
                <v-list-item-icon>
                    <v-icon>{{item.icon}}</v-icon>
                </v-list-item-icon>
                <v-list-item-title>{{item.title}}</v-list-item-title>
            </v-list-item>
        </v-list>
    </v-navigation-drawer>
</template>

<script>
    export default {
        name: "NavBar",
        data() {
            return {
                navItems: [
                    {title: 'Dashboard', icon: 'mdi-view-dashboard', link: '/'},
                    {title: 'Gerir Mesas', icon: 'mdi-table-settings', link: '/manager-tables'},
                    {title: 'Gerir Menus', icon: 'mdi-silverware', link: '/manager-menus'},
                    {title: 'About', icon: 'mdi-help-box', link: '/about'},
                ],
            }
        },
        methods: {
            goTo(link) {
                this.$router.push(link).catch(() => {
                });
            }
        }
    }
</script>

<style lang="scss">
</style>
