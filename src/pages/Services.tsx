
import { Layout, PageContainer } from "@/components/Layout";
import { ServicesSection } from "@/components/services/ServicesSection";
import { FAQ } from "@/components/services/FAQ";
import { VolumeSimulator } from "@/components/services/VolumeSimulator";
import { CallToAction } from "@/components/services/CallToAction";

const Services = () => {
  return (
    <Layout>
      <PageContainer>
        <div className="py-8">
          <h1 className="text-4xl font-bold mb-6 text-center">Nos Services</h1>
          <p className="text-xl text-center text-gray-600 mb-12 max-w-3xl mx-auto">
            Nous proposons une gamme complète de services de déménagement pour répondre à tous vos besoins
          </p>
          
          <ServicesSection />
          
          <VolumeSimulator />
          
          <FAQ />
          
          <CallToAction />
        </div>
      </PageContainer>
    </Layout>
  );
};

export default Services;
