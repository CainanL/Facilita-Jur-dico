import { Body, Controller, Get, Param, Post, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { AppService } from './app.service';
import { CreateClientRequestDTO } from './objectTransfer/CreateClientRequestDTO';

@Controller('/client')
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  async search(
    @Query('name') name: string,
    @Query('email') email: string,
    @Query('phone') phone: string,
  ) {
    return await this.appService.searchClient({ name, email, phone });
  }

  @Get(':id')
  async searchById(@Param('id') id: string) {
    return await this.appService.searchClient({ id });
  }
 
  @Get('/router/:id')
  async getRouter(@Param('id') id: string) {
    return await this.appService.generateRoute(id);
  }


  @Post()
  @UsePipes(ValidationPipe)
  async create(
    @Body() client: CreateClientRequestDTO
  ) {
    return await this.appService.createClient(client);
  }
}
