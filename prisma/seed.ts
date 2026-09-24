import { PrismaClient, UnitType, UnitStatus } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Menyimpan data 1.500 unit ke Neon Tech PostgreSQL...");
  const unitsData = [];

  for (let floor = 1; floor <= 50; floor++) {
    const totalUnits = floor === 50 ? 10 : 30;

    for (let pos = 1; pos <= totalUnits; pos++) {
      const formattedPos = pos < 10 ? `0${pos}` : `${pos}`;
      const unitNumber = `${floor}${formattedPos}`;

      let type = UnitType.STUDIO;
      let baseRate = 350000;

      if (floor === 50) {
        type = UnitType.PENTHOUSE;
        baseRate = 2500000;
      } else if (pos % 5 === 0) {
        type = UnitType.TWO_BEDROOM;
        baseRate = 750000;
      } else if (pos % 3 === 0) {
        type = UnitType.ONE_BEDROOM;
        baseRate = 500000;
      }

      unitsData.push({
        unitNumber,
        floor,
        positionIndex: pos,
        type,
        status: UnitStatus.AVAILABLE,
        facing: pos <= 15 ? "North (City View)" : "South (Pool View)",
        baseDailyRate: baseRate + floor * 5000,
      });
    }
  }

  await prisma.unit.createMany({
    data: unitsData,
    skipDuplicates: true,
  });

  console.log("Seeding selesai! 1.500 unit berhasil disimpan di Cloud Neon Tech.");
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
