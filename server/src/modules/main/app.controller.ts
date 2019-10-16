import { Get, Controller, Post, Body, Delete, Param } from '@nestjs/common';
import { AppService } from './app.service';
import { Table, TableFillableFields, TablesService } from '../table';
import { Place, PlaceFillableFields, PlacesService } from '../place';
import { OrderFillableFields, OrdersService } from '../order';
import { RequestItemFillableFields } from '../request-item';
import { Menu, MenuFillableFields, MenusService } from '../menu';
import { DeleteResult } from 'typeorm';
import { MenuType, MenuTypeFillableFields, MenuTypeService } from '../menu-type';

@Controller('api')
export class AppController {
    constructor(private readonly appService: AppService,
                private readonly tableService: TablesService,
                private readonly placeService: PlacesService,
                private readonly orderService: OrdersService,
                private readonly menuService: MenusService,
                private readonly menuTypeService: MenuTypeService,
    ) {
    }

    @Get()
    root(): string {
        return this.appService.root();
    }

    // TABLES
    @Get('tables') // Full details
    async tables(): Promise<Table[]> {
        return await this.tableService.getFullDetails();
    }

    @Get('get-tables')
    async getTables(): Promise<Table[]> {
        return await this.tableService.getTables();
    }

    @Post('change-table-name')
    async changeTableName(@Body() payload: { tableId: number, newName: string }): Promise<Table> {
        return await this.tableService.changeName(payload.tableId, payload.newName);
    }

    @Post('new-table')
    async newTable(@Body() payload: TableFillableFields): Promise<Table> {
        return await this.tableService.create(payload);
    }

    @Delete('remove-table/:tableId')
    async removeTable(@Param() param): Promise<DeleteResult> {
        return await this.tableService.delete(param.tableId);
    }

    // PLACES
    @Get('get-places/:table')
    async getPlaces(@Param() params): Promise<Place[]> {
        return await this.placeService.getPlaces(params.table);
    }

    // @Post('new-place')
    // async newPlace(@Body() payload: PlaceFillableFields): Promise<Place> {
    //     return await this.placeService.create(payload);
    // }
    // }

    @Post('change-place-name')
    async changePlaceName(@Body() payload: { placeId: number, newName: string }): Promise<Place> {
        return await this.placeService.changeName(payload.placeId, payload.newName);
    }

    @Post('add-place-to-table')
    async addPlaceToTable(@Body() payload: { tableId: number, place: PlaceFillableFields }): Promise<any> {
        const place = await this.placeService.create(payload.place);
        return await this.tableService.addPlace(payload.tableId, place.id);
    }

    @Delete('remove-place/:placeId')
    async removePlace(@Param() payload): Promise<DeleteResult> {
        return await this.placeService.delete(payload.placeId);
    }

    // ORDERS
    @Post('new-order')
    async newOrder(@Body() payload: { placeId: number, order: OrderFillableFields }): Promise<any> {
        return await this.placeService.addOrder(payload.placeId, payload.order);
    }

    @Post('update-order')
    async updateOrder(@Body() payload: { orderId: number, requests: RequestItemFillableFields[] }): Promise<any> {
        return await this.orderService.updateOrder(payload.orderId, payload.requests);
    }

    @Post('close-order')
    async closeOrder(@Body() payload: { orderId: number }): Promise<any> {
        return await this.orderService.closeOrder(payload.orderId);
    }

    @Get('get-order/:placeId')
    async getOrder(@Param() params): Promise<any> {
        return await this.orderService.getActiveOrder(params.placeId);
    }

    // MENU
    @Get('get-menus')
    async getMenus(): Promise<any> {
        return await this.menuService.getAll();
    }

    @Post('edit-menu')
    async editMenu(@Body() payload: MenuFillableFields): Promise<Menu> {
        return await this.menuService.update(payload);
    }

    @Post('new-menu')
    async newMenu(@Body() payload: MenuFillableFields): Promise<Menu> {
        return await this.menuService.create(payload);
    }

    @Delete('remove-menu/:menuId')
    async removeMenu(@Param() payload): Promise<DeleteResult> {
        return await this.menuService.delete(payload.menuId);
    }

    // MENU TYPE
    @Get('get-menu-types')
    async getMenuTypes(): Promise<any> {
        return await this.menuTypeService.getAll();
    }

    @Post('new-menu-type')
    async newMenuType(@Body() payload: MenuTypeFillableFields): Promise<MenuType> {
        return await this.menuTypeService.create(payload);
    }

    @Post('change-menu-type-name')
    async changeMenuTypeName(@Body() payload: { menuTypeId: number, newName: string }): Promise<MenuType> {
        return await this.menuTypeService.changeName(payload.menuTypeId, payload.newName);
    }

    @Delete('remove-menu-type/:menuTypeId')
    async removeMenuType(@Param() payload): Promise<DeleteResult> {
        return await this.menuTypeService.delete(payload.menuTypeId);
    }
}
