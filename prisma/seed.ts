import { PrismaClient } from "@prisma/client"
import { v4 as uuidv4 } from "uuid"

const prisma = new PrismaClient()

async function main() {
  const existingUser = await prisma.user.findFirst({
    where: {
      email: "hi@roopaish.com",
    },
  })

  if (existingUser?.id) return

  const user = await prisma.user.create({
    data: {
      email: "hi@roopaish.com",
      name: "Roopaish",
      role: "ADMIN",
      phoneNumber: ["123-456-7890"],
      accounts: {
        create: {
          type: "oauth",
          provider: "email",
          providerAccountId: "google-account-id",
          refresh_token: "refresh-token",
          access_token: "access-token",
          token_type: "Bearer",
        },
      },
    },
  })

  for (let i = 1; i <= 10; i++) {
    await prisma.event.create({
      data: {
        title: `Event ${i}`,
        type: "CONFERENCE",
        date: new Date(Date.now() + i * 24 * 60 * 60 * 1000),
        address: `Address ${i}`,
        capacity: 100 + i,
        description: `Description for event ${i}`,
        instruction: `Instruction for event ${i}`,
        price: 50.0 * i,
        createdBy: {
          connect: {
            id: user.id,
          },
        },
        chatGroup: {
          create: {
            messages: {
              create: {
                message: `Welcome message for event ${i}`,
                userId: user.id,
              },
            },
          },
        },
        jobPositions: {
          create: {
            title: `Job Position ${i}`,
            description: `Description for job position ${i}`,
            noOfEmployees: 2 + i,
            salary: 30000 + i * 1000,
          },
        },
        invitations: {
          create: {
            email: `rupesh39943@gmail.com`,
            uniqueToken: uuidv4() as unknown as string,
            status: "PENDING",
            senderId: user.id,
          },
        },
        tasks: {
          create: {
            title: `Task ${i}`,
            description: `Description for task ${i}`,
            status: "PENDING",
            dueDate: new Date(Date.now() + (i + 1) * 24 * 60 * 60 * 1000),
            createdById: user.id,
          },
        },
      },
    })
  }
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
