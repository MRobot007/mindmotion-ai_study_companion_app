import React, { useState } from 'react';
import { BookOpen, Zap, Target, Upload, Lightbulb, ArrowRight, Star, Check, Sparkles, Play, Coffee, Award } from 'lucide-react';
import Logo from './Logo';
import GeometricBackground from './GeometricBackground';

interface LandingPageProps {
  onGetStarted: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);

  const features = [
    {
      icon: <Upload className="h-8 w-8 text-amber-700" />,
      title: "Smart Question Scanner",
      description: "Upload or capture questions for instant AI explanations with advanced OCR technology",
      color: "from-amber-100 to-yellow-100",
      hoverColor: "from-amber-200 to-yellow-200"
    },
    {
      icon: <Target className="h-8 w-8 text-orange-700" />,
      title: "AI Quiz Generator",
      description: "Create personalized quizzes on any topic with adjustable difficulty levels",
      color: "from-orange-100 to-amber-100",
      hoverColor: "from-orange-200 to-amber-200"
    },
    {
      icon: <Lightbulb className="h-8 w-8 text-yellow-700" />,
      title: "Interactive Flashcards",
      description: "Transform your notes into smart flashcards with spaced repetition algorithms",
      color: "from-yellow-100 to-amber-100",
      hoverColor: "from-yellow-200 to-amber-200"
    },
    {
      icon: <BookOpen className="h-8 w-8 text-amber-800" />,
      title: "Notes Vault",
      description: "Organize and access all your study materials in one beautifully designed space",
      color: "from-amber-100 to-orange-100",
      hoverColor: "from-amber-200 to-orange-200"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Medical Student",
      content: "MindMotion transformed my study routine. The AI explanations are incredibly detailed and help me understand complex concepts effortlessly.",
      rating: 5,
      avatar: "SC",
      university: "Harvard Medical"
    },
    {
      name: "Marcus Rivera",
      role: "Engineering Student",
      content: "The quiz generator is phenomenal. I can practice problems anywhere and track my progress over time.",
      rating: 5,
      avatar: "MR",
      university: "MIT"
    },
    {
      name: "Luna Park",
      role: "High School Senior",
      content: "Finally, a study app that actually works. The flashcards feature helped me ace my SATs.",
      rating: 5,
      avatar: "LP",
      university: "Phillips Academy"
    }
  ];

  const stats = [
    { number: "50K+", label: "Students", icon: <Award className="h-6 w-6" /> },
    { number: "1M+", label: "Questions Solved", icon: <Logo size="sm" animated={false} /> },
    { number: "98%", label: "Success Rate", icon: <Star className="h-6 w-6" /> },
    { number: "24/7", label: "AI Support", icon: <Coffee className="h-6 w-6" /> }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-beige-50 to-amber-50 relative">
      {/* 3D Geometric Background */}
      <GeometricBackground variant="landing" />

      {/* Navigation */}
      <nav className="relative z-10 px-4 py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3 interactive-element">
            <Logo size="lg" animated={true} />
            <span className="text-2xl font-bold text-gradient">
              MindMotion
            </span>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-amber-700 hover:text-amber-800 transition-colors font-medium interactive-element">
              Features
            </a>
            <a href="#testimonials" className="text-amber-700 hover:text-amber-800 transition-colors font-medium interactive-element">
              Reviews
            </a>
            <a href="#stats" className="text-amber-700 hover:text-amber-800 transition-colors font-medium interactive-element">
              Stats
            </a>
            <button
              onClick={onGetStarted}
              className="btn-primary hover-bounce"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative px-4 py-20 z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 animate-fade-in-up">
              <div className="space-y-6">
                <div className="inline-flex items-center space-x-2 glass px-4 py-2 rounded-full border border-amber-200 interactive-element hover-lift">
                  <Sparkles className="w-5 h-5 text-amber-600" />
                  <span className="text-amber-800 font-medium">AI-Powered Learning in Motion</span>
                </div>
                
                <h1 className="text-5xl lg:text-6xl font-bold leading-tight text-amber-900">
                  Set Your{' '}
                  <span className="text-gradient animate-shimmer">
                    Mind in Motion
                  </span>
                  <br />
                  <span className="text-amber-700 text-4xl lg:text-5xl">with AI Learning</span>
                </h1>
                <p className="text-xl text-amber-700 leading-relaxed">
                  Experience learning that moves with you. Our intelligent study companion 
                  adapts to your pace, creates dynamic content, and keeps your mind 
                  engaged with personalized AI-powered tools.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={onGetStarted}
                  className="group btn-primary text-lg px-8 py-4 hover-bounce"
                >
                  <span>Start Your Journey</span>
                  <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </button>
                <button className="btn-secondary text-lg px-8 py-4 hover-lift">
                  <Play className="h-5 w-5 mr-2" />
                  Watch Demo
                </button>
              </div>

              <div className="flex items-center space-x-6 text-sm text-amber-600">
                <div className="flex items-center space-x-1 interactive-element">
                  <Check className="h-4 w-4 text-green-600" />
                  <span>Free to start</span>
                </div>
                <div className="flex items-center space-x-1 interactive-element">
                  <Check className="h-4 w-4 text-green-600" />
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center space-x-1 interactive-element">
                  <Check className="h-4 w-4 text-green-600" />
                  <span>AI-powered</span>
                </div>
              </div>
            </div>

            <div className="relative animate-float">
              <div className="relative z-10 glass rounded-3xl p-8 border border-amber-200 shadow-2xl hover-glow">
                <div className="space-y-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl flex items-center justify-center animate-pulse-glow">
                      <Zap className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-amber-900">AI Analysis Complete</h3>
                      <p className="text-sm text-amber-600">Question processed in 0.8s</p>
                    </div>
                  </div>
                  
                  <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
                    <p className="text-sm text-amber-700 mb-2 font-medium">Question:</p>
                    <p className="text-amber-900">"What is Newton's Second Law of Motion?"</p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-xl p-4 border border-yellow-200">
                    <p className="text-sm text-amber-700 mb-2 font-medium">AI Explanation:</p>
                    <p className="text-amber-900 text-sm leading-relaxed">
                      Newton's Second Law states that Force = Mass × Acceleration (F = ma). 
                      This fundamental principle explains how forces cause changes in motion...
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="stats" className="px-4 py-16 glass border-y border-amber-200 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="text-center space-y-2 interactive-element hover-bounce"
              >
                <div className="flex justify-center text-amber-600 mb-2">
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold text-amber-900">{stat.number}</div>
                <div className="text-amber-700 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="px-4 py-20 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-amber-900 mb-4">
              Everything You Need to{' '}
              <span className="text-gradient">
                Excel
              </span>
            </h2>
            <p className="text-xl text-amber-700 max-w-3xl mx-auto">
              Powerful AI tools designed to keep your mind in motion with effective, engaging, and personalized learning experiences.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`card-interactive p-8 text-center group bg-gradient-to-br ${
                  hoveredFeature === index ? feature.hoverColor : feature.color
                } border-2 border-amber-200`}
                onMouseEnter={() => setHoveredFeature(index)}
                onMouseLeave={() => setHoveredFeature(null)}
              >
                <div className="mb-6 transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                  <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto shadow-lg">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-amber-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-amber-700 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="px-4 py-20 bg-gradient-to-r from-amber-100 to-yellow-100 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-amber-900 mb-4">
              Loved by{' '}
              <span className="text-gradient">
                Students
              </span>{' '}
              Everywhere
            </h2>
            <p className="text-xl text-amber-700">
              Join thousands of students who are already setting their minds in motion
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="card-interactive p-8 bg-white hover-tilt"
              >
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-500 fill-current" />
                  ))}
                </div>
                <p className="text-amber-800 mb-6 leading-relaxed italic">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center text-white font-semibold">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-amber-900">{testimonial.name}</p>
                    <p className="text-sm text-amber-600">{testimonial.role}</p>
                    <p className="text-xs text-amber-500">{testimonial.university}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-20 bg-gradient-to-r from-amber-600 to-orange-600 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Set Your Mind in Motion?
          </h2>
          <p className="text-xl text-amber-100 mb-8">
            Join thousands of students who are already learning smarter with AI-powered tools that adapt and evolve.
          </p>
          <button
            onClick={onGetStarted}
            className="bg-white text-amber-700 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-amber-50 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl btn-interactive hover-bounce"
          >
            Start Your Journey Today
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-amber-900 text-amber-100 px-4 py-12 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0 interactive-element">
              <Logo size="md" animated={true} />
              <span className="text-2xl font-bold">MindMotion</span>
            </div>
            <div className="flex space-x-8 text-amber-300">
              <a href="#" className="hover:text-amber-100 transition-colors interactive-element">Privacy</a>
              <a href="#" className="hover:text-amber-100 transition-colors interactive-element">Terms</a>
              <a href="#" className="hover:text-amber-100 transition-colors interactive-element">Contact</a>
            </div>
          </div>
          <div className="border-t border-amber-800 mt-8 pt-8 text-center text-amber-400">
            <p>&copy; 2025 MindMotion. All rights reserved. Powered by AI.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;