"use server";

import { getSiteConfig } from "@/actions/admin/site-config.actions";

export async function getShippingConfig() {
  const configResult = await getSiteConfig();

  if (!configResult.success || !configResult.data) {
    // Return defaults if config fetch fails
    return {
      shippingCharge: 50,
      freeShippingMinOrder: 500,
    };
  }

  return {
    shippingCharge: configResult.data.shippingCharge,
    freeShippingMinOrder: configResult.data.freeShippingMinOrder,
  };
}
