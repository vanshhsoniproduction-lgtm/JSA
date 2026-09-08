import React, { useState, useEffect, useRef } from 'react';
import {
  MapPin,
  ArrowRight,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Users,
  Briefcase,
  LayoutGrid,
  Gem,
  Scale,
  BadgeCheck,
  Globe2,
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
  Sparkles,
  ExternalLink,
  Calendar,
  Lock,
  Coffee,
  Car,
  CheckCircle2
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
import ContactPage from './ContactPage';

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
  const [registerRole, setRegisterRole] = useState('visitor');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [galleryFilter, setGalleryFilter] = useState('all');
  const [scrolled, setScrolled] = useState(false);
  const [adminAuth, setAdminAuth] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);

  // Initialize Local Database on Mount
  useEffect(() => {
    initStorage();
    setAdminAuth(checkAdminAuth());

    // Check URL query / hash for admin, register, or contact routes
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
        hash === '#register-exhibitor' ||
        hash === '#exhibitor' ||
        hash === '#/exhibitor' ||
        hash === '#exhibitor-intent'
      ) {
        setRegisterRole('exhibitor');
        setCurrentPage('register');
      } else if (
        hash === '#register' ||
        hash === '#/register' ||
        hash === '#visitor' ||
        hash === '#/visitor' ||
        hash === '#registration' ||
        path.includes('register') ||
        path.includes('visitor')
      ) {
        setRegisterRole('visitor');
        setCurrentPage('register');
      } else if (hash === '#contact' || hash === '#/contact' || path.includes('contact')) {
        setCurrentPage('contact');
      }
    };

    checkRoute();
    window.addEventListener('hashchange', checkRoute);
    return () => window.removeEventListener('hashchange', checkRoute);
  }, []);

  const goToRegister = (role = 'visitor') => {
    const targetRole = role === 'exhibitor' ? 'exhibitor' : 'visitor';
    setRegisterRole(targetRole);
    window.location.hash = targetRole === 'exhibitor' ? 'register-exhibitor' : 'register';
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
        initialRole={registerRole}
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
            <button 
              className={`island-link ${currentPage === 'contact' ? 'active' : ''}`}
              onClick={() => setCurrentPage('contact')}
            >
              Contact
            </button>
          </nav>

          <div className="island-divider"></div>

          {/* Right Action & Date indicator */}
          <div className="island-right">
            <div className="island-date-badge">
              <span className="live-sparkle-dot"></span>
              22–24 NOV
            </div>
            
            <button 
              onClick={() => goToRegister('visitor')}
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
              <button onClick={() => { setCurrentPage('home'); setMobileMenuOpen(false); }} className={currentPage === 'home' ? 'active' : ''}>Home</button>
              <button onClick={() => { setCurrentPage('about'); setMobileMenuOpen(false); }} className={currentPage === 'about' ? 'active' : ''}>About Us</button>
              <button onClick={() => { setCurrentPage('exhibitor-alerts'); setMobileMenuOpen(false); }} className={currentPage === 'exhibitor-alerts' ? 'active' : ''}>For Exhibitors</button>
              <button onClick={() => { setCurrentPage('visitor-alerts'); setMobileMenuOpen(false); }} className={currentPage === 'visitor-alerts' ? 'active' : ''}>For Visitors</button>
              <button onClick={() => { setCurrentPage('gallery'); setMobileMenuOpen(false); }} className={currentPage === 'gallery' ? 'active' : ''}>Gallery</button>
              <button onClick={() => { setCurrentPage('contact'); setMobileMenuOpen(false); }} className={currentPage === 'contact' ? 'active' : ''}>Contact Us</button>
            </div>
            <div className="drawer-cta-stack">
              <button onClick={() => goToRegister('visitor')} className="btn-solid w-full">Register as Visitor</button>
              <button onClick={() => goToRegister('exhibitor')} className="btn-outlined w-full">Exhibitor Intent</button>
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
                <h1 className="hero-fullscreen-title font-serif">
                  Jaipur Silver <br className="hero-break" />
                  <span className="text-shimmer-pink">Show 2026</span>
                </h1>

                <div className="hero-subheading-line hero-badge-glow">
                  <span className="live-sparkle-dot"></span>
                  <span>22 – 24 NOVEMBER 2026 • BIRLA AUDITORIUM, JAIPUR</span>
                </div>

                <div className="hero-cta-row">
                  <button 
                    onClick={() => goToRegister('visitor')}
                    className="btn-hero-primary"
                  >
                    <span>REGISTER AS VISITOR (FREE)</span>
                    <ArrowRight size={15} />
                  </button>

                  <button 
                    onClick={() => goToRegister('exhibitor')} 
                    className="btn-hero-secondary"
                  >
                    <span>EXHIBITOR INTENT</span>
                    <ArrowUpRight size={14} />
                  </button>

                  <button 
                    onClick={() => goToRegister('exhibitor')} 
                    className="btn-hero-tertiary"
                  >
                    <span>FLOOR PLAN & BOOTHS</span>
                    <ArrowUpRight size={14} />
                  </button>
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
                      <div className="stat-icon-wrap"><Briefcase size={26} /></div>
                      <div className="stat-value font-serif">
                        <CounterNumber endValue={10000} duration={2000} suffix="+" />
                      </div>
                      <h3 className="stat-title">BUYERS & VISITORS</h3>
                      <p className="stat-desc">
                        Verified jewellery showroom owners, wholesale distributors, sourcing agents, and export buyers.
                      </p>
                    </div>

                    <div className="stat-card stat-capsule-card">
                      <div className="stat-icon-wrap"><LayoutGrid size={26} /></div>
                      <div className="stat-value font-serif">
                        <CounterNumber endValue={300} duration={2000} suffix="+" />
                      </div>
                      <h3 className="stat-title">BOOTHS</h3>
                      <p className="stat-desc">
                        State-of-the-art exhibition layout spread across three dedicated halls with security and AC lounge.
                      </p>
                    </div>

                    <div className="stat-card stat-capsule-card">
                      <div className="stat-icon-wrap"><Gem size={26} /></div>
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
                      <div className="pillar-icon"><Scale size={24} /></div>
                      <h4>Daily Bullion Benchmarks</h4>
                      <p>Accurate spot market rates for 999 and 925 silver to maintain price transparency and fair trading across Rajasthan.</p>
                    </div>
                  </RevealSection>

                  <RevealSection delay="delay-2">
                    <div className="pillar-box">
                      <span className="pillar-order font-serif">02</span>
                      <div className="pillar-icon"><BadgeCheck size={24} /></div>
                      <h4>Hallmarking & Trust</h4>
                      <p>Ensuring strict compliance with purity standards and authentic craftsmanship verification for buyers.</p>
                    </div>
                  </RevealSection>

                  <RevealSection delay="delay-3">
                    <div className="pillar-box">
                      <span className="pillar-order font-serif">03</span>
                      <div className="pillar-icon"><Globe2 size={24} /></div>
                      <h4>Direct B2B Market Access</h4>
                      <p>Connecting regional master silversmiths directly with pan-India retail chains and international export channels.</p>
                    </div>
                  </RevealSection>
                </div>
              </div>
            </section>

            {/* DAILY BULLION INDEX & INSTAGRAM COMMUNITY */}
            <section className="section-space">
              <div className="container">
                <RevealSection>
                  <div className="bullion-insta-grid">
                    {/* Left: Jaipur Silver Rates & Bullion Index */}
                    <div className="bullion-capsule-card">
                      <div className="card-top-kicker">
                        <span className="bullion-pill-kicker">
                          <TrendingUp size={14} />
                          <span>DAILY MARKET BENCHMARK</span>
                        </span>
                        <span className="live-market-badge">
                          <span className="live-sparkle-dot"></span>
                          <span>SPOT VERIFIED</span>
                        </span>
                      </div>

                      <h2 className="bullion-card-title font-serif">Jaipur Silver Rates &amp; Bullion Index</h2>
                      <p className="bullion-card-desc">
                        Daily benchmark spot rates monitored and certified by the Jaipur Silver Association to maintain transparency across Rajasthan.
                      </p>

                      <div className="bullion-twin-rates">
                        <div className="rate-capsule-box">
                          <div className="rate-box-header">
                            <span className="rate-box-name">Silver 999 (Fine)</span>
                            <span className="rate-purity-tag">99.9% Pure</span>
                          </div>
                          <div className="rate-box-price font-serif">
                            ₹98,500 <span className="rate-unit">/ kg</span>
                          </div>
                          <div className="rate-box-meta green-tint">
                            <TrendingUp size={13} />
                            <span>Market Bullish • Verified Spot</span>
                          </div>
                        </div>

                        <div className="rate-capsule-box">
                          <div className="rate-box-header">
                            <span className="rate-box-name">Silver 925 (Sterling)</span>
                            <span className="rate-purity-tag">BIS Hallmark</span>
                          </div>
                          <div className="rate-box-price font-serif">
                            ₹91,200 <span className="rate-unit">/ kg</span>
                          </div>
                          <div className="rate-box-meta blue-tint">
                            <BadgeCheck size={13} />
                            <span>Hallmark Standard</span>
                          </div>
                        </div>
                      </div>

                      <div className="bullion-card-footer">
                        <Clock size={13} />
                        <span>Monitored live daily • Jaipur Sarafa Market</span>
                      </div>
                    </div>

                    {/* Right: Follow on Instagram */}
                    <div className="insta-capsule-card">
                      <div className="card-top-kicker">
                        <span className="insta-pill-kicker">
                          <InstagramIcon size={14} />
                          <span>OFFICIAL INSTAGRAM</span>
                        </span>
                        <span className="insta-verified-pill">
                          <BadgeCheck size={13} />
                          <span>OFFICIAL PAGE</span>
                        </span>
                      </div>

                      <div className="insta-header-profile">
                        <div className="insta-avatar-ring">
                          <div className="insta-avatar-inner">
                            <img src="/jsa-show-logo.jpg" alt="JSA Silver Show" />
                          </div>
                        </div>
                        <div className="insta-profile-info">
                          <div className="insta-handle-row">
                            <h3 className="insta-handle">@jsasilvershow</h3>
                            <BadgeCheck size={16} className="insta-check-ico" />
                          </div>
                          <p className="insta-tagline">Jaipur Silver Show 2026 • JSA Official</p>
                        </div>
                      </div>

                      <p className="insta-card-desc">
                        Follow us on Instagram for daily bullion rate reels, artisan craftsmanship spotlights, behind-the-scenes glimpses, and live expo highlights.
                      </p>

                      <div className="insta-highlights-row">
                        <div className="insta-hl-chip">
                          <span className="hl-dot"></span>
                          <span>Daily Rate Reels</span>
                        </div>
                        <div className="insta-hl-chip">
                          <span className="hl-dot"></span>
                          <span>Artisan Spotlights</span>
                        </div>
                        <div className="insta-hl-chip">
                          <span className="hl-dot"></span>
                          <span>Live Expo Stories</span>
                        </div>
                      </div>

                      <div className="insta-card-action">
                        <a 
                          href="https://www.instagram.com/jsasilvershow/" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="btn-insta-follow"
                        >
                          <InstagramIcon size={16} />
                          <span>FOLLOW ON INSTAGRAM</span>
                          <ArrowUpRight size={14} />
                        </a>
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
                    {/* Header */}
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
                          A world-class landmark convention centre hosting the entire 3-hall silver exposition in the royal heart of Rajasthan.
                        </p>
                      </div>

                      <div className="venue-header-actions">
                        <a 
                          href="https://www.google.com/maps/search/?api=1&query=Birla+Auditorium+Jaipur" 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="btn-capsule-primary"
                        >
                          <Navigation size={15} />
                          <span>GET DIRECTIONS</span>
                        </a>
                        <button 
                          onClick={() => goToRegister('visitor')}
                          className="btn-capsule-secondary"
                        >
                          <span>VISITOR PASS</span>
                          <ArrowRight size={14} />
                        </button>
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
                            <strong>Birla Auditorium &amp; Convention Centre</strong>
                            <p>Statue Circle, Bhawani Singh Marg, C Scheme, Jaipur, Rajasthan 302001, India</p>
                          </div>
                        </div>

                        <div className="venue-halls-grid">
                          <div className="venue-hall-capsule hall-a">
                            <span className="hall-tag-capsule">HALL A</span>
                            <div className="hall-details">
                              <strong>Fine Silver Jewellery</strong>
                              <p>Bridal sets, antique filigree &amp; export lines</p>
                            </div>
                          </div>

                          <div className="venue-hall-capsule hall-b">
                            <span className="hall-tag-capsule">HALL B</span>
                            <div className="hall-details">
                              <strong>Utensils &amp; Silver Artifacts</strong>
                              <p>Royal dinnerware, temple idols &amp; corporate gifting</p>
                            </div>
                          </div>

                          <div className="venue-hall-capsule hall-c">
                            <span className="hall-tag-capsule">HALL C</span>
                            <div className="hall-details">
                              <strong>Machinery &amp; Allied Tech</strong>
                              <p>Laser engraving, 3D casting &amp; hallmarking testing</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Right: Architectural Photograph of Birla Auditorium in rounded capsule frame */}
                      <div className="venue-capsule-photo-wrap">
                        <div className="venue-photo-inner-capsule">
                          <img 
                            src="/birla-auditorium.jpg" 
                            alt="BM Birla Auditorium & Convention Centre, Jaipur" 
                            className="venue-photo-img"
                            loading="lazy"
                          />
                          <div className="venue-photo-overlay">
                            <span className="venue-photo-badge">
                              <MapPin size={13} />
                              <span>Statue Circle, C Scheme, Jaipur</span>
                            </span>
                            <a 
                              href="https://www.google.com/maps/search/?api=1&query=Birla+Auditorium+Jaipur" 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="venue-photo-action-btn"
                              aria-label="Open in Google Maps"
                              title="Open in Google Maps"
                            >
                              <ExternalLink size={14} />
                            </a>
                          </div>
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

                <div 
                  className="video-minimal-card" 
                  style={{ pointerEvents: 'none', userSelect: 'none', cursor: 'default' }}
                >
                  <iframe 
                    src="https://www.youtube-nocookie.com/embed/X8rk9yWXnBg?autoplay=1&mute=1&loop=1&playlist=X8rk9yWXnBg&controls=0&showinfo=0&rel=0&modestbranding=1" 
                    title="Jaipur Silver Show Highlights"
                    style={{ width: '100%', height: '100%', border: 'none', pointerEvents: 'none' }}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  />
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

          {/* ========================================================
              SECTION 1: ADVISORY COMMITTEE
              ======================================================== */}
          <section className="au-main-section">
            <div className="container">
              <RevealSection>
                <div className="au-section-heading-block">
                  <span className="au-section-kicker">01 • GUIDING COUNCIL</span>
                  <h2 className="au-section-title font-serif">Advisory Committee</h2>
                  <p className="au-section-sub">Senior industry pioneers, trade veterans, and legal advocates guiding association standards and policy direction.</p>
                </div>
                <div className="au-members-grid">
                  {[
                    { name: 'Sh. Ashok Maheshwari',  role: 'Advisory Member', img: 'ashok_maheshwari.jpg' },
                    { name: 'Sh. Raju Mangodiwala',  role: 'Advisory Member', img: 'raju_mangodiwala.jpg' },
                    { name: 'Sh. Ankit Vaidya',       role: 'Advisory Member', img: 'ankit_vaidya.jpg' },
                    { name: 'Sh. Manish Khunteta',    role: 'Advisory Member', img: 'manish_khunteta.jpg' },
                    { name: 'Sh. Apoorv Nawalkha',    role: 'Advisory Member', img: 'apoorv_nawalkha.jpg' },
                    { name: 'Sh. Snehdeep Khyaliya',  role: 'Criminal Advocate', img: 'snehdeep_khyaliya.jpg' },
                    { name: 'Sh. Prateek Singh',      role: 'Civil Advocate', img: 'prateek_singh.jpg' },
                    { name: 'Sh. Sachin Kumar Gupta', role: 'Advisory Member', img: 'sachin_gupta.jpg' },
                  ].map((m, i) => (
                    <div key={i} className="au-member-card">
                      <div className="au-member-frame">
                        <img 
                          src={`https://jsasilvershow.com/images/committee/${m.img}`} 
                          alt={m.name} 
                          loading="lazy"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            const fb = e.currentTarget.parentElement.querySelector('.au-avatar-fallback');
                            if (fb) fb.style.display = 'flex';
                          }}
                        />
                        <div className="au-avatar-fallback">
                          <span>{m.name.replace(/^(Sh\.|Dr\.)\s*/, '').split(' ').map(n => n[0]).slice(0, 2).join('')}</span>
                        </div>
                      </div>
                      <div className="au-member-body">
                        <h3 className="au-member-name font-serif">{m.name}</h3>
                        <span className="au-member-role-capsule">{m.role}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </RevealSection>
            </div>
          </section>

          {/* ========================================================
              SECTION 2: BOARD OF TRUSTEES
              ======================================================== */}
          <section className="au-main-section au-tinted">
            <div className="container">
              <RevealSection>
                <div className="au-section-heading-block">
                  <span className="au-section-kicker">02 • EXECUTIVE LEADERSHIP</span>
                  <h2 className="au-section-title font-serif">Board of Trustees</h2>
                  <p className="au-section-sub">The core executive team steering JSA Silver Show 2026 — strategic planning, industry governance, and operational integrity.</p>
                </div>
                <div className="au-members-grid">
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
                    <div key={i} className="au-member-card">
                      <div className="au-member-frame">
                        <img 
                          src={`https://jsasilvershow.com/images/committee/${t.img}`} 
                          alt={t.name} 
                          loading="lazy"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            const fb = e.currentTarget.parentElement.querySelector('.au-avatar-fallback');
                            if (fb) fb.style.display = 'flex';
                          }}
                        />
                        <div className="au-avatar-fallback">
                          <span>{t.name.replace(/^(Sh\.|Dr\.)\s*/, '').split(' ').map(n => n[0]).slice(0, 2).join('')}</span>
                        </div>
                      </div>
                      <div className="au-member-body">
                        <h3 className="au-member-name font-serif">{t.name}</h3>
                        <span className="au-member-role-capsule">{t.role}</span>
                        {t.quote && (
                          <p className="au-member-quote">"{t.quote}"</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </RevealSection>
            </div>
          </section>

          {/* ========================================================
              SECTION 3: SHOW COMMITTEE
              ======================================================== */}
          <section className="au-main-section">
            <div className="container">
              <RevealSection>
                <div className="au-section-heading-block">
                  <span className="au-section-kicker">03 • EVENT ORGANIZING TEAM</span>
                  <h2 className="au-section-title font-serif">Show Committee</h2>
                  <p className="au-section-sub">The dynamic on-ground committee managing booth logistics, exhibitor coordination, and buyer hospitality.</p>
                </div>
                <div className="au-members-grid">
                  {[
                    { name: 'Amit Maheshwari',      role: 'Show Committee', img: 'amit_maheshwari.jpg' },
                    { name: 'Aashish Khandelwal',   role: 'Show Committee', img: 'aashish_khandelwal.jpg' },
                    { name: 'Rambabu Natani',        role: 'Show Committee', img: 'rambabu_natani.jpg' },
                    { name: 'Anshul Soni',           role: 'Show Committee', img: 'anshul_soni.jpg' },
                    { name: 'Saloni Parasrampuria',  role: 'Show Committee', img: 'saloni_parasrampuria.jpg' },
                    { name: 'Neeraj Jain',           role: 'Show Committee', img: 'neeraj_jain.jpg' },
                    { name: 'Alok Katta',            role: 'Show Committee', img: 'alok_katta.jpg' },
                    { name: 'Vipin Gupta',           role: 'Show Committee', img: 'vipin_gupta.jpg' },
                    { name: 'Ramanuj Saraf',         role: 'Show Committee', img: 'ramanuj_saraf.jpg' },
                    { name: 'Tribhuvan Agarwal',     role: 'Show Committee', img: 'tribhuvan_agarwal.jpg' },
                    { name: 'Vikas Soni',            role: 'Show Committee', img: 'vikas_soni.jpg' },
                  ].map((m, i) => (
                    <div key={i} className="au-member-card">
                      <div className="au-member-frame">
                        <img 
                          src={`https://jsasilvershow.com/images/committee/${m.img}`} 
                          alt={m.name} 
                          loading="lazy"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            const fb = e.currentTarget.parentElement.querySelector('.au-avatar-fallback');
                            if (fb) fb.style.display = 'flex';
                          }}
                        />
                        <div className="au-avatar-fallback">
                          <span>{m.name.replace(/^(Sh\.|Dr\.)\s*/, '').split(' ').map(n => n[0]).slice(0, 2).join('')}</span>
                        </div>
                      </div>
                      <div className="au-member-body">
                        <h3 className="au-member-name font-serif">{m.name}</h3>
                        <span className="au-member-role-capsule">{m.role}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </RevealSection>
            </div>
          </section>


        </main>
      )}

      {/* ========================================================
          PAGE 3: EXHIBITORS PORTAL & PROFILE (BROCHURE ACCREDITED)
          ======================================================== */}
      {currentPage === 'exhibitor-alerts' && (
        <main className="page-content exhibitor-page-root">
          {/* Hero Header */}
          <div className="portal-hero-capsule">
            <div className="container">
              <RevealSection>
                <div className="portal-hero-content">
                  <span className="portal-pill-badge">
                    <Sparkles size={14} />
                    <span>EXHIBITOR PROFILE • JSA SILVER SHOW 2026</span>
                  </span>
                  <h1 className="portal-hero-title font-serif">
                    Where Heritage Meets Elegance
                  </h1>
                  <p className="portal-hero-lead">
                    The Ultimate Silver Destination, presented for the first time by India's premier silver association. Connect your brand with verified national retail chains, wholesalers, and export buyers under one roof at Birla Auditorium, Jaipur.
                  </p>
                  <div className="portal-hero-actions">
                    <button 
                      onClick={() => goToRegister('exhibitor')}
                      className="btn-portal-primary"
                    >
                      <Store size={15} />
                      <span>SUBMIT EXHIBITOR INTENT</span>
                      <ArrowRight size={14} />
                    </button>
                    <a 
                      href="#exhibitor-profiles" 
                      className="btn-portal-secondary"
                    >
                      <LayoutGrid size={15} />
                      <span>EXPLORE EXHIBITOR PROFILES</span>
                    </a>
                  </div>
                </div>
              </RevealSection>
            </div>
          </div>

          {/* Quick Metrics Strip */}
          <div className="portal-metrics-section">
            <div className="container">
              <RevealSection>
                <div className="portal-metrics-grid">
                  <div className="metric-capsule-item">
                    <div className="metric-num font-serif">22-24</div>
                    <div className="metric-label">November 2026 • 3 Days</div>
                  </div>
                  <div className="metric-capsule-item">
                    <div className="metric-num font-serif">B2B</div>
                    <div className="metric-label">The Powerhouse Business Driver</div>
                  </div>
                  <div className="metric-capsule-item">
                    <div className="metric-num font-serif">100%</div>
                    <div className="metric-label">Pure Silver Ecosystem</div>
                  </div>
                  <div className="metric-capsule-item">
                    <div className="metric-num font-serif">₹0</div>
                    <div className="metric-label">On-Site Armed Vaulting Facility</div>
                  </div>
                </div>
              </RevealSection>
            </div>
          </div>

          {/* Core Feature: Exhibitor Profile (from Official Brochure Page 3) */}
          <div id="exhibitor-profiles" className="portal-content-section">
            <div className="container">
              <RevealSection>
                <div className="portal-section-head">
                  <span className="portal-section-kicker">OFFICIAL BROCHURE PROFILE</span>
                  <h2 className="portal-section-title font-serif">Exhibitor Profile</h2>
                  <p className="portal-section-subtitle">Categories of leading silver businesses exhibiting at India's premier silver showcase.</p>
                </div>

                <div className="portal-profile-grid">
                  <div className="profile-card">
                    <span className="profile-badge-pill pink">MANUFACTURING</span>
                    <h3 className="profile-card-title font-serif">Silver Jewellery Manufacturers</h3>
                    <p className="profile-card-desc">
                      Entities presenting fine handcrafted, traditional, and contemporary 925 sterling silver ornaments.
                    </p>
                    <div className="profile-card-tags">
                      <span className="profile-tag">925 Sterling</span>
                      <span className="profile-tag">Handcrafted</span>
                      <span className="profile-tag">Contemporary Designs</span>
                    </div>
                  </div>

                  <div className="profile-card">
                    <span className="profile-badge-pill blue">WHOLESALE &amp; BULK</span>
                    <h3 className="profile-card-title font-serif">Silver Wholesalers &amp; Distributors</h3>
                    <p className="profile-card-desc">
                      Large-scale suppliers connecting manufacturers with retail buyers across India and global markets.
                    </p>
                    <div className="profile-card-tags">
                      <span className="profile-tag">Pan-India Supply</span>
                      <span className="profile-tag">Global Exports</span>
                      <span className="profile-tag">Bulk Delivery</span>
                    </div>
                  </div>

                  <div className="profile-card">
                    <span className="profile-badge-pill gold">HERITAGE CRAFT</span>
                    <h3 className="profile-card-title font-serif">Kundan Meena &amp; Jadau Artisans</h3>
                    <p className="profile-card-desc">
                      Specialised craftsmen showcasing Jaipur's traditional fusion styles on authentic silver bases.
                    </p>
                    <div className="profile-card-tags">
                      <span className="profile-tag">Kundan Meena</span>
                      <span className="profile-tag">Jadau Work</span>
                      <span className="profile-tag">Royal Fusion</span>
                    </div>
                  </div>

                  <div className="profile-card">
                    <span className="profile-badge-pill purple">BRIDAL &amp; COUTURE</span>
                    <h3 className="profile-card-title font-serif">Moissanite &amp; Polki Silver Jewellers</h3>
                    <p className="profile-card-desc">
                      Exhibitors dealing in high-end fusion jewellery featuring silver with faux diamond accents and polki artistry.
                    </p>
                    <div className="profile-card-tags">
                      <span className="profile-tag">Polki Silver</span>
                      <span className="profile-tag">Moissanite Sets</span>
                      <span className="profile-tag">Haute Couture</span>
                    </div>
                  </div>

                  <div className="profile-card">
                    <span className="profile-badge-pill pink">ARTEFACTS &amp; GIFTS</span>
                    <h3 className="profile-card-title font-serif">Hand-Crafted Jewellery &amp; Artefacts</h3>
                    <p className="profile-card-desc">
                      Businesses presenting handmade jewellery, silverware, silver idols, corporate gifts, and traditional houseware.
                    </p>
                    <div className="profile-card-tags">
                      <span className="profile-tag">Silverware</span>
                      <span className="profile-tag">Silver Idols</span>
                      <span className="profile-tag">Corporate Gifting</span>
                    </div>
                  </div>

                  <div className="profile-card">
                    <span className="profile-badge-pill blue">ALLIED &amp; TECH</span>
                    <h3 className="profile-card-title font-serif">Packaging &amp; Technology Allied Partners</h3>
                    <p className="profile-card-desc">
                      Machinery, 3D casting equipment, laser hallmark solutions, and luxury jewellery display cases for the silver ecosystem.
                    </p>
                    <div className="profile-card-tags">
                      <span className="profile-tag">Packaging Solutions</span>
                      <span className="profile-tag">Hallmarking Gear</span>
                      <span className="profile-tag">Jewellery Display</span>
                    </div>
                  </div>
                </div>
              </RevealSection>
            </div>
          </div>

          {/* Exhibition Stall Categories & Specifications */}
          <div id="booth-specs" className="portal-content-section au-tinted">
            <div className="container">
              <RevealSection>
                <div className="portal-section-head">
                  <span className="portal-section-kicker">STALL PACKAGES</span>
                  <h2 className="portal-section-title font-serif">Exhibition Stall Packages</h2>
                  <p className="portal-section-subtitle">Flexible booth configurations built to elevate your brand presence at Birla Auditorium.</p>
                </div>

                <div className="portal-cards-grid three-col">
                  <div className="portal-capsule-card featured-stall">
                    <div className="stall-badge-pill">MOST POPULAR</div>
                    <div className="stall-size font-serif">9 sq.m / 18 sq.m</div>
                    <h3 className="stall-name">Standard Shell Scheme</h3>
                    <p className="stall-desc">Turnkey octanorm booth fully equipped for instant retail &amp; wholesale showcase.</p>
                    <ul className="stall-perks-list">
                      <li><CheckCircle2 size={15} className="check-ico" /> <span>Octanorm modular walls &amp; company fascia board</span></li>
                      <li><CheckCircle2 size={15} className="check-ico" /> <span>Spotlight fixtures &amp; multi-power sockets</span></li>
                      <li><CheckCircle2 size={15} className="check-ico" /> <span>Lockable glass display counters &amp; chairs</span></li>
                      <li><CheckCircle2 size={15} className="check-ico" /> <span>Complimentary exhibitor access passes</span></li>
                    </ul>
                    <button onClick={() => goToRegister('exhibitor')} className="btn-stall-select">
                      <span>Reserve Shell Scheme</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>

                  <div className="portal-capsule-card">
                    <div className="stall-badge-pill premium">FLAGSHIP SPACE</div>
                    <div className="stall-size font-serif">36 sq.m – 72 sq.m</div>
                    <h3 className="stall-name">Bare / Island Pavilion</h3>
                    <p className="stall-desc">Complete architectural freedom for custom mezzanine &amp; luxury brand design.</p>
                    <ul className="stall-perks-list">
                      <li><CheckCircle2 size={15} className="check-ico" /> <span>4-side open or 3-side open prime corner locations</span></li>
                      <li><CheckCircle2 size={15} className="check-ico" /> <span>Dedicated high-capacity industrial power load</span></li>
                      <li><CheckCircle2 size={15} className="check-ico" /> <span>Priority buyer lounge reservations &amp; catering</span></li>
                      <li><CheckCircle2 size={15} className="check-ico" /> <span>Maximum badge allotment &amp; directory feature</span></li>
                    </ul>
                    <button onClick={() => goToRegister('exhibitor')} className="btn-stall-select">
                      <span>Request Bare Space</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>

                  <div className="portal-capsule-card">
                    <div className="stall-badge-pill craft">HERITAGE SUBSIDY</div>
                    <div className="stall-size font-serif">Artisan Pavilion</div>
                    <h3 className="stall-name">Master Karigar Pod</h3>
                    <p className="stall-desc">Subsidized collective space dedicated to traditional Jaipur filigree &amp; heritage silversmiths.</p>
                    <ul className="stall-perks-list">
                      <li><CheckCircle2 size={15} className="check-ico" /> <span>Curated showcase for certified handmade silver</span></li>
                      <li><CheckCircle2 size={15} className="check-ico" /> <span>Subsidized booth pricing supported by JSA</span></li>
                      <li><CheckCircle2 size={15} className="check-ico" /> <span>Direct exposure to pan-India boutique retail buyers</span></li>
                      <li><CheckCircle2 size={15} className="check-ico" /> <span>Artisan recognition &amp; promotional highlight</span></li>
                    </ul>
                    <button onClick={() => goToRegister('exhibitor')} className="btn-stall-select">
                      <span>Apply as Artisan</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              </RevealSection>
            </div>
          </div>

          {/* Official Leadership Perspectives from Brochure Page 3 */}
          <div className="portal-content-section">
            <div className="container">
              <RevealSection>
                <div className="portal-section-head">
                  <span className="portal-section-kicker">LEADERSHIP VOICES</span>
                  <h2 className="portal-section-title font-serif">Leadership Messages for Exhibitors</h2>
                  <p className="portal-section-subtitle">Words of encouragement and vision from the key leaders of Jaipur Silver Association.</p>
                </div>

                <div className="portal-quotes-grid">
                  <div className="quote-leader-card">
                    <div className="quote-leader-head">
                      <img 
                        src="/ujjwal_derewala.jpg" 
                        alt="Ujjwal Derewala" 
                        className="quote-leader-avatar" 
                      />
                      <div className="quote-leader-meta">
                        <span className="quote-leader-name">Ujjwal Derewala</span>
                        <span className="quote-leader-role">Chairman</span>
                      </div>
                    </div>
                    <p className="quote-leader-text">
                      "Jaipur Silver Association proudly presents a platform that reflects the true strength of Jaipur as the Silver Hub of India. Our vision is to create unmatched business opportunities and global exposure for the silver industry."
                    </p>
                  </div>

                  <div className="quote-leader-card">
                    <div className="quote-leader-head">
                      <img 
                        src="/rahul_jain.jpg" 
                        alt="Rahul Jain" 
                        className="quote-leader-avatar" 
                      />
                      <div className="quote-leader-meta">
                        <span className="quote-leader-name">Rahul Jain</span>
                        <span className="quote-leader-role">Hony. Secretary</span>
                      </div>
                    </div>
                    <p className="quote-leader-text">
                      "We are committed to delivering a well-organised and impactful show experience for exhibitors and visitors alike. JSA continues to build strong connections and drive growth in the silver trade."
                    </p>
                  </div>

                  <div className="quote-leader-card">
                    <div className="quote-leader-head">
                      <img 
                        src="/dr_arun_garg.jpg" 
                        alt="Dr. Arun Garg" 
                        className="quote-leader-avatar" 
                      />
                      <div className="quote-leader-meta">
                        <span className="quote-leader-name">Dr. Arun Garg</span>
                        <span className="quote-leader-role">Convenor</span>
                      </div>
                    </div>
                    <p className="quote-leader-text">
                      "Our focus is to ensure seamless execution and maximum value for every participant. This show is designed to bring innovation, networking, and new opportunities together."
                    </p>
                  </div>

                  <div className="quote-leader-card">
                    <div className="quote-leader-head">
                      <img 
                        src="/smt_anita_dhingra.jpg" 
                        alt="Smt. Anita Dhingra" 
                        className="quote-leader-avatar" 
                      />
                      <div className="quote-leader-meta">
                        <span className="quote-leader-name">Smt. Anita Dhingra</span>
                        <span className="quote-leader-role">Convenor</span>
                      </div>
                    </div>
                    <p className="quote-leader-text">
                      "We aim to create a dynamic and inspiring environment for all stakeholders. JSA Show will showcase the finest craftsmanship and strengthen Jaipur's identity as the Silver Hub of India."
                    </p>
                  </div>
                </div>

                {/* Legacy Banner Callout */}
                <div className="portal-callout-banner">
                  <div className="portal-callout-banner-content">
                    <span className="portal-section-kicker" style={{ marginBottom: '0.4rem' }}>FUTURE ROADMAP</span>
                    <h3 className="font-serif">The Legacy Continues • JSA Silver Show 2027</h3>
                    <p>Mark your dates for next year: 12-13-14 November 2027 in Jaipur. Official logistics powered by Secure Global Logistics.</p>
                  </div>
                  <button onClick={() => goToRegister('exhibitor')} className="btn-portal-primary" style={{ flexShrink: 0 }}>
                    <span>Register 2026 Booth</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </RevealSection>
            </div>
          </div>

          {/* Exhibitor Operational Timeline */}
          <div className="portal-content-section au-tinted">
            <div className="container">
              <RevealSection>
                <div className="portal-section-head">
                  <span className="portal-section-kicker">KEY DEADLINES</span>
                  <h2 className="portal-section-title font-serif">Exhibitor Timeline &amp; Possession</h2>
                  <p className="portal-section-subtitle">Critical milestones to ensure effortless setup, vaulting, and exhibition operations.</p>
                </div>

                <div className="portal-timeline-stack">
                  <div className="timeline-capsule-row">
                    <div className="timeline-date-capsule">
                      <Calendar size={15} />
                      <span>21 NOV • 09:00 AM</span>
                    </div>
                    <div className="timeline-info-box">
                      <h4 className="timeline-h4 font-serif">Booth Handover &amp; Decoration Setup</h4>
                      <p className="timeline-p">
                        Exhibitors can take physical possession of allocated stalls at Birla Auditorium. Display arrangements, branding posters, and lighting fixtures must be completed by 8:00 PM.
                      </p>
                    </div>
                  </div>

                  <div className="timeline-capsule-row">
                    <div className="timeline-date-capsule">
                      <Lock size={15} />
                      <span>21 NOV • 06:00 PM</span>
                    </div>
                    <div className="timeline-info-box">
                      <h4 className="timeline-h4 font-serif">Vaulting Deposit Window Opens</h4>
                      <p className="timeline-p">
                        Complimentary on-site armed vault opens for overnight jewelry safe-keeping. Strict dual-custody verification slips will be issued for overnight stock.
                      </p>
                    </div>
                  </div>

                  <div className="timeline-capsule-row highlight">
                    <div className="timeline-date-capsule pink">
                      <Sparkles size={15} />
                      <span>22 – 24 NOV • 10:00 AM</span>
                    </div>
                    <div className="timeline-info-box">
                      <h4 className="timeline-h4 font-serif">Exhibition Open to Trade Buyers</h4>
                      <p className="timeline-p">
                        Three full days of high-velocity wholesale dealmaking, sourcing meetings, and bullion transactions across Hall A, B, and C.
                      </p>
                    </div>
                  </div>

                  <div className="timeline-capsule-row">
                    <div className="timeline-date-capsule">
                      <Clock size={15} />
                      <span>24 NOV • 07:30 PM</span>
                    </div>
                    <div className="timeline-info-box">
                      <h4 className="timeline-h4 font-serif">Show Conclusion &amp; Stock Clearance</h4>
                      <p className="timeline-p">
                        Official packing and booth hand-back protocol starts under security surveillance. Gate passes will be stamped upon verification of exhibition clearances.
                      </p>
                    </div>
                  </div>
                </div>
              </RevealSection>
            </div>
          </div>

          {/* Exclusive Exhibitor Amenities */}
          <div className="portal-content-section">
            <div className="container">
              <RevealSection>
                <div className="portal-section-head">
                  <span className="portal-section-kicker">PREMIUM INFRASTRUCTURE</span>
                  <h2 className="portal-section-title font-serif">Exhibitor Privileges &amp; Security</h2>
                  <p className="portal-section-subtitle">World-class facilities engineered for seamless high-value silver transactions.</p>
                </div>

                <div className="portal-amenities-grid">
                  <div className="amenity-capsule-card">
                    <div className="amenity-ico-wrap"><Lock size={24} /></div>
                    <h3 className="amenity-title">24/7 Armed Guarded Vaults</h3>
                    <p className="amenity-desc">Complimentary reinforced vaulting facility inside Birla Auditorium with CCTV recording and dual-key custody.</p>
                  </div>

                  <div className="amenity-capsule-card">
                    <div className="amenity-ico-wrap"><Coffee size={24} /></div>
                    <h3 className="amenity-title">VIP B2B Sourcing Lounge</h3>
                    <p className="amenity-desc">Air-conditioned private meeting pods with high-speed WiFi and refreshments to finalize large bulk retail orders.</p>
                  </div>

                  <div className="amenity-capsule-card">
                    <div className="amenity-ico-wrap"><BadgeCheck size={24} /></div>
                    <h3 className="amenity-title">Express Badge Clearance</h3>
                    <p className="amenity-desc">Dedicated exhibitor badge registration counters for you and your staff with immediate barcode laminate issuance.</p>
                  </div>

                  <div className="amenity-capsule-card">
                    <div className="amenity-ico-wrap"><Globe2 size={24} /></div>
                    <h3 className="amenity-title">National Buyer Directory</h3>
                    <p className="amenity-desc">Your company details published in the official JSA 2026 Directory distributed to top jewelry chains across India.</p>
                  </div>
                </div>
              </RevealSection>
            </div>
          </div>

          {/* Bottom High-Converting CTA Capsule */}
          <div className="portal-cta-wrap">
            <div className="container">
              <div className="portal-cta-capsule">
                <div className="portal-cta-text">
                  <span className="cta-kicker">CONNECT TO GROWTH</span>
                  <h2 className="cta-h2 font-serif">Ready to Exhibit at Jaipur Silver Show 2026?</h2>
                  <p className="cta-p">Submit your space intent now to lock your preferred booth location and connect with pan-India retail buyers.</p>
                </div>
                <div className="portal-cta-actions">
                  <button onClick={() => goToRegister('exhibitor')} className="btn-cta-primary">
                    <span>Submit Exhibitor Intent Form</span>
                    <ArrowRight size={15} />
                  </button>
                  <button onClick={() => setCurrentPage('contact')} className="btn-cta-secondary">
                    <span>Talk to Show Secretariat</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      )}

      {/* ========================================================
          PAGE 4: TRADE VISITORS PORTAL & PROFILE (BROCHURE ACCREDITED)
          ======================================================== */}
      {currentPage === 'visitor-alerts' && (
        <main className="page-content visitor-page-root">
          {/* Hero Header */}
          <div className="portal-hero-capsule visitor-hero">
            <div className="container">
              <RevealSection>
                <div className="portal-hero-content">
                  <span className="portal-pill-badge visitor-badge">
                    <Sparkles size={14} />
                    <span>COMPLIMENTARY TRADE ACCREDITATION • JSA 2026</span>
                  </span>
                  <h1 className="portal-hero-title font-serif">
                    Visitors Profile &amp; Express Pass
                  </h1>
                  <p className="portal-hero-lead">
                    Connect directly with India's leading silver jewelry manufacturers, wholesalers, and master artisans under one roof at Birla Auditorium, Jaipur.
                  </p>
                  <div className="portal-hero-actions">
                    <button 
                      onClick={() => goToRegister('visitor')}
                      className="btn-portal-primary"
                    >
                      <BadgeCheck size={16} />
                      <span>GET FREE VISITOR PASS (INSTANT QR)</span>
                      <ArrowRight size={14} />
                    </button>
                    <a 
                      href="#visitor-profiles" 
                      className="btn-portal-secondary"
                    >
                      <LayoutGrid size={15} />
                      <span>EXPLORE VISITOR PROFILES</span>
                    </a>
                  </div>
                </div>
              </RevealSection>
            </div>
          </div>

          {/* Quick Metrics Strip */}
          <div className="portal-metrics-section">
            <div className="container">
              <RevealSection>
                <div className="portal-metrics-grid">
                  <div className="metric-capsule-item">
                    <div className="metric-num font-serif">FREE</div>
                    <div className="metric-label">Complimentary Trade Entry Pass</div>
                  </div>
                  <div className="metric-capsule-item">
                    <div className="metric-num font-serif">300+</div>
                    <div className="metric-label">Designer Exhibition Booths</div>
                  </div>
                  <div className="metric-capsule-item">
                    <div className="metric-num font-serif">Direct</div>
                    <div className="metric-label">Manufacturer Wholesale Sourcing</div>
                  </div>
                  <div className="metric-capsule-item">
                    <div className="metric-num font-serif">Instant</div>
                    <div className="metric-label">Digital QR Pass on Mobile</div>
                  </div>
                </div>
              </RevealSection>
            </div>
          </div>

          {/* Core Feature: Visitors Profile (from Official Brochure Page 3) */}
          <div id="visitor-profiles" className="portal-content-section">
            <div className="container">
              <RevealSection>
                <div className="portal-section-head">
                  <span className="portal-section-kicker">TARGET AUDIENCE</span>
                  <h2 className="portal-section-title font-serif">Visitors Profile</h2>
                  <p className="portal-section-subtitle">Who should attend — curated categories of trade buyers and industry decision-makers visiting the show.</p>
                </div>

                <div className="portal-profile-grid">
                  {/* Retailers & Large-Scale Buyers */}
                  <div className="profile-card">
                    <span className="profile-badge-pill pink">RETAIL BUYERS</span>
                    <h3 className="profile-card-title font-serif">Jewellery Showroom Owners</h3>
                    <p className="profile-card-desc">
                      Retailers expanding their inventories with 925 sterling silver, silver artefacts, and utensils.
                    </p>
                    <div className="profile-card-tags">
                      <span className="profile-tag">Showroom Chains</span>
                      <span className="profile-tag">925 Sterling</span>
                      <span className="profile-tag">Utensils &amp; Gifts</span>
                    </div>
                  </div>

                  <div className="profile-card">
                    <span className="profile-badge-pill pink">LIFESTYLE</span>
                    <h3 className="profile-card-title font-serif">Boutique &amp; Lifestyle Store Owners</h3>
                    <p className="profile-card-desc">
                      Curators sourcing contemporary fusion jewellery, silver-accented handbags, and designer watches.
                    </p>
                    <div className="profile-card-tags">
                      <span className="profile-tag">Fashion Boutiques</span>
                      <span className="profile-tag">Designer Watches</span>
                      <span className="profile-tag">Fusion Jewellery</span>
                    </div>
                  </div>

                  <div className="profile-card">
                    <span className="profile-badge-pill pink">RETAIL CHAINS</span>
                    <h3 className="profile-card-title font-serif">Departmental Store Buyers</h3>
                    <p className="profile-card-desc">
                      Category managers from major retail chains looking for corporate silver gifts and festive silverware.
                    </p>
                    <div className="profile-card-tags">
                      <span className="profile-tag">Corporate Gifts</span>
                      <span className="profile-tag">Festive Silver</span>
                      <span className="profile-tag">Retail Chains</span>
                    </div>
                  </div>

                  <div className="profile-card">
                    <span className="profile-badge-pill pink">DIGITAL CHANNELS</span>
                    <h3 className="profile-card-title font-serif">E-commerce &amp; Online Sellers</h3>
                    <p className="profile-card-desc">
                      Digital brands and marketplace sellers searching for trending, lightweight silver ornaments for online retail.
                    </p>
                    <div className="profile-card-tags">
                      <span className="profile-tag">Lightweight Silver</span>
                      <span className="profile-tag">Online Marketplaces</span>
                      <span className="profile-tag">D2C Brands</span>
                    </div>
                  </div>

                  {/* Wholesalers & Trade Intermediaries */}
                  <div className="profile-card">
                    <span className="profile-badge-pill blue">WHOLESALE</span>
                    <h3 className="profile-card-title font-serif">Silver Jewellery Wholesalers</h3>
                    <p className="profile-card-desc">
                      Bulk buyers looking to establish direct sourcing channels with manufacturers from Jaipur and other craft hubs.
                    </p>
                    <div className="profile-card-tags">
                      <span className="profile-tag">Direct Factory Sourcing</span>
                      <span className="profile-tag">Jaipur Craft Hubs</span>
                      <span className="profile-tag">Volume Pricing</span>
                    </div>
                  </div>

                  <div className="profile-card">
                    <span className="profile-badge-pill blue">GLOBAL TRADE</span>
                    <h3 className="profile-card-title font-serif">Importers &amp; Exporters</h3>
                    <p className="profile-card-desc">
                      International trading houses procuring traditional Indian handcrafted silver for global markets.
                    </p>
                    <div className="profile-card-tags">
                      <span className="profile-tag">Export Houses</span>
                      <span className="profile-tag">Global Markets</span>
                      <span className="profile-tag">Handcrafted Silver</span>
                    </div>
                  </div>

                  <div className="profile-card">
                    <span className="profile-badge-pill blue">DISTRIBUTION</span>
                    <h3 className="profile-card-title font-serif">Distributors &amp; Commission Agents</h3>
                    <p className="profile-card-desc">
                      Middlemen supplying regional markets and local independent retail shops across India.
                    </p>
                    <div className="profile-card-tags">
                      <span className="profile-tag">Regional Distribution</span>
                      <span className="profile-tag">Supply Networks</span>
                      <span className="profile-tag">Retail Connect</span>
                    </div>
                  </div>

                  {/* Design & Corporate Professionals */}
                  <div className="profile-card">
                    <span className="profile-badge-pill gold">DESIGN</span>
                    <h3 className="profile-card-title font-serif">Jewellery Designers &amp; Consultants</h3>
                    <p className="profile-card-desc">
                      Professionals tracking upcoming trends, silver purity innovations, and manufacturing techniques.
                    </p>
                    <div className="profile-card-tags">
                      <span className="profile-tag">Trend Forecasting</span>
                      <span className="profile-tag">Purity Innovations</span>
                      <span className="profile-tag">CAD &amp; Design</span>
                    </div>
                  </div>

                  <div className="profile-card">
                    <span className="profile-badge-pill gold">CORPORATE</span>
                    <h3 className="profile-card-title font-serif">Corporate Gift Buyers</h3>
                    <p className="profile-card-desc">
                      Procurement managers from corporate firms sourcing premium silver corporate tokens, coins, and custom artefacts.
                    </p>
                    <div className="profile-card-tags">
                      <span className="profile-tag">Silver Coins</span>
                      <span className="profile-tag">Custom Tokens</span>
                      <span className="profile-tag">Executive Gifting</span>
                    </div>
                  </div>

                  <div className="profile-card">
                    <span className="profile-badge-pill gold">FASHION</span>
                    <h3 className="profile-card-title font-serif">Fashion Stylists &amp; Influencers</h3>
                    <p className="profile-card-desc">
                      Creative professionals sourcing statement silver pieces for media, films, and runway styling.
                    </p>
                    <div className="profile-card-tags">
                      <span className="profile-tag">Runway Styling</span>
                      <span className="profile-tag">Media &amp; Films</span>
                      <span className="profile-tag">Statement Jewellery</span>
                    </div>
                  </div>

                  {/* Industry Influencers & Institutions */}
                  <div className="profile-card">
                    <span className="profile-badge-pill purple">INSTITUTIONAL</span>
                    <h3 className="profile-card-title font-serif">Buying Houses &amp; Sourcing Agents</h3>
                    <p className="profile-card-desc">
                      Representatives acting on behalf of major international brands and global retail conglomerates.
                    </p>
                    <div className="profile-card-tags">
                      <span className="profile-tag">Global Conglomerates</span>
                      <span className="profile-tag">Sourcing Delegations</span>
                      <span className="profile-tag">Quality Audits</span>
                    </div>
                  </div>

                  <div className="profile-card">
                    <span className="profile-badge-pill purple">ASSOCIATIONS</span>
                    <h3 className="profile-card-title font-serif">Trade Association Delegations</h3>
                    <p className="profile-card-desc">
                      Organised groups of buyers from regional gemstone, silver, and gold associations across India.
                    </p>
                    <div className="profile-card-tags">
                      <span className="profile-tag">Regional Associations</span>
                      <span className="profile-tag">Pan-India Buyers</span>
                      <span className="profile-tag">B2B Delegations</span>
                    </div>
                  </div>

                  <div className="profile-card">
                    <span className="profile-badge-pill purple">ACADEMIA</span>
                    <h3 className="profile-card-title font-serif">Students &amp; Academicians</h3>
                    <p className="profile-card-desc">
                      Advanced students from prominent gemological and design institutes studying silver craftsmanship.
                    </p>
                    <div className="profile-card-tags">
                      <span className="profile-tag">Design Institutes</span>
                      <span className="profile-tag">Gemology Scholars</span>
                      <span className="profile-tag">Master Craftsmanship</span>
                    </div>
                  </div>
                </div>
              </RevealSection>
            </div>
          </div>

          {/* Exhibition Halls Breakdown */}
          <div id="visitor-halls" className="portal-content-section au-tinted">
            <div className="container">
              <RevealSection>
                <div className="portal-section-head">
                  <span className="portal-section-kicker">SOURCING DIRECTORY</span>
                  <h2 className="portal-section-title font-serif">What You Will Discover Across 3 Halls</h2>
                  <p className="portal-section-subtitle">Curated zones spanning handcrafted royal heirlooms to high-tech casting innovations.</p>
                </div>

                <div className="portal-cards-grid three-col">
                  <div className="portal-capsule-card hall-card-a">
                    <div className="hall-tag-capsule pill-a">HALL A</div>
                    <h3 className="hall-card-name font-serif">Fine &amp; Royal Jewellery</h3>
                    <p className="hall-card-desc">Bridal silver sets, antique kundan jadau, intricate filigree, temple ornaments, and 925 sterling daily wear.</p>
                    <div className="hall-card-highlights">
                      <span className="highlight-pill">Antique Filigree</span>
                      <span className="highlight-pill">Bridal Necklaces</span>
                      <span className="highlight-pill">Sterling CZ Lines</span>
                      <span className="highlight-pill">Export Collections</span>
                    </div>
                  </div>

                  <div className="portal-capsule-card hall-card-b">
                    <div className="hall-tag-capsule pill-b">HALL B</div>
                    <h3 className="hall-card-name font-serif">Artifacts &amp; Silverware</h3>
                    <p className="hall-card-desc">Royal dinnerware, hand-carved temple idols, ceremonial pooja silver, commemorative coins, and corporate gifting.</p>
                    <div className="hall-card-highlights">
                      <span className="highlight-pill">Royal Dinner Sets</span>
                      <span className="highlight-pill">Temple Idols</span>
                      <span className="highlight-pill">Bullion Coins</span>
                      <span className="highlight-pill">Corporate Gifting</span>
                    </div>
                  </div>

                  <div className="portal-capsule-card hall-card-c">
                    <div className="hall-tag-capsule pill-c">HALL C</div>
                    <h3 className="hall-card-name font-serif">Machinery &amp; Allied Tech</h3>
                    <p className="hall-card-desc">Laser soldering, 3D wax printers, induction casting furnaces, purity spectrometers, and packaging equipment.</p>
                    <div className="hall-card-highlights">
                      <span className="highlight-pill">Laser Welding</span>
                      <span className="highlight-pill">3D CAD Casting</span>
                      <span className="highlight-pill">XRF Spectrometers</span>
                      <span className="highlight-pill">Packaging &amp; Trays</span>
                    </div>
                  </div>
                </div>
              </RevealSection>
            </div>
          </div>

          {/* Visiting Protocol & Essential Guidelines */}
          <div className="portal-content-section">
            <div className="container">
              <RevealSection>
                <div className="portal-section-head">
                  <span className="portal-section-kicker">VISITING GUIDELINES</span>
                  <h2 className="portal-section-title font-serif">Entry Schedule &amp; Gates</h2>
                  <p className="portal-section-subtitle">Smooth entry procedures for trade delegates, sourcing professionals, and store owners.</p>
                </div>

                <div className="portal-timeline-stack">
                  <div className="timeline-capsule-row">
                    <div className="timeline-date-capsule">
                      <Calendar size={15} />
                      <span>22 – 24 NOV 2026</span>
                    </div>
                    <div className="timeline-info-box">
                      <h4 className="timeline-h4 font-serif">Dates &amp; Exhibition Visiting Hours</h4>
                      <p className="timeline-p">
                        Open daily from <strong>10:00 AM to 07:00 PM</strong> at Birla Auditorium, Jaipur. Sourcing lounges and live trading pavilions remain active all three days.
                      </p>
                    </div>
                  </div>

                  <div className="timeline-capsule-row">
                    <div className="timeline-date-capsule">
                      <MapPin size={15} />
                      <span>GATE 1 &amp; GATE 2</span>
                    </div>
                    <div className="timeline-info-box">
                      <h4 className="timeline-h4 font-serif">Birla Auditorium Entry Points</h4>
                      <p className="timeline-p">
                        Accredited visitors can access through Gate 1 (Statue Circle Main Gate) or Gate 2 (Bhawani Singh Marg). Dedicated badge printing kiosks are positioned at both foyers.
                      </p>
                    </div>
                  </div>

                  <div className="timeline-capsule-row highlight">
                    <div className="timeline-date-capsule pink">
                      <BadgeCheck size={15} />
                      <span>DIGITAL QR PASS</span>
                    </div>
                    <div className="timeline-info-box">
                      <h4 className="timeline-h4 font-serif">15-Second Instant Badge Handover</h4>
                      <p className="timeline-p">
                        Pre-registered visitors show their digital mobile QR code at Counter #4 or Self-Scan Kiosk for instant visitor lanyard printing with zero queue waiting.
                      </p>
                    </div>
                  </div>

                  <div className="timeline-capsule-row">
                    <div className="timeline-date-capsule">
                      <ShieldCheck size={15} />
                      <span>BUSINESS ID MANDATORY</span>
                    </div>
                    <div className="timeline-info-box">
                      <h4 className="timeline-h4 font-serif">Trade Accreditation Verification</h4>
                      <p className="timeline-p">
                        Please carry your business card (visiting card) or GST registration copy, along with an official government photo ID (Aadhar / PAN / Driving License).
                      </p>
                    </div>
                  </div>
                </div>
              </RevealSection>
            </div>
          </div>

          {/* Visitor Hospitality & Amenities */}
          <div className="portal-content-section au-tinted">
            <div className="container">
              <RevealSection>
                <div className="portal-section-head">
                  <span className="portal-section-kicker">HOSPITALITY</span>
                  <h2 className="portal-section-title font-serif">Visitor Hospitality &amp; Services</h2>
                  <p className="portal-section-subtitle">Engineered to make your sourcing trip productive, comfortable, and secure.</p>
                </div>

                <div className="portal-amenities-grid">
                  <div className="amenity-capsule-card">
                    <div className="amenity-ico-wrap"><Car size={24} /></div>
                    <h3 className="amenity-title">Complimentary Valet Parking</h3>
                    <p className="amenity-desc">Hassle-free parking inside Birla Auditorium grounds for all pre-registered trade delegates.</p>
                  </div>

                  <div className="amenity-capsule-card">
                    <div className="amenity-ico-wrap"><Coffee size={24} /></div>
                    <h3 className="amenity-title">B2B Trade Lounges &amp; Cafes</h3>
                    <p className="amenity-desc">Relaxed seating zones with complimentary beverages for in-depth commercial negotiations.</p>
                  </div>

                  <div className="amenity-capsule-card">
                    <div className="amenity-ico-wrap"><Scale size={24} /></div>
                    <h3 className="amenity-title">Spot Purity Testing Desk</h3>
                    <p className="amenity-desc">Free government standard purity testing on-site to verify 925 and 999 authenticity on purchases.</p>
                  </div>

                  <div className="amenity-capsule-card">
                    <div className="amenity-ico-wrap"><Building size={24} /></div>
                    <h3 className="amenity-title">Secure Insured Cargo Desks</h3>
                    <p className="amenity-desc">On-site secure logistics and express transit services (Secure Global Logistics) for wholesale stock transport.</p>
                  </div>
                </div>
              </RevealSection>
            </div>
          </div>

          {/* Bottom High-Converting CTA Capsule */}
          <div className="portal-cta-wrap">
            <div className="container">
              <div className="portal-cta-capsule">
                <div className="portal-cta-text">
                  <span className="cta-kicker">DIRECT B2B ACCESS</span>
                  <h2 className="cta-h2 font-serif">Pre-Register for Your Free Visitor Pass</h2>
                  <p className="cta-p">Skip on-site lines and receive your instant digital badge directly on WhatsApp/Email.</p>
                </div>
                <div className="portal-cta-actions">
                  <button onClick={() => goToRegister('visitor')} className="btn-cta-primary">
                    <span>Register as Visitor (Free)</span>
                    <ArrowRight size={15} />
                  </button>
                  <button onClick={() => setCurrentPage('contact')} className="btn-cta-secondary">
                    <span>Contact Visitor Helpdesk</span>
                  </button>
                </div>
              </div>
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

      {/* ========================================================
          PAGE 6: DEDICATED CONTACT US
          ======================================================== */}
      {currentPage === 'contact' && (
        <main className="page-content">
          <ContactPage 
            onGoHome={() => setCurrentPage('home')}
            onGoToRegister={goToRegister}
          />
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
                  onClick={() => goToRegister('visitor')}
                  className="btn-cta-primary"
                >
                  <span>Register as Visitor (Free Pass)</span>
                  <ArrowRight size={16} />
                </button>
                <button 
                  onClick={() => goToRegister('exhibitor')} 
                  className="btn-cta-secondary"
                >
                  <span>Book a Booth / Exhibitor Intent</span>
                  <ArrowUpRight size={15} />
                </button>
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
                <li><button onClick={() => goToRegister('visitor')}>Visitor Pass Registration</button></li>
                <li><button onClick={() => goToRegister('exhibitor')}>Exhibitor Intent Form</button></li>
                <li><button onClick={() => goToRegister('exhibitor')}>Booths & Floor Plan</button></li>
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
                <li><button onClick={() => setCurrentPage('contact')}>Contact Us Helpdesk</button></li>
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
    </div>
  );
}
