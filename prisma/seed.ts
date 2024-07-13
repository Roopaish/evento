import { faker } from "@faker-js/faker"
import { PrismaClient, type Prisma } from "@prisma/client"

import { eventTags } from "@/config/constants"

const prisma = new PrismaClient()

const shouldSeed = false
async function main() {
  if (!shouldSeed) return

  const users = await createUsers()

  if (users) {
    await createProperties(users)
  }
}

async function createUsers() {
  try {
    const emailsToCreateAccountFor: string[] = process.env.EMAILS
      ? (eval(process.env.EMAILS) as string[])
      : []

    if (emailsToCreateAccountFor.length === 0) {
      console.log(
        "Please add EMAILS to .env file to create users with the provided emails."
      )
      return
    }

    const existingUsers = await prisma.user.findMany({
      where: {
        email: {
          in: emailsToCreateAccountFor,
        },
      },
    })

    if (existingUsers.length > 0) {
      console.log("Users already exists with the provided emails.")
      return existingUsers
    }

    const data: Prisma.UserCreateManyAndReturnArgs["data"] =
      emailsToCreateAccountFor.map((email) => ({
        email,
        name: email.split("@")[0] ?? "User Name",
        address: faker.location.streetAddress(),
        emailVerified: new Date(),
        image: faker.image.avatar(),
        role: "USER",
      }))

    const users = await prisma.user.createManyAndReturn({
      data,
    })

    return users
  } catch (e) {
    console.log(e)
  }
}

async function createProperties(
  users: NonNullable<Awaited<ReturnType<typeof createUsers>>>
) {
  try {
    const data: Prisma.EventCreateArgs["data"][] = []

    const types = [
      "CONFERENCE",
      "SEMINAR",
      "WORKSHOP",
      "PARTY",
      "CONCERT",
      "OTHER",
    ]
    for (let i = 0; i < 30; i++) {
      const categoryKeys = Object.keys(eventTags)
      const randomCategory = categoryKeys[
        Math.floor(Math.random() * categoryKeys.length)
      ] as keyof typeof eventTags
      const tags = eventTags[randomCategory]

      const user = users[Math.floor(Math.random() * users.length)]

      const participants: { id: string }[] = []
      users?.forEach((u) => {
        if (u.id !== user?.id) {
          participants.push({
            id: u.id,
          })
        }
      })

      const selectedTags = tags
        .sort(() => 0.5 - Math.random())
        .slice(0, Math.floor(Math.random() * 3) + 3)

      const assets = []

      for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 4; j++) {
          assets.push({
            id: (i + j + Math.random() * 10000).toString(),
            name: faker.lorem.word(),
            url: faker.image.urlLoremFlickr({ category: "concert" }),
            thumbnailUrl: faker.image.url(),
            size: 22,
            createdAt: faker.date.past(),
            updatedAt: faker.date.recent(),
            userId: user!.id,
          })
        }
      }

      data.push({
        title: faker.company.catchPhrase(),
        type: types[Math.floor(Math.random() * types.length)] as "OTHER",
        category: randomCategory,
        date: faker.date.future(),
        address: faker.location.streetAddress(),
        lat: faker.location.latitude().toString(),
        lng: faker.location.longitude().toString(),
        capacity: faker.number.int({ min: 50, max: 500 }),
        description: faker.lorem.paragraphs(2),
        instruction: faker.lorem.sentence(),
        price: Number(faker.commerce.price({ min: 10, max: 200, dec: 2 })),
        managerName: faker.person.fullName(),
        managerPhone: faker.phone.number(),
        managerEmail: faker.internet.email(),
        managerImage: {
          create: {
            id: faker.string.uuid(),
            name: faker.lorem.word(),
            url: faker.image.avatar(),
            thumbnailUrl: faker.image.url(),
            size: 22,
            user: {
              connect: {
                id: user!.id,
              },
            },
          },
        },
        createdById: user!.id,
        tags: {
          connectOrCreate: selectedTags.map((tag) => ({
            where: {
              name: tag,
            },
            create: { name: tag },
          })),
        },
        assets: {
          createMany: {
            data: assets,
          },
        },
        jobPositions: {
          create: {
            title: faker.person.jobTitle(),
            description: faker.lorem.paragraph(),
            salary: Number(faker.commerce.price({ min: 1000, max: 10000 })),
            noOfEmployees: faker.number.int({ min: 1, max: 50 }),
          },
        },
        chatGroup: {
          create: {
            messages: {
              create: {
                userId: user!.id,
                message: "Chat Group Created!",
              },
            },
          },
        },
        participants: {
          connect: participants,
        },
      }),
        console.log(data)
    }

    await Promise.all(
      data.map(async (d) => {
        await prisma.event.create({
          data: d,
        })
      })
    )

    console.log("100 events created.")
  } catch (e) {
    console.error(e)
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
