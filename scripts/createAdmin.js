// /scripts/createAdmin.js

const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

async function main() {
    const adminEmail = "admin@example.com";
    const adminPassword = "Admin@123";
    const adminName = "Admin User";

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
            phoneNumber: "000-000-0000", // Replace with a valid phone number if necessary
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
