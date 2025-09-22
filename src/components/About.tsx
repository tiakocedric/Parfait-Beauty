import React from 'react';
import { Heart, Award, Truck, Shield } from 'lucide-react';

const About: React.FC = () => {
  const features = [
    {
      icon: Heart,
      title: 'Produits Premium',
      description: 'Sélection rigoureuse de cosmétiques et soins de haute qualité pour révéler votre beauté naturelle.'
    },
    {
      icon: Award,
      title: 'Expertise Beauté',
      description: 'Plus de 5 ans d\'expérience dans le conseil beauté et la sélection des meilleurs produits.'
    },
    {
      icon: Truck,
      title: 'Livraison Rapide',
      description: 'Livraison en 24-48h partout au Cameroun. Service client réactif et professionnel.'
    },
    {
      icon: Shield,
      title: 'Qualité Garantie',
      description: 'Tous nos produits sont authentiques et bénéficient de notre garantie satisfaction.'
    }
  ];

  return (
    <section id="about" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Pourquoi choisir{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-amber-500">
              Parfait Beauty ?
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Nous nous engageons à vous offrir les meilleurs produits de beauté avec un service d'exception
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="text-center group hover:transform hover:scale-105 transition-all duration-300"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-pink-100 to-amber-100 rounded-full mb-4 group-hover:from-pink-200 group-hover:to-amber-200 transition-all duration-300">
                <feature.icon className="h-8 w-8 text-pink-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Story Section */}
        <div className="bg-gradient-to-r from-pink-50 to-amber-50 rounded-2xl p-8 lg:p-12">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-6">
              Notre Histoire
            </h3>
            <div className="space-y-4 text-gray-600 text-lg leading-relaxed">
              <p>
                <strong>Parfait Shop and Beauty</strong> est né de la passion pour la beauté authentique et le bien-être. 
                Depuis 2019, nous accompagnons les femmes camerounaises dans leur quête de produits de beauté d'exception.
              </p>
              <p>
                Notre mission est simple : démocratiser l'accès aux cosmétiques premium tout en préservant 
                la beauté naturelle africaine. Chaque produit de notre catalogue est soigneusement sélectionné 
                pour sa qualité, son efficacité et sa compatibilité avec tous les types de peau.
              </p>
              <p>
                Avec plus de 500 clientes satisfaites et un engagement constant vers l'excellence, 
                nous continuons d'innover pour vous offrir la meilleure expérience beauté possible.
              </p>
            </div>
            
            <div className="mt-8">
              <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full border border-pink-200">
                <Heart className="h-5 w-5 text-pink-500 fill-current" />
                <span className="font-semibold text-gray-700">Votre beauté, notre passion</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;