-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Timesheet" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "checkDate" DATETIME DEFAULT CURRENT_TIMESTAMP,
    "state" TEXT NOT NULL,
    "note" TEXT,
    "totalGross" REAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "paymentStartDate" DATETIME DEFAULT CURRENT_TIMESTAMP,
    "paymentEndDate" DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Timesheet_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Timesheet" ("checkDate", "date", "id", "note", "paymentEndDate", "paymentStartDate", "state", "totalGross", "userId") SELECT "checkDate", "date", "id", "note", "paymentEndDate", "paymentStartDate", "state", "totalGross", "userId" FROM "Timesheet";
DROP TABLE "Timesheet";
ALTER TABLE "new_Timesheet" RENAME TO "Timesheet";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
