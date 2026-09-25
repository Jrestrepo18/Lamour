import { ServiceDetail } from "@/components/services/ServiceDetail";
import { serviceRoute, type ServiceRouteProps } from "@/lib/service-route";

const route = serviceRoute("adult");

export const generateStaticParams = route.generateStaticParams;
export const generateMetadata = route.generateMetadata;

export default async function ServicePage({ params }: ServiceRouteProps) {
  const { service, category, index, siblings } = await route.load((await params).slug);
  return <ServiceDetail service={service} category={category} index={index} siblings={siblings} />;
}
