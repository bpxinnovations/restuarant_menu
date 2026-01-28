import { restaurants } from "../../data/restaurants";
import { notFound } from "next/navigation";
import RestaurantMenuClient from "./RestaurantMenuClient";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function RestaurantMenu({ params }: PageProps) {
  const { id } = await params;
  const restaurant = restaurants.find((r) => r.id === id);

  if (!restaurant) {
    notFound();
  }

  return <RestaurantMenuClient restaurant={restaurant} />;
}
