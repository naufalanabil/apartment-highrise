import {
  Prisma,
  PrismaClient,
  UnitStatus,
  UnitType,
} from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const unitsData: Prisma.UnitCreateManyInput[] = [];

  for (let floor = 1; floor <= 50; floor++) {
    const totalUnits = 30;

    for (let pos = 1; pos <= totalUnits; pos++) {
      const formattedPos = String(pos).padStart(2, "0");
      const unitNumber = `${floor}${formattedPos}`;

      let type: UnitType = UnitType.STUDIO;
      let baseRate = 350_000;

      if (floor === 50) {
        type = UnitType.PENTHOUSE;
        baseRate = 2_500_000;
      } else if (pos % 5 === 0) {
        type = UnitType.TWO_BEDROOM;
        baseRate = 750_000;
      } else if (pos % 3 === 0) {
        type = UnitType.ONE_BEDROOM;
        baseRate = 500_000;
      }

      unitsData.push({
        unitNumber,
        floor,
        positionIndex: pos,
        type,
        status: UnitStatus.AVAILABLE,
        facing: pos <= 15 ? "North (City View)" : "South (Pool View)",
        baseDailyRate: baseRate + floor * 5_000,
      });
    }
  }

  const result = await prisma.unit.createMany({
    data: unitsData,
    skipDuplicates: true,
  });

  console.log(
    `Seeding selesai: ${result.count} unit baru ditambahkan dari ${unitsData.length} unit.`,
  );
}

main()
  .catch((error: unknown) => {
    console.error("Seeding gagal:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });