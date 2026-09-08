import React from 'react';
import { Phone, MessageCircle } from 'lucide-react';

export function ContactSection() {
  return (
    <section id="contact" className="py-16 md:py-20 lg:py-32 bg-secondary">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-[#808000] mb-6">Get in Touch</h2>
          <p className="text-base md:text-lg text-secondary-foreground mb-12">
            Have questions or need support? Feel free to reach out to us. We're here to help you on your health journey.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 md:gap-12">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-full">
                <Phone className="w-8 h-8 text-primary" />
              </div>
              <div className="text-left">
                <h3 className="text-lg md:text-xl font-semibold text-foreground">Contact Us</h3>
                <a 
                  href="tel:+918877799181" 
                  className="text-base md:text-lg text-muted-foreground hover:text-primary transition-colors font-medium"
                >
                  +91 88777 99181
                </a>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-500/10 rounded-full">
                <MessageCircle className="w-8 h-8 text-green-600" />
              </div>
              <div className="text-left">
                <h3 className="text-lg md:text-xl font-semibold text-foreground">WhatsApp</h3>
                <a 
                  href="https://wa.me/918986117301" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-base md:text-lg text-muted-foreground hover:text-primary transition-colors font-medium"
                >
                  +91 89861 17301
                </a>
              </div>
            </div>
          </div>
          <a
            href="tel:+918877799181"
            className="mt-12 inline-block bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-full px-8 py-4 text-lg transition-all shadow-md hover:shadow-lg"
          >
            Call Now
          </a>
        </div>
      </div>
    </section>
  );
}
