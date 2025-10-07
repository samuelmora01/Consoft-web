import { connectToDatabase } from '../config/db';
import { ensureCoreData } from '../config/bootstrap';
import { UserModel } from '../models/user.model';
import { RoleModel } from '../models/role.model';
import { hash } from 'bcrypt';

async function main() {
  await connectToDatabase();
  await ensureCoreData();

  const email = 'demo@consoft.com';
  const existing = await UserModel.findOne({ email });
  if (existing) {
    console.log('Seed: user already exists');
    process.exit(0);
  }

  const userRole = await RoleModel.findOne({ name: 'Usuario' });
  if (!userRole) throw new Error('Usuario role not found');

  const passwordHash = await hash('Demo1234!', 10);
  await UserModel.create({
    name: 'Usuario Demo',
    email,
    password: passwordHash,
    role: userRole._id,
  });
  console.log('Seed: created demo user demo@consoft.com / Demo1234!');
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
