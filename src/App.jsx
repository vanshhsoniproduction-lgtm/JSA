import React, { useState, useEffect, useRef } from 'react';
import {
  MapPin,
  ArrowRight,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Users,
  Store,
  Award,
  ShieldCheck,
  TrendingUp,
  Clock,
  Play,
  Phone,
  Mail,
  Navigation,
  Menu,
  X,
  Coins,
  Building,
  Layers,
  Sparkles
} from 'lucide-react';
import './App.css';

import {
  initStorage,
  checkAdminAuth,
  logoutAdmin
} from './db';
import AdminPanel from './AdminPanel';
import AdminLogin from './AdminLogin';
import RegistrationPage from './RegistrationPage';

// Clean SVG Instagram Icon
const InstagramIcon = ({ size = 18, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);


// Reusable Scroll Animation Wrapper Hook / Component
function RevealSection({ children, className = "", delay = "" }) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -50px 0px' }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }
    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, []);

  return (
    <div ref={ref} className={`reveal-section ${isVisible ? 'is-visible' : ''} ${delay} ${className}`}>
      {children}
    </div>
  );
}

// Animated Synchronized Counter Component
function CounterNumber({ endValue, duration = 2000, suffix = "+" }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const startTime = performance.now();
          const target = endValue;

          const step = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const easeProgress = 1 - Math.pow(1 - progress, 3);
            const currentVal = Math.floor(easeProgress * target);
            setCount(currentVal);

            if (progress < 1) {
              requestAnimationFrame(step);
            } else {
              setCount(target);
            }
          };

          requestAnimationFrame(step);
        }
      },
      { threshold: 0.2 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }
    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, [endValue, duration]);

  return (
    <span ref={ref} className="counter-digit">
      {count.toLocaleString('en-IN')}{suffix}
    </span>
  );
}

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [galleryFilter, setGalleryFilter] = useState('all');
  const [scrolled, setScrolled] = useState(false);
  const [adminAuth, setAdminAuth] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);

  // Initialize Local Database on Mount
  useEffect(() => {
    initStorage();
    setAdminAuth(checkAdminAuth());

    // Check URL query / hash for admin or register routes
    const checkRoute = () => {
      const hash = window.location.hash.toLowerCase();
      const path = window.location.pathname.toLowerCase();
      if (hash === '#admin' || hash === '#/admin' || path.includes('admin') || hash === '#.admin') {
        if (checkAdminAuth()) {
          setCurrentPage('admin');
        } else {
          setShowAdminLogin(true);
        }
      } else if (
        hash === '#register' ||
        hash === '#/register' ||
        hash === '#visitor' ||
        hash === '#/visitor' ||
        hash === '#registration' ||
        path.includes('register') ||
        path.includes('visitor')
      ) {
        setCurrentPage('register');
      }
    };

    checkRoute();
    window.addEventListener('hashchange', checkRoute);
    return () => window.removeEventListener('hashchange', checkRoute);
  }, []);

  const goToRegister = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    window.location.hash = 'register';
    setCurrentPage('register');
    setMobileMenuOpen(false);
  };

  const heroCarouselImages = [
    "https://jsasilvershow.com/images/crousel/1.jpg",
    "https://jsasilvershow.com/images/crousel/2.jpg",
    "https://jsasilvershow.com/images/crousel/3.jpg",
    "https://jsasilvershow.com/images/crousel/4.jpg",
    "https://jsasilvershow.com/images/crousel/5.jpg",
    "https://jsasilvershow.com/images/crousel/6.jpg"
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroCarouselImages.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [heroCarouselImages.length]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setMobileMenuOpen(false);
  }, [currentPage]);

  if (currentPage === 'register') {
    return (
      <RegistrationPage 
        onGoHome={() => {
          window.location.hash = '';
          setCurrentPage('home');
        }} 
      />
    );
  }

  if (currentPage === 'admin' && adminAuth) {
    return (
      <AdminPanel 
        onLogout={() => {
          logoutAdmin();
          setAdminAuth(false);
          setCurrentPage('home');
        }}
        onGoToSite={() => setCurrentPage('home')}
      />
    );
  }

  return (
    <div className="app-root">
      {/* UNIQUE FLOATING CAPSULE ISLAND NAVBAR */}
      <div className={`floating-nav-wrapper ${scrolled ? 'is-scrolled' : ''}`}>
        <header className="island-navbar">
          {/* Brand Logo & Name */}
          <div 
            className="island-brand" 
            onClick={() => setCurrentPage('home')} 
            role="button" 
            tabIndex={0}
          >
            <img src="/jsa-show-logo.jpg" alt="JSA Logo" className="island-logo" />
            <div className="island-brand-titles">
              <span className="island-title font-serif">JSA Silver Show</span>
              <span className="island-subtitle">JAIPUR 2026</span>
            </div>
          </div>

          <div className="island-divider"></div>

          {/* Center Links Segmented Control */}
          <nav className="island-nav-links">
            <button 
              className={`island-link ${currentPage === 'home' ? 'active' : ''}`}
              onClick={() => setCurrentPage('home')}
            >
              Home
            </button>
            <button 
              className={`island-link ${currentPage === 'about' ? 'active' : ''}`}
              onClick={() => setCurrentPage('about')}
            >
              About
            </button>
            <button 
              className={`island-link ${currentPage === 'exhibitor-alerts' ? 'active' : ''}`}
              onClick={() => setCurrentPage('exhibitor-alerts')}
            >
              Exhibitors
            </button>
            <button 
              className={`island-link ${currentPage === 'visitor-alerts' ? 'active' : ''}`}
              onClick={() => setCurrentPage('visitor-alerts')}
            >
              Visitors
            </button>
            <button 
              className={`island-link ${currentPage === 'gallery' ? 'active' : ''}`}
              onClick={() => setCurrentPage('gallery')}
            >
              Gallery
            </button>
            <a href="#contact-desk" className="island-link">
              Contact
            </a>
          </nav>

          <div className="island-divider"></div>

          {/* Right Action & Date indicator */}
          <div className="island-right">
            <div className="island-date-badge">
              <span className="live-sparkle-dot"></span>
              22–24 NOV
            </div>
            
            <button 
              onClick={goToRegister}
              className="btn-island-primary"
            >
              <span>Register</span>
              <ArrowRight size={13} />
            </button>

            <button 
              className="island-mobile-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </header>

        {/* Mobile Flyout Menu */}
        {mobileMenuOpen && (
          <div className="island-mobile-drawer">
            <div className="drawer-header">
              <span>22 – 24 NOVEMBER 2026 • BIRLA AUDITORIUM</span>
            </div>
            <div className="drawer-links">
              <button onClick={() => setCurrentPage('home')} className={currentPage === 'home' ? 'active' : ''}>Home</button>
              <button onClick={() => setCurrentPage('about')} className={currentPage === 'about' ? 'active' : ''}>About Us</button>
              <button onClick={() => setCurrentPage('exhibitor-alerts')} className={currentPage === 'exhibitor-alerts' ? 'active' : ''}>Exhibitor Alerts</button>
              <button onClick={() => setCurrentPage('visitor-alerts')} className={currentPage === 'visitor-alerts' ? 'active' : ''}>Visitor Alerts</button>
              <button onClick={() => setCurrentPage('gallery')} className={currentPage === 'gallery' ? 'active' : ''}>Gallery</button>
              <a href="#contact-desk" onClick={() => setMobileMenuOpen(false)}>Contact Us</a>
            </div>
            <div className="drawer-cta-stack">
              <button onClick={goToRegister} className="btn-solid w-full">Register as Visitor</button>
              <a href="https://jsasilvershow.com/exhibitor-intent-form" target="_blank" rel="noopener noreferrer" className="btn-outlined w-full">Exhibitor Intent</a>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================
          PAGE 1: HOME
          ======================================================== */}
      {currentPage === 'home' && (
        <main className="page-content">
          {/* FULL SCREEN HERO SECTION WITH FADED BACKGROUND CAROUSEL */}
          <section className="hero-fullscreen-section">
            {/* Background Faded Crossfading Images */}
            <div className="hero-bg-carousel">
              {heroCarouselImages.map((imgUrl, index) => (
                <div 
                  key={index}
                  className={`hero-bg-slide ${currentSlide === index ? 'active' : ''}`}
                  style={{ backgroundImage: `url(${imgUrl})` }}
                  aria-hidden="true"
                />
              ))}
              <div className="hero-overlay-gradient"></div>
              <div className="hero-overlay-shimmer"></div>
            </div>

            {/* Hero Main Content */}
            <div className="hero-fullscreen-container">
              <div className="hero-content-stack">
                <div className="hero-subheading-line hero-badge-glow">
                  <span className="live-sparkle-dot"></span>
                  <span>22 – 24 NOVEMBER 2026 • BIRLA AUDITORIUM, JAIPUR</span>
                </div>

                <h1 className="hero-fullscreen-title font-serif">
                  Jaipur Silver <br className="hero-break" />
                  <span className="text-shimmer-pink">Show 2026</span>
                </h1>

                <div className="hero-cta-row">
                  <button 
                    onClick={goToRegister}
                    className="btn-hero-primary"
                  >
                    <span>REGISTER AS VISITOR (FREE)</span>
                    <ArrowRight size={15} />
                  </button>

                  <a 
                    href="https://jsasilvershow.com/exhibitor-intent-form" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="btn-hero-secondary"
                  >
                    <span>EXHIBITOR INTENT</span>
                    <ArrowUpRight size={14} />
                  </a>

                  <a 
                    href="https://jsasilvershow.com/booths" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="btn-hero-tertiary"
                  >
                    <span>FLOOR PLAN & BOOTHS</span>
                    <ArrowUpRight size={14} />
                  </a>
                </div>
              </div>
            </div>
          </section>

          {/* STACKED FULL WEBSITE SECTIONS (TRANSITIONING FROM HERO WITH OVERLAP & BORDER RADIUS) */}
          <div className="stacked-website-content">
            {/* STATS / WHY JOIN JSA (SYNCHRONIZED COUNTERS) */}
            <section className="section-space stats-hero-stack">
              <div className="container">
                <RevealSection>
                  <div className="section-head">
                    <h2 className="section-title font-serif">Why Join JSA</h2>
                    <p className="section-lead">Reasons to be part of the community shaping India's silver jewelry & bullion ecosystem.</p>
                  </div>
                </RevealSection>

                {/* All three load at the same time with synchronized animated numbers */}
                <RevealSection>
                  <div className="stats-clean-grid stats-capsule-grid">
                    <div className="stat-card stat-capsule-card">
                      <div className="stat-icon-wrap"><Users size={24} /></div>
                      <div className="stat-value font-serif">
                        <CounterNumber endValue={10000} duration={2000} suffix="+" />
                      </div>
                      <h3 className="stat-title">BUYERS & VISITORS</h3>
                      <p className="stat-desc">
                        Verified jewellery showroom owners, wholesale distributors, sourcing agents, and export buyers.
                      </p>
                    </div>

                    <div className="stat-card stat-capsule-card">
                      <div className="stat-icon-wrap"><Store size={24} /></div>
                      <div className="stat-value font-serif">
                        <CounterNumber endValue={300} duration={2000} suffix="+" />
                      </div>
                      <h3 className="stat-title">BOOTHS</h3>
                      <p className="stat-desc">
                        State-of-the-art exhibition layout spread across three dedicated halls with security and AC lounge.
                      </p>
                    </div>

                    <div className="stat-card stat-capsule-card">
                      <div className="stat-icon-wrap"><Award size={24} /></div>
                      <div className="stat-value font-serif">
                        <CounterNumber endValue={175} duration={2000} suffix="+" />
                      </div>
                      <h3 className="stat-title">EXHIBITORS</h3>
                      <p className="stat-desc">
                        Leading manufacturers, silver bullion dealers, casting tech providers, and master artisans.
                      </p>
                    </div>
                  </div>
                </RevealSection>
              </div>
            </section>

            {/* ASSOCIATION PILLARS */}
            <section className="section-space bg-tint border-top-clean border-bottom-clean">
              <div className="container">
                <RevealSection>
                  <div className="section-head">
                    <span className="section-kicker">KEY ADVANTAGES</span>
                    <h2 className="section-title font-serif">What JSA Brings to the Silver Trade</h2>
                  </div>
                </RevealSection>

                <div className="pillars-clean-grid">
                  <RevealSection delay="delay-1">
                    <div className="pillar-box">
                      <span className="pillar-order font-serif">01</span>
                      <div className="pillar-icon"><Coins size={20} /></div>
                      <h4>Daily Bullion Benchmarks</h4>
                      <p>Accurate spot market rates for 999 and 925 silver to maintain price transparency and fair trading across Rajasthan.</p>
                    </div>
                  </RevealSection>

                  <RevealSection delay="delay-2">
                    <div className="pillar-box">
                      <span className="pillar-order font-serif">02</span>
                      <div className="pillar-icon"><ShieldCheck size={20} /></div>
                      <h4>Hallmarking & Trust</h4>
                      <p>Ensuring strict compliance with purity standards and authentic craftsmanship verification for buyers.</p>
                    </div>
                  </RevealSection>

                  <RevealSection delay="delay-3">
                    <div className="pillar-box">
                      <span className="pillar-order font-serif">03</span>
                      <div className="pillar-icon"><Building size={20} /></div>
                      <h4>Direct B2B Market Access</h4>
                      <p>Connecting regional master silversmiths directly with pan-India retail chains and international export channels.</p>
                    </div>
                  </RevealSection>
                </div>
              </div>
            </section>

            {/* DAILY BULLION INDEX */}
            <section className="section-space dark-band">
              <div className="container">
                <RevealSection>
                  <div className="bullion-clean-layout">
                    <div className="bullion-info">
                      <span className="dark-kicker">DAILY MARKET INTELLIGENCE</span>
                      <h2 className="bullion-title font-serif">Jaipur Silver Rates & Bullion Index</h2>
                      <p className="bullion-desc">
                        Daily benchmark prices monitored and maintained by the Jaipur Silver Association to safeguard trade credibility.
                      </p>
                    </div>

                    <div className="bullion-rates-cards">
                      <div className="rate-box">
                        <div className="rate-label">Silver 999 (Fine)</div>
                        <div className="rate-num font-serif">₹98,500 <span className="unit">/ kg</span></div>
                        <div className="rate-meta">
                          <TrendingUp size={14} />
                          <span>Market Bullish • Verified Spot</span>
                        </div>
                      </div>

                      <div className="rate-box">
                        <div className="rate-label">Silver 925 (Sterling)</div>
                        <div className="rate-num font-serif">₹91,200 <span className="unit">/ kg</span></div>
                        <div className="rate-meta">
                          <TrendingUp size={14} />
                          <span>Hallmark Standard</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </RevealSection>
              </div>
            </section>

            {/* EVENT VENUE CAPSULE LUXURY CARD */}
            <section className="section-space border-bottom-clean">
              <div className="container">
                <RevealSection>
                  <div className="venue-capsule-island">
                    <div className="venue-capsule-header">
                      <div className="venue-header-left">
                        <span className="venue-pill-badge">
                          <MapPin size={14} className="venue-badge-ico" />
                          <span>OFFICIAL EXHIBITION VENUE</span>
                        </span>
                        <h2 className="venue-capsule-title font-serif">
                          Birla Auditorium, Jaipur
                        </h2>
                        <p className="venue-capsule-subtitle">
                          A world-class landmark venue hosting the entire 3-hall silver exposition in the royal heart of Rajasthan.
                        </p>
                      </div>

                      <div className="venue-header-action">
                        <a 
                          href="https://www.google.com/maps/search/?api=1&query=Birla+Auditorium+Jaipur" 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="btn-solid venue-dir-btn"
                        >
                          <Navigation size={15} />
                          <span>GET DIRECTIONS</span>
                        </a>
                      </div>
                    </div>

                    {/* Venue Body Grid */}
                    <div className="venue-capsule-body">
                      {/* Left: Info & Capsule Hall Badges */}
                      <div className="venue-capsule-details">
                        <div className="venue-address-capsule">
                          <div className="venue-addr-ico-box">
                            <MapPin size={22} />
                          </div>
                          <div className="venue-addr-info">
                            <strong>Birla Auditorium & Convention Centre</strong>
                            <p>Statue Circle, Bhawani Singh Marg, C Scheme, Jaipur, Rajasthan 302001, India</p>
                          </div>
                        </div>

                        <div className="venue-halls-grid">
                          <div className="venue-hall-capsule hall-a">
                            <span className="hall-tag">HALL A</span>
                            <div className="hall-details">
                              <strong>Fine Silver Jewellery</strong>
                              <p>Bridal sets, antique filigree & export lines</p>
                            </div>
                          </div>

                          <div className="venue-hall-capsule hall-b">
                            <span className="hall-tag">HALL B</span>
                            <div className="hall-details">
                              <strong>Utensils & Silver Artifacts</strong>
                              <p>Royal dinnerware, temple idols & gifting</p>
                            </div>
                          </div>

                          <div className="venue-hall-capsule hall-c">
                            <span className="hall-tag">HALL C</span>
                            <div className="hall-details">
                              <strong>Machinery & Allied Tech</strong>
                              <p>Laser engraving, 3D casting & testing</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Right: Map in rounded glass capsule */}
                      <div className="venue-capsule-map-wrap">
                        <div className="venue-map-inner-capsule">
                          <iframe 
                            title="Birla Auditorium Jaipur Map"
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3557.8596656755106!2d75.80164807611094!3d26.907156960309996!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x396db41328bc6e3f%3A0xe54d8b965fcae135!2sBirla%20Auditorium!5e0!3m2!1sen!2sin!4v1709500000000!5m2!1sen!2sin" 
                            width="100%" 
                            height="340" 
                            style={{ border: 0 }} 
                            allowFullScreen="" 
                            loading="lazy" 
                            referrerPolicy="no-referrer-when-downgrade"
                          ></iframe>
                        </div>
                      </div>
                    </div>
                  </div>
                </RevealSection>
              </div>
            </section>

          {/* INSIDE THE ASSOCIATION (VIDEO) */}
          <section className="section-space">
            <div className="container">
              <RevealSection>
                <div className="section-head">
                  <span className="section-kicker">INSIDE THE ASSOCIATION</span>
                  <h2 className="section-title font-serif">A glimpse into our recent meeting.</h2>
                  <p className="section-lead">Watch highlights from our latest association meet — discussions on trade growth, member welfare, and the road ahead for Jaipur's silver industry.</p>
                </div>

                <div className="video-minimal-card">
                  <img src="/hero-slide-2.jpg" alt="Association Meet" className="video-thumb" />
                  <div className="video-shade"></div>
                  
                  <div className="video-badge">
                    <Clock size={13} />
                    <span>04:12</span>
                  </div>

                  <div className="video-center">
                    <button 
                      className="play-round-btn"
                      onClick={() => setVideoModalOpen(true)}
                      aria-label="Play video"
                    >
                      <Play size={22} className="play-ico" />
                    </button>
                    <span className="play-label">Watch Meeting Highlights</span>
                  </div>

                  <div className="video-bottom-info">
                    <h4 className="font-serif">Jaipur Silver Association Annual General Assembly</h4>
                    <p>Deliberations on export corridors, hallmarking standards, and 2026 expo setup.</p>
                  </div>
                </div>
              </RevealSection>
            </div>
          </section>

          {/* OUR PARTNERS SECTION (CONTINUOUS RIGHT-TO-LEFT LOOP) */}
          <section className="section-space partners-section border-top-clean border-bottom-clean">
            <div className="container">
              <RevealSection>
                <div className="section-head">
                  <h2 className="section-title font-serif">Our Partners</h2>
                  <p className="section-lead">Collaborating with industry pioneers, bullion refiners, hallmark centers, and master artisan guilds.</p>
                </div>
              </RevealSection>
            </div>

            {/* Continuous Marquee (Right to Left) */}
            <div className="partners-marquee-container">
              <div className="partners-marquee-track">
                {/* 1st Loop Group */}
                <div className="partners-marquee-group">
                  <div className="partner-capsule-card">
                    <div className="partner-emblem-box">
                      <ShieldCheck size={26} className="partner-emblem-ico" />
                    </div>
                    <div className="partner-info">
                      <span className="partner-name font-serif">Jaipur Bullion Refinery</span>
                      <span className="partner-meta">Certified 999 Purity Partner</span>
                    </div>
                  </div>

                  <div className="partner-capsule-card">
                    <div className="partner-emblem-box">
                      <Award size={26} className="partner-emblem-ico" />
                    </div>
                    <div className="partner-info">
                      <span className="partner-name font-serif">Royal Filigree Guild</span>
                      <span className="partner-meta">Heritage Silversmiths Alliance</span>
                    </div>
                  </div>

                  <div className="partner-capsule-card">
                    <div className="partner-emblem-box">
                      <Layers size={26} className="partner-emblem-ico" />
                    </div>
                    <div className="partner-info">
                      <span className="partner-name font-serif">India Hallmarking Board</span>
                      <span className="partner-meta">Quality & Standards Partner</span>
                    </div>
                  </div>

                  <div className="partner-capsule-card">
                    <div className="partner-emblem-box">
                      <Sparkles size={26} className="partner-emblem-ico" />
                    </div>
                    <div className="partner-info">
                      <span className="partner-name font-serif">Sterling Export Corridor</span>
                      <span className="partner-meta">Global Trade Facilitator</span>
                    </div>
                  </div>

                  <div className="partner-capsule-card">
                    <div className="partner-emblem-box">
                      <Coins size={26} className="partner-emblem-ico" />
                    </div>
                    <div className="partner-info">
                      <span className="partner-name font-serif">Apex Silver Artisans</span>
                      <span className="partner-meta">Master Crafts Collective</span>
                    </div>
                  </div>

                  <div className="partner-capsule-card">
                    <div className="partner-emblem-box">
                      <Building size={26} className="partner-emblem-ico" />
                    </div>
                    <div className="partner-info">
                      <span className="partner-name font-serif">Rajasthan Trade Chamber</span>
                      <span className="partner-meta">Official Industry Patron</span>
                    </div>
                  </div>
                </div>

                {/* 2nd Loop Group (Identical clone for seamless infinite loop) */}
                <div className="partners-marquee-group" aria-hidden="true">
                  <div className="partner-capsule-card">
                    <div className="partner-emblem-box">
                      <ShieldCheck size={26} className="partner-emblem-ico" />
                    </div>
                    <div className="partner-info">
                      <span className="partner-name font-serif">Jaipur Bullion Refinery</span>
                      <span className="partner-meta">Certified 999 Purity Partner</span>
                    </div>
                  </div>

                  <div className="partner-capsule-card">
                    <div className="partner-emblem-box">
                      <Award size={26} className="partner-emblem-ico" />
                    </div>
                    <div className="partner-info">
                      <span className="partner-name font-serif">Royal Filigree Guild</span>
                      <span className="partner-meta">Heritage Silversmiths Alliance</span>
                    </div>
                  </div>

                  <div className="partner-capsule-card">
                    <div className="partner-emblem-box">
                      <Layers size={26} className="partner-emblem-ico" />
                    </div>
                    <div className="partner-info">
                      <span className="partner-name font-serif">India Hallmarking Board</span>
                      <span className="partner-meta">Quality & Standards Partner</span>
                    </div>
                  </div>

                  <div className="partner-capsule-card">
                    <div className="partner-emblem-box">
                      <Sparkles size={26} className="partner-emblem-ico" />
                    </div>
                    <div className="partner-info">
                      <span className="partner-name font-serif">Sterling Export Corridor</span>
                      <span className="partner-meta">Global Trade Facilitator</span>
                    </div>
                  </div>

                  <div className="partner-capsule-card">
                    <div className="partner-emblem-box">
                      <Coins size={26} className="partner-emblem-ico" />
                    </div>
                    <div className="partner-info">
                      <span className="partner-name font-serif">Apex Silver Artisans</span>
                      <span className="partner-meta">Master Crafts Collective</span>
                    </div>
                  </div>

                  <div className="partner-capsule-card">
                    <div className="partner-emblem-box">
                      <Building size={26} className="partner-emblem-ico" />
                    </div>
                    <div className="partner-info">
                      <span className="partner-name font-serif">Rajasthan Trade Chamber</span>
                      <span className="partner-meta">Official Industry Patron</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          </div>
        </main>
      )}

      {/* ========================================================
          PAGE 2: ABOUT US — REDESIGNED
          ======================================================== */}
      {currentPage === 'about' && (
        <main className="au-page">

          {/* HERO */}
          <section className="au-hero">
            <div className="container">
              <RevealSection>
                <p className="au-eyebrow">About the Association</p>
                <h1 className="au-hero-title">Jaipur Silver<br /><em>Association</em></h1>
                <p className="au-hero-lead">Preserving centuries of silversmithing heritage while empowering the future of trade.</p>
              </RevealSection>
            </div>
          </section>

          {/* HERITAGE */}
          <section className="au-section">
            <div className="container">
              <RevealSection>
                <div className="au-heritage">
                  <div className="au-heritage-text">
                    <span className="au-label">Our Story</span>
                    <h2 className="au-h2">Heritage, Craft<br />&amp; Transparency</h2>
                    <p className="au-body">
                      Jaipur has long stood as the world's crowning jewel for handcrafted silver artistry, intricate filigree, and authentic bullion trade. The Jaipur Silver Association represents the collective voice of silversmiths, master artisans, casting innovators, and export merchants.
                    </p>
                    <p className="au-body">
                      Through the annual <strong>JSA Silver Show</strong>, we curate a national B2B exhibition platform providing fair pricing, direct buyer connections, and certified hallmarking purity.
                    </p>
                    <div className="au-pillars">
                      <div className="au-pillar">
                        <ShieldCheck size={15} className="au-pillar-ico" />
                        <div>
                          <strong>Purity &amp; Certification</strong>
                          <p>Active support for 925 and 999 hallmarking compliance.</p>
                        </div>
                      </div>
                      <div className="au-pillar">
                        <Users size={15} className="au-pillar-ico" />
                        <div>
                          <strong>Artisan Welfare</strong>
                          <p>Sustaining handcrafted techniques and artisan livelihoods.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="au-heritage-img">
                    <img src="https://jsasilvershow.com/images/crousel/1.jpg" alt="Silver Craft" />
                  </div>
                </div>
              </RevealSection>
            </div>
          </section>

          {/* TEAM INTRO */}
          <section className="au-team-intro">
            <div className="container">
              <RevealSection>
                <span className="au-label au-label--center">Our People</span>
                <h2 className="au-h2 au-centered">The People Behind<br />JSA Silver Show</h2>
                <p className="au-sub-lead">Meet the advisors, trustees, and committee members driving Jaipur's silver industry forward.</p>
              </RevealSection>
            </div>
          </section>

          {/* ADVISORY COMMITTEE */}
          <section className="au-section au-tinted">
            <div className="container">
              <RevealSection>
                <div className="au-group-head">
                  <span className="au-pill">Advisory Committee</span>
                  <p className="au-group-sub">Senior industry voices guiding the association's long-term direction and standards.</p>
                </div>
                <div className="au-persons-grid">
                  {[
                    { name: 'Sh. Ashok Maheshwari',  img: 'ashok_maheshwari.jpg' },
                    { name: 'Sh. Raju Mangodiwala',  img: 'raju_mangodiwala.jpg' },
                    { name: 'Sh. Ankit Vaidya',       img: 'ankit_vaidya.jpg' },
                    { name: 'Sh. Manish Khunteta',    img: 'manish_khunteta.jpg' },
                    { name: 'Sh. Apoorv Nawalkha',    img: 'apoorv_nawalkha.jpg' },
                    { name: 'Sh. Snehdeep Khyaliya',  img: 'snehdeep_khyaliya.jpg',  role: 'Criminal Advocate' },
                    { name: 'Sh. Prateek Singh',       img: 'prateek_singh.jpg',       role: 'Civil Advocate' },
                    { name: 'Sh. Sachin Kumar Gupta', img: 'sachin_gupta.jpg' },
                  ].map((m, i) => (
                    <div key={i} className="au-person">
                      <div className="au-avatar">
                        <img src={`https://jsasilvershow.com/images/committee/${m.img}`} alt={m.name} />
                      </div>
                      <p className="au-pname">{m.name}</p>
                      {m.role && <span className="au-prole">{m.role}</span>}
                    </div>
                  ))}
                </div>
              </RevealSection>
            </div>
          </section>

          {/* BOARD OF TRUSTEES */}
          <section className="au-section">
            <div className="container">
              <RevealSection>
                <div className="au-group-head">
                  <span className="au-pill au-pill--pink">Board of Trustees</span>
                  <p className="au-group-sub">The core team steering JSA Silver Show 2026 — planning, operations, and community trust.</p>
                </div>
                <div className="au-trustees">
                  {[
                    { name: 'Ujjwal Derewala',     role: 'Chairman',                        quote: 'With a focus on growth and global reach, Jaipur Silver Show stands as a key initiative for the silver industry.',               img: 'ujjwal_derewala.jpg' },
                    { name: 'Abhineet Boochra',    role: 'Vice Chairman',                   quote: 'Jaipur Silver Show reflects the strength and legacy of our silver industry. We are committed to an exceptional experience.',       img: '2. ABHINEET BOOCHRA VICE, CHAIRMAN.JPG' },
                    { name: 'Abhishek Bansal',     role: 'Vice Chairman',                   quote: 'This initiative reflects our collective effort to elevate the silver industry to new heights.',                                    img: '3. ABHISHEK BANSAL VICE, CHAIRMAN.JPG' },
                    { name: 'Rahul Jain',          role: 'Hony. Secretary',                 quote: "Being part of Jaipur Silver Show is more than participation — it's about shaping the future of trade.",                          img: 'rahul_jain.jpg' },
                    { name: 'Deepesh Goyal',       role: 'Treasurer',                       quote: 'With a focus on transparency and efficiency, we ensure smooth operations of the show.',                                            img: '5. DEEPESH GOYAL, TREASURER.JPG' },
                    { name: 'Karan Boochra',       role: 'Digital & Innovation Secretary',  quote: 'Through digital innovation, we are creating a modern and seamless show experience.',                                              img: '6. KARAN BOOCHRA, DIGITAL AND INNOVATION SECRETARY.JPG' },
                    { name: 'Manan Sogani',        role: 'Joint Secretary',                 quote: 'We are dedicated to coordinating efforts and delivering a smooth experience for all.',                                            img: '7. MANAN SOGANI, JOINT SECRETARY.JPG' },
                    { name: 'Nishant Vijayvargia', role: 'Joint Treasurer',                 quote: 'We ensure proper planning and financial discipline to support the success of the show.',                                          img: '8. NISHANT VIJAYVARGIA, JOINT TREASURER.JPG' },
                    { name: 'Shubham Agarwal',     role: 'Union Secretary',                 quote: 'We strive to unite the industry and create a strong platform for collaboration.',                                                 img: '9. SHUBHAM AGARWAL, UNION SECRETARY.JPG' },
                    { name: 'Kushal Khunteta',     role: 'Union Secretary',                 quote: 'Our aim is to strengthen industry relations and encourage growth through this platform.',                                         img: '10. KUSHAL KHUNTETA, UNION SECRETARY.JPG' },
                  ].map((t, i) => (
                    <div key={i} className="au-trustee">
                      <div className="au-trustee-photo">
                        <img src={`https://jsasilvershow.com/images/committee/${t.img}`} alt={t.name} />
                      </div>
                      <div className="au-trustee-body">
                        <p className="au-tname">{t.name}</p>
                        <span className="au-trole">{t.role}</span>
                        <p className="au-tquote">"{t.quote}"</p>
                      </div>
                    </div>
                  ))}
                </div>
              </RevealSection>
            </div>
          </section>

          {/* SHOW COMMITTEE */}
          <section className="au-section au-tinted">
            <div className="container">
              <RevealSection>
                <div className="au-group-head">
                  <span className="au-pill au-pill--blue">Show Committee</span>
                  <p className="au-group-sub">The on-ground team ensuring every detail of the show runs smoothly.</p>
                </div>
                <div className="au-persons-grid">
                  {[
                    { name: 'Amit Maheshwari',      img: 'amit_maheshwari.jpg' },
                    { name: 'Aashish Khandelwal',   img: 'aashish_khandelwal.jpg' },
                    { name: 'Rambabu Natani',        img: 'rambabu_natani.jpg' },
                    { name: 'Anshul Soni',           img: 'anshul_soni.jpg' },
                    { name: 'Saloni Parasrampuria',  img: 'saloni_parasrampuria.jpg' },
                    { name: 'Neeraj Jain',           img: 'neeraj_jain.jpg' },
                    { name: 'Alok Katta',            img: 'alok_katta.jpg' },
                    { name: 'Vipin Gupta',           img: 'vipin_gupta.jpg' },
                    { name: 'Ramanuj Saraf',         img: 'ramanuj_saraf.jpg' },
                    { name: 'Tribhuvan Agarwal',     img: 'tribhuvan_agarwal.jpg' },
                    { name: 'Vikas Soni',            img: 'vikas_soni.jpg' },
                  ].map((m, i) => (
                    <div key={i} className="au-person">
                      <div className="au-avatar au-avatar--blue">
                        <img src={`https://jsasilvershow.com/images/committee/${m.img}`} alt={m.name} />
                      </div>
                      <p className="au-pname">{m.name}</p>
                    </div>
                  ))}
                </div>
              </RevealSection>
            </div>
          </section>


        </main>
      )}

      {/* ========================================================
          PAGE 3: EXHIBITOR ALERTS
          ======================================================== */}
      {currentPage === 'exhibitor-alerts' && (
        <main className="page-content">
          <div className="page-header-minimal">
            <div className="container">
              <RevealSection>
                <span className="section-kicker">NOTIFICATIONS</span>
                <h1 className="page-title font-serif">Exhibitor Alerts</h1>
                <p className="page-lead">Key announcements regarding stall possession, setups, and logistics.</p>
              </RevealSection>
            </div>
          </div>

          <div className="section-space">
            <div className="container max-w-content">
              <RevealSection delay="delay-1">
                <div className="alert-row">
                  <div className="alert-meta-box">
                    <span className="a-tag">ALLOCATION</span>
                    <span className="a-date">21 NOV</span>
                  </div>
                  <div className="alert-text">
                    <h3 className="font-serif alert-title">Booth Possession & Decoration Schedule</h3>
                    <p className="alert-desc">
                      Exhibitors can begin booth setups starting 21st November from 9:00 AM at Birla Auditorium. Please carry your official possession slip.
                    </p>
                    <a href="https://jsasilvershow.com/exhibitor-intent-form" target="_blank" rel="noopener noreferrer" className="link-arrow">
                      <span>Fill Exhibitor Intent Form</span>
                      <ArrowRight size={14} />
                    </a>
                  </div>
                </div>
              </RevealSection>

              <RevealSection delay="delay-2">
                <div className="alert-row">
                  <div className="alert-meta-box">
                    <span className="a-tag">SECURITY</span>
                    <span className="a-date">22-24 NOV</span>
                  </div>
                  <div className="alert-text">
                    <h3 className="font-serif alert-title">Complimentary On-Site Armed Vaulting</h3>
                    <p className="alert-desc">
                      High-security vaulting facilities are available inside Birla Auditorium for overnight jewelry storage for all registered exhibitors.
                    </p>
                  </div>
                </div>
              </RevealSection>
            </div>
          </div>
        </main>
      )}

      {/* ========================================================
          PAGE 4: VISITOR ALERTS
          ======================================================== */}
      {currentPage === 'visitor-alerts' && (
        <main className="page-content">
          <div className="page-header-minimal">
            <div className="container">
              <RevealSection>
                <span className="section-kicker">NOTIFICATIONS</span>
                <h1 className="page-title font-serif">Visitor Alerts</h1>
                <p className="page-lead">Guidelines, entry timings, and digital badge information.</p>
              </RevealSection>
            </div>
          </div>

          <div className="section-space">
            <div className="container max-w-content">
              <RevealSection delay="delay-1">
                <div className="alert-row">
                  <div className="alert-meta-box">
                    <span className="a-tag">ENTRY PASS</span>
                    <span className="a-date">22-24 NOV</span>
                  </div>
                  <div className="alert-text">
                    <h3 className="font-serif alert-title">Express Visitor Registration & Digital Passes</h3>
                    <p className="alert-desc">
                      Pre-register online to receive your fast-track digital QR entry pass directly on SMS/Email for instant badge printing at Gate 1 and Gate 2.
                    </p>
                    <button onClick={goToRegister} className="btn-solid mt-3">
                      <span>Register as Visitor (Free)</span>
                      <ArrowRight size={13} />
                    </button>
                  </div>
                </div>
              </RevealSection>

              <RevealSection delay="delay-2">
                <div className="alert-row">
                  <div className="alert-meta-box">
                    <span className="a-tag">TIMINGS</span>
                    <span className="a-date">10 AM - 7 PM</span>
                  </div>
                  <div className="alert-text">
                    <h3 className="font-serif alert-title">Exhibition Visiting Hours</h3>
                    <p className="alert-desc">
                      Exhibition opens daily from 10:00 AM to 7:00 PM. Trade visitor lounges will be accessible throughout the day.
                    </p>
                  </div>
                </div>
              </RevealSection>
            </div>
          </div>
        </main>
      )}

      {/* ========================================================
          PAGE 5: GALLERY
          ======================================================== */}
      {currentPage === 'gallery' && (
        <main className="page-content">
          <div className="page-header-minimal">
            <div className="container">
              <RevealSection>
                <span className="section-kicker">ARCHIVES</span>
                <h1 className="page-title font-serif">Event Gallery</h1>
                <p className="page-lead">Glimpses of exhibition halls, artisan masterpieces, and trade interactions.</p>
              </RevealSection>
            </div>
          </div>

          <div className="section-space">
            <div className="container">
              <div className="gallery-tabs-clean">
                <button 
                  className={`gtab ${galleryFilter === 'all' ? 'active' : ''}`}
                  onClick={() => setGalleryFilter('all')}
                >
                  All
                </button>
                <button 
                  className={`gtab ${galleryFilter === 'exhibition' ? 'active' : ''}`}
                  onClick={() => setGalleryFilter('exhibition')}
                >
                  Exhibition Floor
                </button>
                <button 
                  className={`gtab ${galleryFilter === 'jewellery' ? 'active' : ''}`}
                  onClick={() => setGalleryFilter('jewellery')}
                >
                  Silver Jewellery
                </button>
              </div>

              <div className="gallery-grid-clean">
                <RevealSection delay="delay-1">
                  <div className="gallery-item">
                    <img src="/hero-slide-1.jpg" alt="Silver Jewellery" />
                    <div className="g-caption">Handcrafted Royal Silver</div>
                  </div>
                </RevealSection>

                <RevealSection delay="delay-2">
                  <div className="gallery-item">
                    <img src="/hero-slide-2.jpg" alt="Expo Floor" />
                    <div className="g-caption">Birla Auditorium Exhibition Halls</div>
                  </div>
                </RevealSection>

                <RevealSection delay="delay-3">
                  <div className="gallery-item">
                    <img src="/jsa-show-logo.jpg" alt="JSA Emblem" />
                    <div className="g-caption">Jaipur Silver Association Identity</div>
                  </div>
                </RevealSection>
              </div>
            </div>
          </div>
        </main>
      )}

      {/* HIGH-AESTHETIC REGISTRATION CTA BANNER */}
      <section className="registration-cta-banner">
        <div className="container">
          <div className="cta-banner-card">
            <div className="cta-banner-content">
              <span className="cta-pill-kicker">
                <span className="live-sparkle-dot"></span>
                22 – 24 NOVEMBER 2026 • BIRLA AUDITORIUM, JAIPUR
              </span>
              <h2 className="cta-banner-title font-serif">
                Be Part of Jaipur's Silver Legacy
              </h2>
              <p className="cta-banner-desc">
                Whether you're an artisan, trader, manufacturer, or exporter — pre-register now for complimentary direct access, B2B sourcing lounges, and verified hall passes.
              </p>
              <div className="cta-btn-cluster">
                <button 
                  onClick={goToRegister}
                  className="btn-cta-primary"
                >
                  <span>Register as Visitor (Free Pass)</span>
                  <ArrowRight size={16} />
                </button>
                <a 
                  href="https://jsasilvershow.com/exhibitor-intent-form" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="btn-cta-secondary"
                >
                  <span>Book a Booth / Exhibitor Intent</span>
                  <ArrowUpRight size={15} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CLEAN & AESTHETIC LUXURY FOOTER */}
      <footer className="site-footer">
        <div className="container">
          <div className="footer-grid">
            {/* Brand Presentation */}
            <div className="footer-brand-col">
              <div className="footer-brand-header">
                <div className="footer-logo-wrap">
                  <img src="/jsa-show-logo.jpg" alt="Jaipur Silver Association" className="footer-logo" />
                </div>
                <div>
                  <h3 className="f-title font-serif">Jaipur Silver Association</h3>
                  <span className="f-sub">B2B TRADE EXHIBITION • JAIPUR 2026</span>
                </div>
              </div>

              <p className="f-desc">
                Representing the crown of India's silver craftsmanship, bullion trading, and export corridors. Uniting artisans, manufacturers, and global buyers.
              </p>

              <div className="footer-social-row">
                <a 
                  href="https://www.instagram.com/jsasilvershow/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="f-insta-circle-btn"
                  aria-label="Instagram Profile"
                  title="Follow @jsasilvershow on Instagram"
                >
                  <InstagramIcon size={15} />
                </a>
              </div>
            </div>

            {/* Quick Navigation: Exhibition */}
            <div className="footer-col">
              <h4 className="f-head">EXHIBITION</h4>
              <ul className="f-links">
                <li><button onClick={goToRegister}>Visitor Pass Registration</button></li>
                <li><a href="https://jsasilvershow.com/exhibitor-intent-form" target="_blank" rel="noopener noreferrer">Exhibitor Intent Form</a></li>
                <li><a href="https://jsasilvershow.com/booths" target="_blank" rel="noopener noreferrer">Booths & Floor Plan</a></li>
                <li><button onClick={() => setCurrentPage('gallery')}>Exhibition Gallery</button></li>
              </ul>
            </div>

            {/* Quick Navigation: Association */}
            <div className="footer-col">
              <h4 className="f-head">ASSOCIATION</h4>
              <ul className="f-links">
                <li><button onClick={() => setCurrentPage('about')}>About JSA</button></li>
                <li><button onClick={() => setCurrentPage('exhibitor-alerts')}>Exhibitor Alerts</button></li>
                <li><button onClick={() => setCurrentPage('visitor-alerts')}>Visitor Alerts</button></li>
                <li><a href="https://jsasilvershow.com/" target="_blank" rel="noopener noreferrer">Live Bullion Benchmark</a></li>
              </ul>
            </div>

            {/* Contact Details */}
            <div id="contact-desk" className="footer-col footer-contact-col">
              <h4 className="f-head">CONTACT DESK</h4>
              <div className="f-contact-block">
                <div className="f-contact-line">
                  <MapPin size={15} className="f-c-icon" />
                  <span>Apex Tower in Lalkothi, Jaipur, India</span>
                </div>
                <div className="f-contact-line">
                  <Phone size={15} className="f-c-icon" />
                  <div>
                    <a href="tel:+917737637938">+91 7737637938</a>
                    <span className="f-c-sep">,</span>
                    <a href="tel:+917300023083">+91 7300023083</a>
                  </div>
                </div>
                <div className="f-contact-line">
                  <Mail size={15} className="f-c-icon" />
                  <a href="mailto:info@jaipursilverassociation.com">info@jaipursilverassociation.com</a>
                </div>
              </div>
            </div>
          </div>

          {/* Clean Divider & Aesthetic Bottom Row */}
          <div className="footer-bottom">
            <p className="f-copyright">© 2026 Jaipur Silver Association. All rights reserved.</p>
            <div className="f-bottom-links">
              <a href="#">Privacy Policy</a>
              <span>•</span>
              <a href="#">Terms & Conditions</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Admin Login Modal Gateway */}
      {showAdminLogin && (
        <AdminLogin 
          onLoginSuccess={() => {
            setShowAdminLogin(false);
            setAdminAuth(true);
            setCurrentPage('admin');
          }}
          onCancel={() => setShowAdminLogin(false)}
        />
      )}

      {/* Video Modal Popup */}
      {videoModalOpen && (
        <div className="modal-backdrop animate-fade-in" onClick={() => setVideoModalOpen(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setVideoModalOpen(false)}>
              <X size={20} />
            </button>
            <div className="modal-media">
              <iframe 
                width="100%" 
                height="450" 
                src="https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1" 
                title="Jaipur Silver Association Video" 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
