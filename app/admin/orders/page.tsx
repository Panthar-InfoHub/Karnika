import { OrdersPage } from "@/components/dashboard/orders/orders-page";
import { prisma } from "@/prisma/db";
import { Suspense } from "react";
import PageSkeleton from "@/components/dashboard/PageSkeleton";
import ErrorCard from "@/components/ErrorCard";

interface OrdersSearchParams {
  search?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: string;
  limit?: string;
}

async function getOrdersData(
  search?: string, 
  status?: string, 
  sortBy?: string, 
  sortOrder?: 'asc' | 'desc',
  page?: string,
  limit?: string
) {
  try {
    const whereClause: any = {};
    const currentPage = parseInt(page || '1');
    const pageSize = parseInt(limit || '10');
    const skip = (currentPage - 1) * pageSize;

    // Add search filter
    if (search) {
      whereClause.OR = [
        {
          id: {
            contains: search,
            mode: 'insensitive'
          }
        },
        {
          user: {
            name: {
              contains: search,
              mode: 'insensitive'
            }
          }
        },
        {
          user: {
            email: {
              contains: search,
              mode: 'insensitive'
            }
          }
        }
      ];
    }

    // Add status filter
    if (status && status !== 'all') {
      whereClause.orderStatus = status;
    }

    // Define sorting options
    const sortField = sortBy || 'createdAt';
    const sortDirection = sortOrder || 'desc';
    
    let orderBy: any = {};
    
    // Handle nested sorting for user.name
    if (sortField === 'user.name') {
      orderBy = {
        user: {
          name: sortDirection
        }
      };
    } else {
      orderBy = {
        [sortField]: sortDirection
      };
    }

    // Get total count for pagination
    const totalCount = await prisma.order.count({
      where: whereClause
    });

    // Get paginated orders
    const orders = await prisma.order.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            name: true,
            email: true,
          }
        },
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
      orderBy,
      skip,
      take: pageSize
    });

    const totalPages = Math.ceil(totalCount / pageSize);

    return { 
      orders, 
      pagination: {
        currentPage,
        totalPages,
        totalCount,
        pageSize
      }
    };
  } catch (error) {
    console.error('Failed to fetch orders:', error);
    throw new Error('Failed to load orders');
  }
}

export default async function Orders({
  searchParams,
}: {
  searchParams: Promise<OrdersSearchParams>;
}) {
  const params = await searchParams;

  return (
    <Suspense fallback={<PageSkeleton />}>
      <OrdersContent 
        search={params.search} 
        status={params.status}
        sortBy={params.sortBy}
        sortOrder={params.sortOrder}
        page={params.page}
        limit={params.limit}
      />
    </Suspense>
  );
}

async function OrdersContent({
  search,
  status,
  sortBy,
  sortOrder,
  page,
  limit
}: {
  search?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: string;
  limit?: string;
}) {
  try {
    const { orders, pagination } = await getOrdersData(search, status, sortBy, sortOrder, page, limit);
    return <OrdersPage orders={orders} pagination={pagination} />;
  } catch (error) {
    return <ErrorCard error={error as Error} title="Orders" />;
  }
}
