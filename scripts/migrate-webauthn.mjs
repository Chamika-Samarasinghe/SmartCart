import "dotenv/config";
import pg from "pg";

const { Client } = pg;

const sql = `
CREATE TABLE IF NOT EXISTS "Account" (
  "userId"            TEXT NOT NULL,
  "type"              TEXT NOT NULL,
  "provider"          TEXT NOT NULL,
  "providerAccountId" TEXT NOT NULL,
  "refresh_token"     TEXT,
  "access_token"      TEXT,
  "expires_at"        INTEGER,
  "token_type"        TEXT,
  "scope"             TEXT,
  "id_token"          TEXT,
  "session_state"     TEXT,
  "createdAt"         TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"         TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Account_pkey" PRIMARY KEY ("provider", "providerAccountId")
);

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name='Account_userId_fkey') THEN
    ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS "Session" (
  "sessionToken" TEXT NOT NULL,
  "userId"       TEXT NOT NULL,
  "expires"      TIMESTAMP(3) NOT NULL,
  "createdAt"    TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"    TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Session_pkey" PRIMARY KEY ("sessionToken")
);

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name='Session_userId_fkey') THEN
    ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS "VerificationToken" (
  "identifier" TEXT NOT NULL,
  "token"      TEXT NOT NULL,
  "expires"    TIMESTAMP(3) NOT NULL,
  CONSTRAINT "VerificationToken_pkey" PRIMARY KEY ("identifier", "token")
);

CREATE TABLE IF NOT EXISTS "Authenticator" (
  "credentialID"         TEXT    NOT NULL,
  "userId"               TEXT    NOT NULL,
  "providerAccountId"    TEXT    NOT NULL,
  "credentialPublicKey"  TEXT    NOT NULL,
  "counter"              INTEGER NOT NULL,
  "credentialDeviceType" TEXT    NOT NULL,
  "credentialBackedUp"   BOOLEAN NOT NULL,
  "transports"           TEXT,
  CONSTRAINT "Authenticator_pkey" PRIMARY KEY ("userId", "credentialID")
);

CREATE UNIQUE INDEX IF NOT EXISTS "Authenticator_credentialID_key" ON "Authenticator"("credentialID");

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name='Authenticator_userId_fkey') THEN
    ALTER TABLE "Authenticator" ADD CONSTRAINT "Authenticator_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;
`;

const client = new Client({ connectionString: process.env.DATABASE_URL });
await client.connect();
console.log("Connected to database.");
await client.query(sql);
console.log("Migration applied.");

const { rows } = await client.query(`
  SELECT table_name FROM information_schema.tables
  WHERE table_schema='public' AND table_name IN ('Account','Session','VerificationToken','Authenticator')
  ORDER BY table_name
`);
console.log("Tables present:", rows.map(r => r.table_name).join(", "));
await client.end();
