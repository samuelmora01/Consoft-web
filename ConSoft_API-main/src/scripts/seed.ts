import { connectToDatabase } from '../config/db';
import { ensureCoreData } from '../config/bootstrap';
import { UserModel } from '../models/user.model';
import { RoleModel } from '../models/role.model';
import { CategoryModel } from '../models/category.model';
import { ServiceModel } from '../models/service.model';
import { ProductModel } from '../models/product.model';
import { PermissionModel } from '../models/permission.model';
import { VisitModel } from '../models/visit.model';
import { OrderModel } from '../models/order.model';
import { hash } from 'bcrypt';

async function main() {
  await connectToDatabase();
  await ensureCoreData();

  // Users
  const email = 'demo@consoft.com';
  let demoUser = await UserModel.findOne({ email });
  if (!demoUser) {
    const userRole = await RoleModel.findOne({ name: 'Usuario' });
    if (!userRole) throw new Error('Usuario role not found');
    const passwordHash = await hash('Demo1234!', 10);
    demoUser = await UserModel.create({
      name: 'Usuario Demo',
      email,
      password: passwordHash,
      role: userRole._id,
    });
    console.log('Seed: created demo user demo@consoft.com / Demo1234!');
  } else {
    console.log('Seed: demo user already exists');
  }

  // Categories
  const categoriesData = [
    { name: 'Sillas', description: 'Sillas para comedor y oficina' },
    { name: 'Mesas', description: 'Mesas de centro y comedor' },
    { name: 'Tapizados', description: 'Servicios de tapizado y restauración' },
  ];
  const categories = [] as { _id: any; name: string }[];
  for (const c of categoriesData) {
    let cat = await CategoryModel.findOne({ name: c.name });
    if (!cat) cat = await CategoryModel.create(c);
    categories.push(cat as any);
  }

  // Services
  const servicesData = [
    { name: 'Tapizado de Sillas', description: 'Renueva tus sillas con tapizado profesional', imageUrl: '/servicios/tapizado.jpg' },
    { name: 'Lacado de Muebles', description: 'Acabado lacado de alta calidad', imageUrl: '/servicios/lacado.jpg' },
    { name: 'Reparación de Muebles', description: 'Arreglo y refuerzo de estructuras', imageUrl: '/servicios/reparacion.jpg' },
  ];
  const services = [] as { _id: any; name: string }[];
  for (const s of servicesData) {
    let svc = await ServiceModel.findOne({ name: s.name });
    if (!svc) svc = await ServiceModel.create(s);
    services.push(svc as any);
  }

  // Products (link to categories)
  const productsData = [
    { name: 'Silla Comedor Clásica', description: 'Silla de madera con cojín', category: categories.find(c => c.name === 'Sillas')?._id, status: true, imageUrl: '/productos/silla-comedor.jpg' },
    { name: 'Mesa de Centro Moderna', description: 'Mesa con vidrio templado', category: categories.find(c => c.name === 'Mesas')?._id, status: true, imageUrl: '/productos/mesa-centro.jpg' },
  ].filter(p => p.category);
  for (const p of productsData) {
    const exists = await ProductModel.findOne({ name: p.name });
    if (!exists) await ProductModel.create(p as any);
  }

  // Permissions
  const permissionsData = [
    { module: 'users', action: 'read' },
    { module: 'users', action: 'write' },
    { module: 'orders', action: 'read' },
    { module: 'orders', action: 'write' },
    { module: 'services', action: 'read' },
    { module: 'services', action: 'write' },
  ];
  for (const perm of permissionsData) {
    const exists = await PermissionModel.findOne(perm);
    if (!exists) await PermissionModel.create(perm);
  }

  // Sample Visit for demo user
  const visitExists = await VisitModel.findOne({ user: demoUser._id });
  if (!visitExists) {
    await VisitModel.create({
      user: demoUser._id,
      visitDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
      address: 'Calle 123 #45-67, Ciudad',
      status: 'pendiente',
      services: services.slice(0, 2).map(s => s._id),
    });
  }

  // Sample Order for demo user
  const orderExists = await OrderModel.findOne({ user: demoUser._id });
  if (!orderExists) {
    await OrderModel.create({
      user: demoUser._id,
      type: 'en_proceso',
      status: 'pendiente',
      address: 'Calle 123 #45-67, Ciudad',
      startedAt: new Date(),
      items: [
        {
          id_servicio: services[0]?._id,
          detalles: 'Tapizado de 4 sillas en tela gris',
          valor: 300000,
        },
      ],
      payments: [
        { amount: 150000, paidAt: new Date(), method: 'transferencia', status: 'confirmado' },
      ],
      attachments: [],
    });
  }

  console.log('Seed: data ensured (users, categories, services, products, permissions, visit, order)');
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
