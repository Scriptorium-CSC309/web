const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

async function main() {
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;
    const adminName = process.env.ADMIN_NAME;
    const adminPhoneNumber = process.env.ADMIN_PHONE_NUMBER;

    // Check if the environment variables are set
    if (!adminEmail || !adminPassword || !adminName || !adminPhoneNumber) {
        console.error("Error: ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_NAME, and ADMIN_PHONE_NUMEBER environment variables must be set.");
        process.exit(1);
    }

    // Check if the admin user already exists
    const existingAdmin = await prisma.user.findUnique({
        where: { email: adminEmail },
    });

    if (existingAdmin) {
        console.log(`Admin user with email ${adminEmail} already exists.`);
        return;
    }

    // Hash the admin password
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    // Create the admin user
    const adminUser = await prisma.user.create({
        data: {
            name: adminName,
            email: adminEmail,
            password: hashedPassword,
            isAdmin: true,
            avatarId: 1, // Ensure this avatarId exists or adjust as necessary
            phoneNumber: adminPhoneNumber, // Replace with a valid phone number if necessary
        },
    });

    console.log(`Admin user created successfully: ${adminUser.email}`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
