using Microsoft.EntityFrameworkCore;

namespace LAmour.Api.Data;

/// <summary>
/// The database is created with EnsureCreated (no migrations), which never touches an existing
/// file. These idempotent statements bring an older lamour.db up to the current model — new
/// columns and tables only, never dropping data — so updating the API doesn't mean losing the
/// bookings, team and catalog already stored.
/// </summary>
public static class SchemaUpgrader
{
    public static void Upgrade(LAmourDbContext db)
    {
        AddColumnIfMissing(db, "Masseuses", "SlotIntervalMinutes", "INTEGER NOT NULL DEFAULT 30");
        AddColumnIfMissing(db, "Masseuses", "BufferMinutes", "INTEGER NOT NULL DEFAULT 0");

        db.Database.ExecuteSqlRaw("""
            CREATE TABLE IF NOT EXISTS "MasseuseWorkingHours" (
                "Id" INTEGER NOT NULL CONSTRAINT "PK_MasseuseWorkingHours" PRIMARY KEY AUTOINCREMENT,
                "MasseuseId" INTEGER NOT NULL,
                "DayOfWeek" INTEGER NOT NULL,
                "StartMinute" INTEGER NOT NULL,
                "EndMinute" INTEGER NOT NULL,
                CONSTRAINT "FK_MasseuseWorkingHours_Masseuses_MasseuseId" FOREIGN KEY ("MasseuseId") REFERENCES "Masseuses" ("Id") ON DELETE CASCADE
            );
            """);
        db.Database.ExecuteSqlRaw("""
            CREATE INDEX IF NOT EXISTS "IX_MasseuseWorkingHours_MasseuseId_DayOfWeek" ON "MasseuseWorkingHours" ("MasseuseId", "DayOfWeek");
            """);

        db.Database.ExecuteSqlRaw("""
            CREATE TABLE IF NOT EXISTS "MasseuseTimeOff" (
                "Id" INTEGER NOT NULL CONSTRAINT "PK_MasseuseTimeOff" PRIMARY KEY AUTOINCREMENT,
                "MasseuseId" INTEGER NOT NULL,
                "Date" TEXT NOT NULL,
                "Note" TEXT NULL,
                CONSTRAINT "FK_MasseuseTimeOff_Masseuses_MasseuseId" FOREIGN KEY ("MasseuseId") REFERENCES "Masseuses" ("Id") ON DELETE CASCADE
            );
            """);
        db.Database.ExecuteSqlRaw("""
            CREATE UNIQUE INDEX IF NOT EXISTS "IX_MasseuseTimeOff_MasseuseId_Date" ON "MasseuseTimeOff" ("MasseuseId", "Date");
            """);
    }

    private static void AddColumnIfMissing(LAmourDbContext db, string table, string column, string definition)
    {
        var connection = db.Database.GetDbConnection();
        var wasClosed = connection.State != System.Data.ConnectionState.Open;
        if (wasClosed) connection.Open();
        try
        {
            using var command = connection.CreateCommand();
            command.CommandText = $"SELECT COUNT(*) FROM pragma_table_info('{table}') WHERE name = '{column}';";
            var exists = Convert.ToInt32(command.ExecuteScalar()) > 0;
            if (exists) return;

            using var alter = connection.CreateCommand();
            alter.CommandText = $"ALTER TABLE \"{table}\" ADD COLUMN \"{column}\" {definition};";
            alter.ExecuteNonQuery();
        }
        finally
        {
            if (wasClosed) connection.Close();
        }
    }
}
