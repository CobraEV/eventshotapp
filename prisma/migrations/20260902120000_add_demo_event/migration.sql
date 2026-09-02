-- Demo-Event pro Kunde: voller Funktionsumfang mit harter Upload-Grenze.
ALTER TABLE "Event" ADD COLUMN "isDemo" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Event" ADD COLUMN "uploadLimit" INTEGER;
