import AccountLayout from "@/components/account/AccountLayout";
import { prisma } from "@/prisma/db";
import { getSession } from "@/utils/auth-utils";
import { redirect } from "next/navigation";

async function getOrdersData() {
  const session = await getSession();

  if (!session) {
    return { orders: [] };
  }

  try {
    const orders = await prisma.order.findMany({
      where: {
        userId: session.user.id
      },
      include: {
        items: {
          include: {
            product: {
              select: {
                name: true,
                images: true,
              }
            },
            variant: {
              select: {
                variantName: true,
                attributes: true,
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return { orders };
  } catch (error) {
    console.error('Failed to fetch orders:', error);
    return { orders: [] };
  }
}

export default async function AccountPage() {
  const session = await getSession();
  
  if (!session) {
    redirect("/login");
  }

  const { orders } = await getOrdersData();

  return <AccountLayout orders={orders} user={session.user} />;
}


