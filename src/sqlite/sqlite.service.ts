import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { DatabaseSync } from 'node:sqlite';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { randomUUID } from 'node:crypto';

export type ContactRow = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  createdAt: string;
};

@Injectable()
export class SqliteService implements OnModuleInit, OnModuleDestroy {
  private db!: DatabaseSync;

  // prepared statements
  private insertStmt!: ReturnType<DatabaseSync['prepare']>;
  private getByIdStmt!: ReturnType<DatabaseSync['prepare']>;
  private listStmt!: ReturnType<DatabaseSync['prepare']>;

  onModuleInit() {
    const dbPath = process.env.SQLITE_PATH ?? './data/app.db';

    // Ensure directory exists
    const dir = path.dirname(dbPath);
    if (dir && dir !== '.' && !fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // File-backed database
    this.db = new DatabaseSync(dbPath);

    // Create table if not exists
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS contact_requests (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT,
        message TEXT NOT NULL,
        createdAt TEXT NOT NULL
      );
    `);

    this.insertStmt = this.db.prepare(`
      INSERT INTO contact_requests (id, name, email, phone, message, createdAt)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    this.getByIdStmt = this.db.prepare(`
      SELECT id, name, email, phone, message, createdAt
      FROM contact_requests
      WHERE id = ?
    `);

    this.listStmt = this.db.prepare(`
      SELECT id, name, email, phone, message, createdAt
      FROM contact_requests
      ORDER BY createdAt DESC
      LIMIT ?
    `);
  }

  onModuleDestroy() {
    try {
      this.db?.close();
    } catch {
      // ignore
    }
  }

  createContact(input: {
    name: string;
    email: string;
    phone?: string;
    message: string;
  }): ContactRow {
    const id = randomUUID();
    const createdAt = new Date().toISOString();

    this.insertStmt.run(
      id,
      input.name,
      input.email,
      input.phone ?? null,
      input.message,
      createdAt,
    );

    return this.getByIdStmt.get(id) as ContactRow;
  }

  listContacts(limit = 20): ContactRow[] {
    return this.listStmt.all(limit) as ContactRow[];
  }
}
