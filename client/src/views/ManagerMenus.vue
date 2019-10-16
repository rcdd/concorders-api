<template>
    <div class="manager-menus">
        <v-card-actions>
            <h1>Gestão de Menus</h1>
            <div class="flex-grow-1"></div>
            <v-btn @click="newMenuType">Adicionar menu</v-btn>
        </v-card-actions>
        <template>
            <!--
           TABS
           -->
            <v-tabs v-model="tab"
                    background-color="transparent"
                    fixed-tabs>
                <v-tab v-for="item of menus"
                       :key="item.id">
                    {{ item.name }}
                    <v-icon small
                            class="ml-8"
                            @click="editMenuType(item)">
                        mdi-pencil
                    </v-icon>

                    <v-icon small
                            class="ml-4"
                            color="red darken-1"
                            v-if="!item.items || item.items.length === 0"
                            @click="deleteMenuType(item)">
                        mdi-delete
                    </v-icon>
                </v-tab>
            </v-tabs>

            <v-tabs-items v-model="tab">
                <v-tab-item v-for="(item,i) in menus"
                            :key="item.id">
                    <!--
                    TABLE
                    -->
                    <v-data-table :headers="tableHeader"
                                  :items="menus[i].items"
                                  class="elevation-1 mt-10">

                        <template v-slot:top>
                            <v-toolbar flat color="white">
                                <v-btn color="primary" dark class="mb-2" @click="newItem">Adicionar Produto</v-btn>
                            </v-toolbar>
                        </template>

                        <template v-slot:item.action="{ item }">
                            <v-icon small
                                    class="mr-2"
                                    @click="editItem(item)">
                                mdi-pencil
                            </v-icon>

                            <v-icon small
                                    color="red darken-1"
                                    @click="deleteItem(item)">
                                mdi-delete
                            </v-icon>
                        </template>

                        <template v-slot:no-data>
                            <span>Sem Produtos</span>
                        </template>

                    </v-data-table>
                </v-tab-item>
            </v-tabs-items>
        </template>

        <!--
        EDIT ITEM
        -->
        <template>
            <v-dialog v-model="dialogEditItem" max-width="500px">
                <!--<template v-slot:activator="{ on }">-->
                <!--<v-btn color="primary" dark class="mb-2" v-on="on">New Item</v-btn>-->
                <!--</template>-->
                <v-card @keydown.enter="updateItem">
                    <v-card-text>
                        <v-container>
                            <v-row>
                                <v-col cols="12" sm="12" md="12">
                                    <v-text-field v-model="editedItem.name"
                                                  label="Nome"></v-text-field>
                                </v-col>
                                <v-col cols="12" sm="12" md="12">
                                    <v-text-field v-model="editedItem.price"
                                                  label="Preço"></v-text-field>
                                </v-col>
                            </v-row>
                        </v-container>
                    </v-card-text>

                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="blue darken-1" text @click="cancelEdit">Cancelar</v-btn>
                        <v-btn color="blue darken-1" text @click="updateItem">Guardar</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </template>

        <!--
        EDIT MENU TYPE
        -->
        <template>
            <v-dialog v-model="dialogEditMenuType" max-width="500px">
                <!--<template v-slot:activator="{ on }">-->
                <!--<v-btn color="primary" dark class="mb-2" v-on="on">New Item</v-btn>-->
                <!--</template>-->
                <v-card @keydown.enter="updateMenuType">
                    <v-card-text>
                        <v-container>
                            <v-row>
                                <v-col cols="12" sm="12" md="12">
                                    <v-text-field v-model="editedMenuType.name"
                                                  label="Nome"></v-text-field>
                                </v-col>
                            </v-row>
                        </v-container>
                    </v-card-text>

                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="blue darken-1" text @click="dialogEditMenuType = false">Cancelar</v-btn>
                        <v-btn color="blue darken-1" text @click="updateMenuType">Guardar</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </template>
    </div>
</template>

<script>
    export default {
        name: 'ManagerTables',
        components: {},
        data() {
            return {
                tableHeader: [
                    {
                        text: 'Nome',
                        value: 'name'
                    },
                    {
                        text: 'Preço',
                        value: 'price'
                    },
                    {
                        text: 'Ação',
                        value: 'action'
                    }
                ],
                tab: Number,
                menus: Array,
                menuTypes: Array,
                editedItem: {
                    id: Number,
                    name: String,
                    type: String
                },
                editedMenuType: {
                    id: Number,
                    name: String
                },
                dialogEditItem: false,
                dialogEditMenuType: false
            }
        },
        mounted() {
            this.getMenus();
            this.tab = 0;
        },
        methods: {
            getMenus() {
                this.$http.get('/api/get-menu-types')
                    .then(response => {
                        this.menuTypes = [];
                        this.menuTypes = response.data;
                        console.log(this.menuTypes);

                        this.$http.get('/api/get-menus')
                            .then(response => {
                                this.menus = this.menuTypes;
                                response.data.forEach((item) => {
                                    const menu = this.menus.find(_ => _.id === item.type.id);
                                    if (!menu.items) menu.items = [];
                                    menu.items.push(item);
                                });
                            });
                    });
            },
            newItem() {
                this.editedItem = {
                    name: '',
                    price: '',
                    type: this.menus[this.tab].id
                };
                this.dialogEditItem = true;
            },
            newMenuType() {
                this.editedMenuType = {
                    name: '',
                };
                this.dialogEditMenuType = true;
            },
            editItem(item) {
                this.editedItem = JSON.parse(JSON.stringify(item));
                this.dialogEditItem = true;
            },
            editMenuType(item) {
                this.editedMenuType = JSON.parse(JSON.stringify(item));
                this.dialogEditMenuType = true;
            },
            updateItem() {
                if (this.editedItem.name.trim().length < 1) {
                    alert('Não inseriu o nome do produto!');
                    return;
                }
                if (this.editedItem.price.length < 1) {
                    alert('Não inseriu o preço do produto!');
                    return;
                }

                const price = Number(this.editedItem.price.toString().replace(',', '.'));

                if (!price) {
                    alert('Não inseriu um preço correcto!');
                    return;
                }
                this.editedItem.price = price;

                //Update item
                if (this.editedItem.id) {
                    this.$http.post('/api/edit-menu', this.editedItem)
                        .then(async () => {
                            this.getMenus();
                            this.dialogEditItem = false;
                            this.editedItem = {};
                        }).catch(e => {
                        throw (e);
                    });
                } else { //New item
                    this.$http.post('/api/new-menu', this.editedItem)
                        .then(async () => {
                            this.getMenus();
                            this.dialogEditItem = false;
                            this.editedItem = {};
                        });
                }
            },

            updateMenuType() {
                if (this.editedMenuType.name.trim().length < 1) {
                    alert('Não inseriu o nome do tipo de menu!');
                    return;
                }

                //Update item
                if (this.editedMenuType.id) {
                    this.$http.post('/api/change-menu-type-name', {
                        menuTypeId: this.editedMenuType.id,
                        newName: this.editedMenuType.name
                    }).then(async () => {
                        this.getMenus();
                        this.dialogEditMenuType = false;
                        this.editedMenuType = {};
                    }).catch(e => {
                        throw (e);
                    });
                } else { //New item
                    this.$http.post('/api/new-menu-type', {name: this.editedMenuType.name})
                        .then(async () => {
                            this.getMenus();
                            this.dialogEditMenuType = false;
                            this.editedMenuType = {};
                        });
                }
            },
            cancelEdit() {
                this.dialogEditItem = false;
            },
            deleteItem(item) {
                if (confirm('Tem a certeza que deseja remover? Esta acção é irreversivel!')) {
                    this.$http.delete('/api/remove-menu/' + item.id)
                        .then(async () => {
                            await this.getMenus();
                        });
                }
            },
            deleteMenuType(item) {
                if (confirm('Tem a certeza que deseja remover? Esta acção é irreversivel!')) {
                    this.$http.delete('/api/remove-menu-type/' + item.id)
                        .then(async () => {
                            await this.getMenus();
                        });
                }
            }
        }
    };
</script>
