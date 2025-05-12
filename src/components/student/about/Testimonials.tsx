import React from 'react';
import { Star } from 'lucide-react';

interface TestimonialProps {
  content: string;
  name: string;
  role: string;
  image: string;
  rating: number;
}

const Testimonial = ({ content, name, role, image, rating }: TestimonialProps) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 transition-all duration-300 hover:shadow-lg">
      <div className="flex items-center mb-3">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={16}
            className={`${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'} mr-1`}
          />
        ))}
      </div>
      <p className="text-gray-700 mb-4 italic">"{content}"</p>
      <div className="flex items-center">
        <img
          src={image}
          alt={name}
          className="w-12 h-12 rounded-full object-cover mr-4"
        />
        <div>
          <h4 className="font-semibold text-gray-900">{name}</h4>
          <p className="text-sm text-gray-600">{role}</p>
        </div>
      </div>
    </div>
  );
};

const Testimonials = () => {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">What Our Students Say</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover how Elevio has transformed the learning experience for students around the world.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Testimonial
            content="The premium features are worth every penny. Being able to have one-on-one video calls with my tutor has dramatically improved my understanding of calculus."
            name="Sarah Johnson"
            role="Computer Science Student"
            image="https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=600"
            rating={5}
          />
          <Testimonial
            content="I was struggling with my programming course until I started using Elevio. The direct chat feature with tutors has been a game-changer for getting unstuck quickly."
            name="David Chen"
            role="Software Engineering Student"
            image="https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=600"
            rating={5}
          />
          <Testimonial
            content="As a working professional, the unlimited course access has allowed me to develop new skills at my own pace. The platform is intuitive and the content is exceptional."
            name="Miguel Rodriguez"
            role="Marketing Professional"
            image="https://images.pexels.com/photos/874158/pexels-photo-874158.jpeg?auto=compress&cs=tinysrgb&w=600"
            rating={4}
          />
        </div>
      </div>
    </section>
  );
};

export default Testimonials;