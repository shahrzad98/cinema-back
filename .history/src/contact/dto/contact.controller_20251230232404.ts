import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ContactService } from './contact.service';
import { CreateContactDto } from './dto/create-contact.dto';

@Controller()
export class ContactController {
  constructor(private service: ContactService) {}

  @Post('contact')
  create(@Body() dto: CreateContactDto) {
    return this.service.create(dto);
  }

  // Optional debug endpoint (delete before production if you want)
  @Get('contacts')
  list(@Query('limit') limit?: string) {
    const n = Math.max(1, Math.min(200, Number(limit ?? 20)));
    return this.service.list(n);
  }
}
