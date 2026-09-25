import { ServiceDetail } from "@/components/services/ServiceDetail";
import { serviceRoute, type ServiceRouteProps } from "@/lib/service-route";

/** Catalog pages regenerate at most once a minute (and right after an admin edit). */
export const revalidate = 60;

const route = serviceRoute("adult");

export const generateStaticParams = route.generateStaticParams;
export const generateMetadata = route.generateMetadata;

export default async function ServicePage({ params }: ServiceRouteProps) {
  const { service, category, index, siblings } = await route.load((await params).slug);
  return <ServiceDetail service={service} category={category} index={index} siblings={siblings} />;
}
