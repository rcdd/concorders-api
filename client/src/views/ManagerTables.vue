<template>
    <div class="manager-tables">
        <v-card-actions>
            <h1>Gestão de Mesas</h1>

            <div class="flex-grow-1"></div>
            <v-btn color="light-green" @click="dialogNewTable = true">
                Adicionar Mesa
            </v-btn>
        </v-card-actions>

        <div class="row">
            <v-card
                    v-for="(table,i) of tables" :key="i"
                    class="col-4 my-3 mx-3"
                    max-width="350"
                    min-width="250"
                    outlined
            >
                <v-list-item three-line>
                    <v-list-item-content>
                        <div class="overline mb-4">Lugares: {{table.placesCount}}</div>
                        <v-card-actions>
                            <div class="headline mb-1">{{table.name}}</div>
                            <v-btn icon class="ml-6" @click="editTable(table)">
                                <v-icon color="grey lighten-1">mdi-pencil</v-icon>
                            </v-btn>
                        </v-card-actions>
                    </v-list-item-content>
                    <!--<v-list-item-avatar-->
                    <!--tile-->
                    <!--size="80"-->
                    <!--color="grey"-->
                    <!--&gt;</v-list-item-avatar>-->
                </v-list-item>

                <v-card-actions>
                    <v-btn text color="primary" @click="showPlaces(table.id)">Editar Lugares</v-btn>

                    <div class="flex-grow-1"></div>
                    <v-btn icon @click="removeTable(table.id)">
                        <v-icon color="red lighten-1">mdi-delete</v-icon>
                    </v-btn>
                </v-card-actions>
            </v-card>
        </div>


        <!--
        ADD TABLE
        -->
        <template>
            <v-row justify="center">
                <v-dialog v-model="dialogNewTable" persistent max-width="600px">
                    <v-card>
                        <v-card-title>
                            <span class="headline">Nova Mesa</span>
                        </v-card-title>
                        <v-card-text>
                            <v-text-field label="Nome da Mesa*" required
                                          v-model="newTableName"></v-text-field>
                        </v-card-text>
                        <v-card-actions>
                            <div class="flex-grow-1"></div>
                            <v-btn color="blue darken-1" text @click="dialogNewTable = false">Cancelar</v-btn>
                            <v-btn color="blue darken-1" text @click="addTable">Gravar</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
            </v-row>
        </template>


        <!--
        ADD PLACE
        -->
        <template>
            <v-row justify="center">
                <v-dialog v-model="dialogNewPlace" persistent max-width="600px">
                    <v-card>
                        <v-card-title>
                            <span class="headline">Novo Lugar</span>
                        </v-card-title>
                        <v-card-text>
                            <v-text-field label="Nome do Lugar*" required
                                          v-model="newPlaceName"></v-text-field>
                        </v-card-text>
                        <v-card-actions>
                            <div class="flex-grow-1"></div>
                            <v-btn color="blue darken-1" text @click="dialogNewPlace = false">Close</v-btn>
                            <v-btn color="blue darken-1" text @click="addPlace">Save</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
            </v-row>
        </template>


        <!--
        CHANGE PLACE NAME
        -->
        <template>
            <v-row justify="center">
                <v-dialog v-model="dialogChangePlaceName" persistent max-width="600px">
                    <v-card>
                        <v-card-title>
                            <span class="headline">Alterar nome de lugar</span>
                        </v-card-title>
                        <v-card-text>
                            <v-text-field label="Nome do Lugar*" required
                                          v-model="editPlaceName"></v-text-field>
                        </v-card-text>
                        <v-card-actions>
                            <div class="flex-grow-1"></div>
                            <v-btn color="blue darken-1" text @click="dialogChangePlaceName = false">Cancelar</v-btn>
                            <v-btn color="blue darken-1" text @click="updatePlaceName">Gravar</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
            </v-row>
        </template>


        <!--
        CHANGE TABLE NAME
        -->
        <template>
            <v-row justify="center">
                <v-dialog v-model="dialogChangeTableName" persistent max-width="600px">
                    <v-card>
                        <v-card-title>
                            <span class="headline">Alterar nome de Mesa</span>
                        </v-card-title>
                        <v-card-text>
                            <v-text-field label="Nome de Mesa*" required
                                          v-model="editTableName"></v-text-field>
                        </v-card-text>
                        <v-card-actions>
                            <div class="flex-grow-1"></div>
                            <v-btn color="blue darken-1" text @click="dialogChangeTableName = false">Cancelar</v-btn>
                            <v-btn color="blue darken-1" text @click="updateTableName">Gravar</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
            </v-row>
        </template>


        <!--
        LIST PLACES OF TABLE
        -->
        <template>
            <v-row justify="center">
                <v-dialog v-model="dialogTable" fullscreen hide-overlay transition="dialog-bottom-transition">
                    <v-card>
                        <v-toolbar dark color="primary">
                            <v-btn icon dark @click="dialogTable = false; getTables()">
                                <v-icon>mdi-close</v-icon>
                            </v-btn>
                            <v-toolbar-title>Editar Lugares</v-toolbar-title>
                            <div class="flex-grow-1"></div>
                            <v-toolbar-items>
                                <v-btn dark text @click="dialogNewPlace = true">Adicionar</v-btn>
                            </v-toolbar-items>
                        </v-toolbar>
                        <v-list three-line subheader>
                            <v-subheader>Lugares</v-subheader>
                            <v-list-item v-for="(place,i) of tablePlaces" :key="i">
                                <v-list-item-content>
                                    <v-list-item-title>{{place.name}}</v-list-item-title>
                                    <v-list-item-subtitle>{{place.peopleCount}} Pessoas
                                    </v-list-item-subtitle>
                                </v-list-item-content>
                                <v-list-item-action>
                                    <v-btn icon
                                           @click="editingPlace = place.id;editPlaceName = place.name;dialogChangePlaceName = true">
                                        <v-icon color="grey lighten-1">mdi-pencil</v-icon>
                                    </v-btn>
                                </v-list-item-action>
                                <v-list-item-action>
                                    <v-btn icon @click="removePlace(place.id)">
                                        <v-icon color="red lighten-1">mdi-delete</v-icon>
                                    </v-btn>
                                </v-list-item-action>
                            </v-list-item>
                        </v-list>
                        <v-divider></v-divider>
                    </v-card>
                </v-dialog>
            </v-row>
        </template>
    </div>
</template>

<script>
    export default {
        name: 'ManagerTables',
        components: {},
        data() {
            return {
                tables: Array,
                tablePlaces: Array,
                dialogNewPlace: false,
                dialogNewTable: false,
                dialogChangePlaceName: false,
                dialogChangeTableName: false,
                dialogTable: false,
                editingTable: undefined,
                editingPlace: undefined,
                newTableName: '',
                newPlaceName: '',
                editPlaceName: '',
                editTableName: ''
            }
        },
        mounted() {
            this.getTables();
        },
        methods: {
            getTables() {
                this.$http.get('/api/get-tables')
                    .then(response => {
                        this.tables = response.data;
                    });
            },
            async showPlaces(tableId) {
                this.tablePlaces = await this.getPlaces(tableId);
                this.editingTable = tableId;
                this.dialogTable = true;
            },
            getPlaces(tableId) {
                return this.$http.get('/api/get-places/' + tableId)
                    .then(response => {
                        return response.data;
                    });
            },
            addPlace() {
                return this.$http.post('/api/add-place-to-table', {
                    tableId: this.editingTable,
                    place: {name: this.newPlaceName}
                })
                    .then(response => {
                        this.tablePlaces = response.data.places;
                        this.dialogNewPlace = false;
                        this.newPlaceName = '';
                    });
            },
            updatePlaceName() {
                return this.$http.post('/api/change-place-name', {
                    placeId: this.editingPlace,
                    newName: this.editPlaceName
                })
                    .then(async () => {
                        this.tablePlaces = await this.getPlaces(this.editingTable);
                        this.dialogChangePlaceName = false;
                        this.editPlaceName = '';
                    });

            },
            removePlace(placeId) {
                if (confirm('Tem a certeza que deseja remover? Esta acção é irreversivel!')) {
                    this.$http.delete('/api/remove-place/' + placeId)
                        .then(async () => {
                            // console.log(response);
                            this.tablePlaces = await this.getPlaces(this.editingTable);
                            // this.tablePlaces = response.data.places;
                            // this.dialogNewPlace = false;
                            // this.newPlaceName = '';
                        });
                }
            },

            editTable(table) {
                this.editingTable = table.id;
                this.editTableName = table.name;
                this.dialogChangeTableName = true;

            },
            removeTable(tableId) {
                if (confirm('Tem a certeza que deseja remover? Esta acção é irreversivel!')) {
                    this.$http.delete('/api/remove-table/' + tableId)
                        .then(async () => {
                            this.getTables();
                        });
                }
            },
            addTable() {
                return this.$http.post('/api/new-table', {
                    name: this.newTableName
                }).then(() => {
                    this.getTables();
                    this.dialogNewTable = false;
                    this.newTableName = '';
                });
            },
            updateTableName() {
                return this.$http.post('/api/change-table-name', {
                    tableId: this.editingTable,
                    newName: this.editTableName
                }).then(async () => {
                    this.getTables();
                    this.dialogChangeTableName = false;
                    this.editTableName = '';
                });

            },
        }
    };
</script>
