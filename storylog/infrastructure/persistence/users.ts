import "server-only"

import { getPool, type DatabaseClient } from "./db"

export const developmentUser = {
  id: "01998560-0000-7000-8000-000000000001",
  username: "local-dev-user",
  displayName: "Local Dev User",
  avatarUrl: null as string | null,
}

interface UserRow {
  id: string
  username: string
  displayName: string
  avatarUrl: string | null
  createdAt: Date
}

export async function ensureDevelopmentUser(
  client: DatabaseClient = getPool()
): Promise<UserRow> {
  const result = await client.query<UserRow>(
    `
      INSERT INTO users (id, username, display_name, avatar_url)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (username)
      DO UPDATE SET
        display_name = EXCLUDED.display_name,
        avatar_url = EXCLUDED.avatar_url
      RETURNING
        id,
        username,
        display_name AS "displayName",
        avatar_url AS "avatarUrl",
        created_at AS "createdAt"
    `,
    [
      developmentUser.id,
      developmentUser.username,
      developmentUser.displayName,
      developmentUser.avatarUrl,
    ]
  )

  return result.rows[0]
}
