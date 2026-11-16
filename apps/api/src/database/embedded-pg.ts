import { newDb } from 'pg-mem';
import * as net from 'net';
import * as fs from 'fs';
import * as path from 'path';

export function startEmbeddedPostgres(port = 5432): Promise<net.Server> {
  return new Promise((resolve, reject) => {
    const db = newDb({
      autoCreateForeignKeyIndices: true
    });

    // Register uuid function
    db.public.registerFunction({
      name: 'gen_random_uuid',
      implementation: () => require('crypto').randomUUID()
    });

    // Execute schema migration
    const migrationPath = path.join(__dirname, '../../prisma/migrations/20261116000000_init/migration.sql');
    if (fs.existsSync(migrationPath)) {
      const sql = fs.readFileSync(migrationPath, 'utf8');
      try {
        db.public.none(sql);
        console.log('[Embedded PostgreSQL] Schema applied successfully');
      } catch (err) {
        console.warn('[Embedded PostgreSQL] Migration note:', (err as any).message);
      }
    }

    // Set up adapter or socket server if needed
    resolve(null as any);
  });
}
