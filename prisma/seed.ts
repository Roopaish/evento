import { faker } from "@faker-js/faker"
import { PrismaClient, type Prisma } from "@prisma/client"

import { eventTags } from "@/config/constants"

const prisma = new PrismaClient()

async function main() {
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
        name: email.split("@")[0],
        address: faker.location.streetAddress(),
        bio: faker.lorem.paragraph(),
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

    for (let i = 0; i < 100; i++) {
      const categoryKeys = Object.keys(eventTags)
      const randomCategory = categoryKeys[
        Math.floor(Math.random() * categoryKeys.length)
      ] as keyof typeof eventTags
      const tags = eventTags[randomCategory]

      const user = users[Math.floor(Math.random() * users.length)]

      const selectedTags = tags
        .sort(() => 0.5 - Math.random())
        .slice(0, Math.floor(Math.random() * 3) + 3)

      data.push({
        title: faker.company.catchPhrase(),
        type: "OTHER",
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
            id: faker.number.int().toString(),
            name: faker.lorem.word(),
            url: faker.image.avatar(),
            thumbnailUrl: faker.image.url(),
            size: 22,
            createdAt: faker.date.past(),
            updatedAt: faker.date.recent(),
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
          create: {
            id: faker.number.int().toString(),
            name: faker.lorem.slug(),
            url: faker.image.urlLoremFlickr({ category: randomCategory }),
            thumbnailUrl: faker.image.url(),
            size: 22,
            createdAt: faker.date.past(),
            updatedAt: faker.date.recent(),
            user: {
              connect: {
                id: user!.id,
              },
            },
          },
        },

        jobPositions: {
          create: {
            title: faker.person.jobTitle(),
            description: faker.lorem.paragraph(),
            salary: Number(faker.commerce.price()),
            noOfEmployees: faker.number.int(),
          },
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
