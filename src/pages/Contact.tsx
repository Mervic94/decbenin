
import { Layout, PageContainer } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import Map from "@/components/Map";

const CONTACT_PHONE = "+229 01 663 555 09";
const CONTACT_MAIL = "demenagementexpresscotonou@gmail.com";

const Contact = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !message) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      toast({
        title: "Message envoyé",
        description: "Nous vous répondrons dans les plus brefs délais",
      });

      // Reset form
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <Layout>
      <PageContainer>
        <div className="max-w-5xl mx-auto py-12">
          <h1 className="text-4xl font-bold mb-6 text-center">Contactez-nous</h1>
          <p className="text-xl text-center text-muted-foreground mb-12">
            Notre équipe est à votre disposition pour répondre à toutes vos questions
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white p-6 rounded-lg border border-border shadow-sm text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-bold mb-2">Téléphone</h3>
              <p className="text-muted-foreground mb-2">Appelez-nous pour un service rapide</p>
              <a href={`tel:${CONTACT_PHONE.replace(/\s+/g, '')}`} className="text-primary font-medium">
                {CONTACT_PHONE}
              </a>
            </div>

            <div className="bg-white p-6 rounded-lg border border-border shadow-sm text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-bold mb-2">Email</h3>
              <p className="text-muted-foreground mb-2">Écrivez-nous pour toute question</p>
              <a href={`mailto:${CONTACT_MAIL}`} className="text-primary font-medium">
                {CONTACT_MAIL}
              </a>
            </div>

            <div className="bg-white p-6 rounded-lg border border-border shadow-sm text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-bold mb-2">Adresse</h3>
              <p className="text-muted-foreground mb-2">Venez nous rencontrer</p>
              <p className="font-medium">
                123 Rue Principale, Cotonou, Bénin
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg border border-border shadow-sm">
              <h2 className="text-2xl font-bold mb-6">Envoyez-nous un message</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nom complet *</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Jean Dupont"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="exemple@email.com"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="subject">Sujet</Label>
                  <Input
                    id="subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Demande d'information"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="message">Message *</Label>
                  <Textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Votre message ici..."
                    className="min-h-[150px]"
                    required
                  />
                </div>
                
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? (
                    "Envoi en cours..."
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" /> Envoyer le message
                    </>
                  )}
                </Button>
              </form>
            </div>
            
            <div className="bg-white p-6 rounded-lg border border-border shadow-sm">
              <h2 className="text-2xl font-bold mb-6">Notre localisation</h2>
              <Map
                latitude={6.3702928} 
                longitude={2.3912362}
                height="400px"
              />
            </div>
          </div>

          <div className="mt-12 bg-muted rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Besoin d'un devis rapide?</h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Si vous préférez, vous pouvez demander un devis en ligne et nous vous contacterons dans les plus brefs délais.
            </p>
            <Button size="lg" onClick={() => window.location.href = "/quote"} className="bg-orange-500 text-white hover:bg-gray-200 hover:text-gray-800">
              Demander un devis
            </Button>
          </div>
        </div>
      </PageContainer>
    </Layout>
  );
};

export default Contact;
