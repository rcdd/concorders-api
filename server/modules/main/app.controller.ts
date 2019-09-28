import { Get, Controller, Post, Body, Delete, Param } from '@nestjs/common';
import { AppService } from './app.service';
import { Table, TableFillableFields, TablesService } from '../table';
import { Place, PlaceFillableFields, PlacesService } from '../place';
import { OrderFillableFields, OrdersService } from '../order';
import { RequestItemFillableFields } from '../request-item';
import { Menu, MenuFillableFields, MenusService } from '../menu';
import { DeleteResult } from 'typeorm';

@Controller('api')
export class AppController {
    constructor(private readonly appService: AppService,
                private readonly tableService: TablesService,
                private readonly placeService: PlacesService,
                private readonly orderService: OrdersService,
                private readonly menuService: MenusService,
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

    @Post('new-table')
    async newTable(@Body() payload: TableFillableFields): Promise<Table> {
        return await this.tableService.create(payload);
    }

    @Delete('remove-table')
    async removeTable(@Body() payload: { tableId: number }): Promise<DeleteResult> {
        return await this.tableService.delete(payload.tableId);
    }

    // PLACES
    @Get('get-places/:table')
    async getPlaces(@Param() params): Promise<Place[]> {
        return await this.placeService.getPlaces(params.table);
    }

    @Post('new-place')
    async newPlace(@Body() payload: PlaceFillableFields): Promise<Place> {
        return await this.placeService.create(payload);
    }

    @Post('add-place-to-table')
    async addPlaceToTable(@Body() payload: { tableId: number, placeId: number }): Promise<any> {
        return await this.tableService.addPlace(payload.tableId, payload.placeId);
    }

    @Delete('remove-place')
    async removePlace(@Body() payload: { placeId: number }): Promise<DeleteResult> {
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

    @Post('new-menu')
    async newMenu(@Body() payload: MenuFillableFields): Promise<Menu> {
        return await this.menuService.create(payload);
    }

    @Delete('remove-menu')
    async removeMenu(@Body() payload: { menuId: number }): Promise<DeleteResult> {
        return await this.menuService.delete(payload.menuId);
    }
}
