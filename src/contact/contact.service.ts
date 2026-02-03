import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateContactDto } from './dto/create-contact.dto';
import { SqliteService } from '../sqlite/sqlite.service';

@Injectable()
export class ContactService {
  constructor(private sqlite: SqliteService) {}

  create(dto: CreateContactDto) {
    if (dto.website && dto.website.trim().length > 0) {
      throw new BadRequestException('Spam detected.');
    }

    return this.sqlite.createContact({
      name: dto.name,
      email: dto.email,
      phone: dto.phone,
      message: dto.message,
    });
  }

  // Optional: for debugging locally (remove in production)
  list(limit = 20) {
    return this.sqlite.listContacts(limit);
  }
}
