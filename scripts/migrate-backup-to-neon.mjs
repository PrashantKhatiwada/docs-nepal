import fs from "node:fs"
import path from "node:path"
import process from "node:process"
import pg from "pg"

const { Client } = pg

const backupPath = path.resolve(process.cwd(), "db_cluster-28-09-2025@06-19-19.backup")
const databaseUrl = process.env.DATABASE_URL

if (!databaseUrl) {
  console.error("Missing DATABASE_URL environment variable.")
  process.exit(1)
}

if (!fs.existsSync(backupPath)) {
  console.error(`Backup file not found: ${backupPath}`)
  process.exit(1)
}

function parseCopyBlocks(content) {
  const lines = content.split(/\r?\n/)
  const targets = {
    users: "COPY public.users (id, email, name, avatar_url, provider, created_at, updated_at) FROM stdin;",
    documents:
      "COPY public.documents (id, user_id, template_id, title, form_data, language, created_at, updated_at) FROM stdin;",
    template_usage: "COPY public.template_usage (id, template_id, user_id, created_at) FROM stdin;",
  }

  /** @type {Record<string, string[]>} */
  const rows = { users: [], documents: [], template_usage: [] }

  let current = null
  for (const line of lines) {
    if (!current) {
      if (line === targets.users) current = "users"
      else if (line === targets.documents) current = "documents"
      else if (line === targets.template_usage) current = "template_usage"
      continue
    }

    if (line === "\\.") {
      current = null
      continue
    }

    rows[current].push(line)
  }

  return rows
}

function fromCopyValue(value) {
  return value === "\\N" ? null : value
}

async function run() {
  const dump = fs.readFileSync(backupPath, "utf8")
  const data = parseCopyBlocks(dump)

  const client = new Client({
    connectionString: databaseUrl,
    ssl: { rejectUnauthorized: false },
  })

  await client.connect()

  try {
    await client.query("BEGIN")

    await client.query(`
      CREATE EXTENSION IF NOT EXISTS pgcrypto;

      CREATE TABLE IF NOT EXISTS public.users (
        id uuid PRIMARY KEY,
        email varchar(255) UNIQUE NOT NULL,
        name varchar(255) NOT NULL,
        avatar_url text,
        provider varchar(50) NOT NULL DEFAULT 'email',
        created_at timestamptz DEFAULT now(),
        updated_at timestamptz DEFAULT now()
      );

      CREATE TABLE IF NOT EXISTS public.documents (
        id uuid PRIMARY KEY,
        user_id uuid NOT NULL,
        template_id varchar(100) NOT NULL,
        title varchar(255) NOT NULL,
        form_data jsonb NOT NULL,
        language varchar(10) NOT NULL DEFAULT 'english',
        created_at timestamptz DEFAULT now(),
        updated_at timestamptz DEFAULT now()
      );

      CREATE TABLE IF NOT EXISTS public.template_usage (
        id uuid PRIMARY KEY,
        template_id varchar(100) NOT NULL,
        user_id uuid NOT NULL,
        created_at timestamptz DEFAULT now()
      );

      CREATE INDEX IF NOT EXISTS idx_documents_user_id ON public.documents(user_id);
      CREATE INDEX IF NOT EXISTS idx_documents_template_id ON public.documents(template_id);
      CREATE INDEX IF NOT EXISTS idx_template_usage_template_id ON public.template_usage(template_id);
      CREATE INDEX IF NOT EXISTS idx_template_usage_user_id ON public.template_usage(user_id);
    `)

    await client.query("TRUNCATE TABLE public.template_usage, public.documents, public.users")

    for (const line of data.users) {
      if (!line.trim()) continue
      const [id, email, name, avatar_url, provider, created_at, updated_at] = line.split("\t")
      await client.query(
        `
          INSERT INTO public.users (id, email, name, avatar_url, provider, created_at, updated_at)
          VALUES ($1, $2, $3, $4, $5, $6, $7)
        `,
        [
          fromCopyValue(id),
          fromCopyValue(email),
          fromCopyValue(name),
          fromCopyValue(avatar_url),
          fromCopyValue(provider),
          fromCopyValue(created_at),
          fromCopyValue(updated_at),
        ],
      )
    }

    for (const line of data.documents) {
      if (!line.trim()) continue
      const [id, user_id, template_id, title, form_data, language, created_at, updated_at] = line.split("\t")
      await client.query(
        `
          INSERT INTO public.documents (id, user_id, template_id, title, form_data, language, created_at, updated_at)
          VALUES ($1, $2, $3, $4, $5::jsonb, $6, $7, $8)
        `,
        [
          fromCopyValue(id),
          fromCopyValue(user_id),
          fromCopyValue(template_id),
          fromCopyValue(title),
          fromCopyValue(form_data),
          fromCopyValue(language),
          fromCopyValue(created_at),
          fromCopyValue(updated_at),
        ],
      )
    }

    for (const line of data.template_usage) {
      if (!line.trim()) continue
      const [id, template_id, user_id, created_at] = line.split("\t")
      await client.query(
        `
          INSERT INTO public.template_usage (id, template_id, user_id, created_at)
          VALUES ($1, $2, $3, $4)
        `,
        [fromCopyValue(id), fromCopyValue(template_id), fromCopyValue(user_id), fromCopyValue(created_at)],
      )
    }

    await client.query("COMMIT")

    console.log(`Imported users: ${data.users.length}`)
    console.log(`Imported documents: ${data.documents.length}`)
    console.log(`Imported template_usage rows: ${data.template_usage.length}`)
    console.log("Neon migration complete.")
  } catch (error) {
    await client.query("ROLLBACK")
    throw error
  } finally {
    await client.end()
  }
}

run().catch((error) => {
  console.error("Migration failed:", error)
  process.exit(1)
})
