import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/layout/Header';
import '../styles/homepage-animations.css';

const HomePage = () => {
  const [openFaq, setOpenFaq] = React.useState(null);
  const [email, setEmail] = React.useState('');
  const [showBackToTop, setShowBackToTop] = React.useState(false);
  const [showDemoModal, setShowDemoModal] = React.useState(false);
  
  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    // Handle newsletter signup
    console.log('Newsletter signup:', email);
    setEmail('');
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleWatchDemo = () => {
    setShowDemoModal(true);
  };

  const closeDemoModal = () => {
    setShowDemoModal(false);
  };

  React.useEffect(() => {
    // Load Storylane script
    if (!document.querySelector('script[src="https://js.storylane.io/js/v2/storylane.js"]')) {
      const script = document.createElement('script');
      script.src = 'https://js.storylane.io/js/v2/storylane.js';
      script.async = true;
      document.head.appendChild(script);
    }
  }, []);

  React.useEffect(() => {
    // Handle escape key to close modal
    const handleEscape = (e) => {
      if (e.key === 'Escape' && showDemoModal) {
        setShowDemoModal(false);
      }
    };

    if (showDemoModal) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [showDemoModal]);

  React.useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 500);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <Header />
      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-white">
          {/* Animated Wave Background */}
          <div className="absolute inset-0 opacity-5">
            <svg className="w-full h-full" viewBox="0 0 1200 800" preserveAspectRatio="none">
              <defs>
                <linearGradient id="wave-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#000000" />
                  <stop offset="50%" stopColor="#374151" />
                  <stop offset="100%" stopColor="#000000" />
                </linearGradient>
              </defs>
              <path
                fill="url(#wave-gradient)"
                d="M0,300 C300,200 600,400 1200,300 L1200,800 L0,800 Z"
                className="animate-wave"
              />
              <path
                fill="url(#wave-gradient)"
                d="M0,400 C400,300 800,500 1200,400 L1200,800 L0,800 Z"
                className="animate-wave-delayed"
                opacity="0.7"
              />
            </svg>
          </div>

          <div className="relative max-w-6xl mx-auto px-6 pt-20 pb-16">
            <div className="text-center">
              {/* Badge with pulse animation */}
              <div className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-base font-medium mb-8 animate-fade-in">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                AI-Powered Climate Intelligence
              </div>
              
              {/* Main Heading with typewriter effect */}
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight animate-slide-up">
                Monitor Earth's
                <br />
                <span className="text-black relative">
                  Climate Future
                  <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-black animate-typing-underline"></span>
                </span>
              </h1>
              
              {/* Subheading with delayed animation */}
              <p className="text-xl md:text-2xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed animate-slide-up-delayed">
                Real-time climate monitoring and AI-powered predictions to help you stay ahead of environmental changes.
              </p>

              {/* CTA Buttons with hover effects */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center mb-16 animate-fade-in-up">
                <Link 
                  to="/register"
                  className="group px-8 py-3 bg-black text-white text-base font-medium rounded-md hover:bg-gray-800 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                >
                  <span className="flex items-center justify-center">
                    Get Started Free
                    <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                </Link>
                <Link 
                  to="/login"
                  className="group px-8 py-3 text-gray-700 text-base font-medium hover:bg-gray-100 rounded-md transition-all duration-300 transform hover:scale-105"
                >
                  Sign In
                </Link>
              </div>

              {/* Video Demo Button */}
              <div className="flex justify-center mb-8 animate-fade-in-up">
                <button 
                  onClick={handleWatchDemo}
                  className="group flex items-center space-x-2 px-5 py-3 bg-white border border-gray-200 rounded-full text-base text-gray-600 hover:text-gray-900 hover:shadow-lg transition-all duration-300 cursor-pointer"
                >
                  <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    <svg className="w-4 h-4 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </div>
                  <span>Watch Demo</span>
                  <span className="text-sm text-gray-400">(2 min)</span>
                </button>
              </div>

              {/* Hero Visual - Animated Dashboard Preview */}
              <div className="max-w-4xl mx-auto animate-float">
                <div className="bg-gray-50 rounded-lg p-8 border border-gray-200 hover:shadow-lg transition-shadow duration-500">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      { title: 'Global Temp', value: '+1.2°C', color: 'red', trend: '+0.1°C' },
                      { title: 'Sea Level', value: '+3.4mm', color: 'blue', trend: '+0.2mm' },
                      { title: 'CO₂ Level', value: '421 ppm', color: 'orange', trend: '+2 ppm' }
                    ].map((metric, index) => (
                      <div key={index} className="group bg-white rounded-md p-4 border border-gray-200 hover:border-gray-300 transition-all duration-300 cursor-pointer animate-card-hover" style={{animationDelay: `${index * 200}ms`}}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-base text-gray-600 group-hover:text-gray-800 transition-colors">{metric.title}</span>
                          <div className={`w-2 h-2 rounded-full ${
                            metric.color === 'red' ? 'bg-red-500 animate-pulse' : 
                            metric.color === 'blue' ? 'bg-blue-500 animate-pulse' : 'bg-orange-500 animate-pulse'
                          }`}></div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-2xl font-semibold text-gray-900 group-hover:scale-105 transition-transform">{metric.value}</span>
                          <span className="text-sm text-gray-500 animate-fade-in-out">{metric.trend}</span>
                        </div>
                        <div className="mt-2 h-1 bg-gray-200 rounded-full overflow-hidden">
                          <div className={`h-full ${
                            metric.color === 'red' ? 'bg-red-500' : 
                            metric.color === 'blue' ? 'bg-blue-500' : 'bg-orange-500'
                          } animate-progress`} style={{width: `${60 + index * 15}%`}}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Scroll Indicator */}
              <div className="flex justify-center mt-16 animate-fade-in-up">
                <div className="flex flex-col items-center space-y-2">
                  <span className="text-xs text-gray-400">Scroll to explore</span>
                  <div className="w-6 h-10 border border-gray-300 rounded-full flex justify-center">
                    <div className="w-1 h-3 bg-gray-400 rounded-full mt-2 animate-bounce"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-gray-50 relative overflow-hidden">
          {/* Subtle background pattern */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute inset-0" style={{
              backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(0,0,0,0.15) 1px, transparent 0)',
              backgroundSize: '20px 20px'
            }}></div>
          </div>
          
          <div className="relative max-w-6xl mx-auto px-6">
            <div className="text-center mb-12 animate-fade-in">
              <h2 className="text-3xl font-semibold text-gray-900 mb-4">Everything you need</h2>
              <p className="text-lg text-gray-600">Advanced climate monitoring made simple</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  title: 'Real-time Monitoring',
                  description: 'Track climate data from 190+ countries with instant updates and alerts.',
                  number: '01'
                },
                {
                  title: 'AI Predictions',
                  description: 'Get early warnings about climate events using machine learning.',
                  number: '02'
                },
                {
                  title: 'Global Community',
                  description: 'Connect with researchers and advocates worldwide.',
                  number: '03'
                }
              ].map((feature, index) => (
                <div key={index} className="group bg-white rounded-lg p-6 border border-gray-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 animate-slide-up" style={{animationDelay: `${index * 150}ms`}}>
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <span className="text-2xl font-bold text-gray-300 group-hover:text-gray-900 transition-colors duration-300">
                        {feature.number}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-black transition-colors">{feature.title}</h3>
                      <p className="text-gray-600 text-base leading-relaxed group-hover:text-gray-700 transition-colors">{feature.description}</p>
                    </div>
                  </div>
                  <div className="mt-6 w-0 h-0.5 bg-black group-hover:w-full transition-all duration-500"></div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-white relative">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {[
                { number: '100K+', label: 'Active Users' },
                { number: '5M+', label: 'Notifications' },
                { number: '190+', label: 'Countries' },
                { number: '99.9%', label: 'Uptime' }
              ].map((stat, index) => (
                <div key={index} className="group animate-counter" style={{animationDelay: `${index * 100}ms`}}>
                  <div className="text-4xl font-bold text-gray-900 mb-2 group-hover:scale-110 transition-transform duration-300">{stat.number}</div>
                  <div className="text-base text-gray-600 group-hover:text-gray-800 transition-colors">{stat.label}</div>
                  <div className="mt-3 w-8 h-0.5 bg-gray-200 mx-auto group-hover:bg-black transition-colors duration-300"></div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-6">
            <div className="text-center mb-12 animate-fade-in">
              <h2 className="text-3xl font-semibold text-gray-900 mb-4">Frequently Asked Questions</h2>
              <p className="text-lg text-gray-600">Everything you need to know about ClimateNotify</p>
            </div>

            <div className="space-y-4">
              {[
                {
                  question: 'How accurate are the climate predictions?',
                  answer: 'Our AI models achieve 95% accuracy by analyzing data from over 10,000 weather stations, satellite imagery, and oceanographic sensors worldwide. We continuously refine our algorithms using machine learning.'
                },
                {
                  question: 'What types of climate alerts do you provide?',
                  answer: 'We provide alerts for extreme weather events, temperature anomalies, air quality changes, sea level variations, and long-term climate trends. Alerts are customizable based on your location and interests.'
                },
                {
                  question: 'Is ClimateNotify free to use?',
                  answer: 'Yes! Our basic service is completely free and includes real-time alerts, basic analytics, and community features. Premium plans offer advanced analytics, API access, and priority support.'
                },
                {
                  question: 'How do you ensure data privacy?',
                  answer: 'We use industry-standard encryption and never sell personal data. Your location data is anonymized and only used to provide relevant climate information. You can delete your account and data at any time.'
                },
                {
                  question: 'Can I integrate ClimateNotify with other applications?',
                  answer: 'Yes! We offer REST APIs and webhooks for developers. You can integrate our climate data into your applications, research projects, or business systems.'
                }
              ].map((faq, index) => (
                <div key={index} className="border border-gray-200 rounded-lg animate-slide-up" style={{animationDelay: `${index * 100}ms`}}>
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors duration-200 rounded-lg"
                  >
                    <span className="font-medium text-gray-900 pr-4 text-base">{faq.question}</span>
                    <svg
                      className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
                        openFaq === index ? 'transform rotate-180' : ''
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {openFaq === index && (
                    <div className="px-6 pb-4 animate-fade-in">
                      <div className="text-gray-600 text-base leading-relaxed border-t border-gray-100 pt-4">
                        {faq.answer}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <div className="animate-fade-in">
              <h2 className="text-3xl font-semibold text-gray-900 mb-4">Stay Updated</h2>
              <p className="text-lg text-gray-600 mb-8">Get weekly climate insights and important alerts delivered to your inbox</p>
              
              <form onSubmit={handleEmailSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-base"
                  required
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-black text-white text-base font-medium rounded-md hover:bg-gray-800 transition-colors duration-200 whitespace-nowrap"
                >
                  Subscribe
                </button>
              </form>
              
              <p className="text-sm text-gray-500 mt-3">
                No spam, unsubscribe at any time. Read our{' '}
                <a href="#" className="underline hover:text-gray-700 transition-colors">privacy policy</a>.
              </p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-gray-200 bg-white py-12 relative overflow-hidden">
          {/* Subtle background animation */}
          <div className="absolute inset-0 opacity-5">
            <div className="w-full h-full bg-gradient-to-r from-transparent via-gray-200 to-transparent animate-pulse"></div>
          </div>
          
          <div className="relative max-w-6xl mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div className="flex items-center space-x-2 mb-4 md:mb-0 group">
                <div className="w-6 h-6 bg-black rounded-md flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <span className="font-semibold text-gray-900 group-hover:text-black transition-colors">ClimateNotify</span>
              </div>
              <div className="flex space-x-6 text-base text-gray-600">
                <a href="#" className="hover:text-gray-900 hover:underline transition-all duration-200">About</a>
                <a href="#" className="hover:text-gray-900 hover:underline transition-all duration-200">Privacy</a>
                <a href="#" className="hover:text-gray-900 hover:underline transition-all duration-200">Contact</a>
              </div>
            </div>
            <div className="border-t border-gray-200 mt-8 pt-8 text-center">
              <p className="text-base text-gray-500 animate-fade-in">&copy; 2025 ClimateNotify. All rights reserved.</p>
              {/* Floating particles effect */}
              <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-1 h-1 bg-gray-400 rounded-full opacity-20 animate-float"
                    style={{
                      left: `${20 + i * 15}%`,
                      top: `${30 + i * 10}%`,
                      animationDelay: `${i * 0.5}s`,
                      animationDuration: `${3 + i}s`
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </footer>

        {/* Floating Action Button */}
        <div className="fixed bottom-8 right-8 z-50 animate-float">
          <div className="group relative">
            <button className="w-14 h-14 bg-black text-white rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 flex items-center justify-center">
              <svg className="w-6 h-6 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </button>
            {/* Tooltip */}
            <div className="absolute bottom-16 right-0 bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
              Get Climate Alerts
            </div>
            {/* Ripple effect */}
            <div className="absolute inset-0 rounded-full bg-black opacity-25 animate-ping"></div>
          </div>
        </div>

        {/* Back to Top Button */}
        {showBackToTop && (
          <div className="fixed bottom-8 left-8 z-50 animate-fade-in">
            <button
              onClick={scrollToTop}
              className="group w-12 h-12 bg-white border border-gray-200 text-gray-600 rounded-full shadow-lg hover:shadow-xl hover:scale-110 hover:bg-gray-50 transition-all duration-300 flex items-center justify-center"
            >
              <svg className="w-5 h-5 group-hover:-translate-y-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            </button>
          </div>
        )}

        {/* Floating Elements for Visual Interest */}
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute opacity-5"
              style={{
                left: `${10 + i * 12}%`,
                top: `${20 + (i % 3) * 25}%`,
                animationDelay: `${i * 2}s`
              }}
            >
              {i % 3 === 0 ? (
                <div className="w-4 h-4 bg-gray-400 rounded-full animate-float" />
              ) : i % 3 === 1 ? (
                <div className="w-3 h-3 bg-gray-400 rotate-45 animate-float" />
              ) : (
                <div className="w-0 h-0 border-l-2 border-r-2 border-b-3 border-gray-400 animate-float" style={{borderBottomColor: '#9ca3af'}} />
              )}
            </div>
          ))}
        </div>

        {/* Demo Modal Overlay */}
        {showDemoModal && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center">
            {/* Backdrop */}
            <div 
              className="absolute inset-0 bg-black bg-opacity-75 backdrop-blur-sm"
              onClick={closeDemoModal}
            ></div>
            
            {/* Modal Content */}
            <div className="relative w-full max-w-6xl mx-4 bg-white rounded-lg shadow-2xl overflow-hidden animate-fade-in">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">ClimateNotify Demo</h3>
                <button
                  onClick={closeDemoModal}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                >
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {/* Storylane Embed */}
              <div className="relative bg-gray-50">
                <div 
                  className="sl-embed" 
                  style={{
                    position: 'relative',
                    paddingBottom: 'calc(47.46% + 25px)',
                    width: '100%',
                    height: 0,
                    transform: 'scale(1)'
                  }}
                >
                  <iframe 
                    loading="lazy" 
                    className="sl-demo" 
                    src="https://app.storylane.io/demo/jtltrr2cra95?embed=inline" 
                    name="sl-embed" 
                    allowFullScreen 
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      border: '1px solid rgba(63,95,172,0.35)',
                      boxShadow: '0px 0px 18px rgba(26, 19, 72, 0.15)',
                      borderRadius: '10px',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>
              
              {/* Modal Footer */}
              <div className="p-4 bg-gray-50 border-t border-gray-200 text-center">
                <p className="text-sm text-gray-600">
                  Interactive demo - Experience all ClimateNotify features
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Press ESC to close or click outside the modal
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default HomePage;