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

import ContactPage from './ContactPage';
import SponsorshipPage from './SponsorshipPage';

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
function CounterNumber({ endValue, duration = 2000, suffix = "+", suffixClassName = "" }) {
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
      {count.toLocaleString('en-IN')}
      {suffix && (
        <span className={`counter-suffix ${suffixClassName}`.trim()}>
          {suffix}
        </span>
      )}
    </span>
  );
}

const SUPPORTING_ASSOCIATIONS = [
  { name: 'SH. RAJESH ROKDE', role: 'CHAIRMAN, GJC' },
  { name: 'SH. AVINASH GUPTA', role: 'VICE CHAIRMAN, GJC' },
  { name: 'SH. RAJU MANGODIWALA', role: 'PRESIDENT, JEWELLERS ASSOCIATION JAIPUR' },
  { name: 'SH. KAILASH MITTAL', role: 'PRESIDENT, SARAFA TRADERS COMMITTEE, JAIPUR' },
  { name: 'SH. DULI CHAND KAREL', role: 'CHAIRMAN, BHARTIYA SWARNKAR SANGH' },
  { name: 'SH. KASHMIR SINGH RAJPUT', role: 'NATIONAL PRESIDENT, AKHIL BHARTIYA SWARNKAR SANGH' },
  { name: 'SH. JAYANTILAL CHALLANI', role: 'PRESIDENT, JEWELLERS AND DIAMOND ASSOCIATION MADRAS' },
  { name: 'SH. PV JOSE', role: 'CHIEF PATRON, JEWELLERY MANUFACTURERS ASSOCIATION, KERALA' },
  { name: 'SH. NITESH AGARWAL', role: 'PRESIDENT, AGRA SARAFA ASSOCIATION' },
  { name: 'SH. RAJESH TEJPAL RATHOD', role: 'PRESIDENT, KOLHAPUR SARAF VYAPARI SANGH' },
  { name: 'SH. SURYA PRAKASH GUPTA', role: 'PRESIDENT, BADAUN SARAFA ASSOCIATION' },
  { name: 'SH. RAM AVTAR VERMA', role: 'CHAIRMAN, TBJA DELHI' },
  { name: 'SH. ANIL SINGHAL', role: 'PRESIDENT, NORTH DELHI JEWELLERS ASSOCIATION' },
  { name: 'SH. RAJIV SHAHDEV', role: 'PRESIDENT, CHANDIGARH JEWELLERS ASSOCIATION' },
  { name: 'SH. VARUN SURAJ CHAUHAN', role: 'PRESIDENT, CHANDIGARH SARAFA ASSOCIATION' },
  { name: 'SH. MANISH KUMAR VERMA', role: 'PRESIDENT, LUCKNOW MAHANAGAR SARAFA ASSOCIATION' },
  { name: 'SH. BASHIR ALI', role: 'PRESIDENT, ALL KASHMIR GOLD DEALERS ASSOCIATION' },
  { name: 'SH. MAYANK KAPOOR', role: 'PRESIDENT, JAMMU JEWELLER ASSOCIATION' },
  { name: 'SH. RAJKUMAR AGARWAL', role: 'PRESIDENT, BAREILLY SARAFA ASSOCIATION' },
  { name: 'SH. ANAND RATHI', role: 'CHIEF PATRON, SARAFA COMMITTEE, KOTA' },
  { name: 'SH. MOJI NUVAL', role: 'PRESIDENT, SHRI SARAFA SANSTHAN BUNDI' },
  { name: 'SH. YASHWANT ANCHLIYA', role: 'PRESIDENT, SARAFA ASSOCIATION UDAIPUR' },
  { name: 'SH. LALIT SONI', role: 'PRESIDENT, GEMS AND JEWELLERY HANDICRAFT SWARNKAR SANGH' },
  { name: 'SH. JAIN SAMPATLAL KHABYA', role: 'PRESIDENT, DAGINA ASSOCIATION, AHMEDABAD' },
  { name: 'SH. RAVI SHANKAR GAURI', role: 'PRESIDENT, GOLD MERCHANT ASSOCIATION SATNA' },
  { name: 'SH. ANAND SONI', role: 'PRESIDENT, BHOPAL SARAFA ASSOCIATION' },
  { name: 'SH. NARESH BALANI', role: 'CHAIRMAN, JMAIIE' }
];

const EXHIBITORS_LIST = [
  { name: "ARIES", logo: "/logopartners/ARIES/Aries (1).png" },
  { name: "Aadiyogi Jewellers", logo: null },
  { name: "Albeli jewellers", logo: "/logopartners/Albeli jewellers/WhatsApp Image 2026-09-18 at 14.58.12.jpeg" },
  { name: "balaji silver arts", logo: "/logopartners/balaji silver arts/WhatsApp Image 2026-09-23 at 11.33.49 AM.jpeg" },
  { name: "Bhavy Sawariya Jewels", logo: "/logopartners/Bhavy Sawariya Jewels/WhatsApp Image 2026-09-18 at 14.47.24.jpeg" },
  { name: "chandika pearls", logo: "/logopartners/chandika pearls/WhatsApp Image 2026-09-23 at 1.34.14 PM (1).jpeg" },
  { name: "CHHOTI BAI JEWELLERS", logo: "/logopartners/CHHOTI BAI JEWELLERS/CHHOTI BAI LOGO.png" },
  { name: "DBR GEMS", logo: "/logopartners/DBR GEMS/1000019779.jpg.jpeg" },
  { name: "derewala gems and jewellers", logo: null },
  { name: "DIVINE JEWELS", logo: "/logopartners/DIVINE JEWELS/WhatsApp Image 2026-09-22 at 11.51.22.jpeg" },
  { name: "divinity techno solutions", logo: null },
  { name: "FLAUNT JEWELRY", logo: "/logopartners/FLAUNT JEWELRY/WhatsApp Image 2026-09-21 at 17.29.54.jpeg" },
  { name: "Fortune Charms Inc", logo: "/logopartners/Fortune Charms Inc/FCI (1).png" },
  { name: "gems india", logo: "/logopartners/gems india/WhatsApp Image 2026-09-23 at 3.14.18 PM.jpeg" },
  { name: "gomes gems", logo: "/logopartners/gomes gems/2242cbc5-259a-4246-97d4-d36209cf3e53.png" },
  { name: "GP SILVER", logo: "/logopartners/GP SILVER/GP Silvers Logo.png" },
  { name: "HINN THAR HASTSHILP", logo: "/logopartners/HINN THAR HASTSHILP/WhatsApp Image 2026-09-23 at 3.03.40 PM (1).jpeg" },
  { name: "J P ENTERPRISES", logo: "/logopartners/J P ENTERPRISES/Jashn Logo 3D.png" },
  { name: "jalash", logo: "/logopartners/jalash/Jalash logo.png" },
  { name: "Jawahar international", logo: "/logopartners/Jawahar international/WhatsApp Image 2026-09-18 at 12.41.41.jpeg" },
  { name: "JIVA JEWELLERY", logo: "/logopartners/JIVA JEWELLERY/WhatsApp Image 2026-09-21 at 17.20.11.jpeg" },
  { name: "Kanak Gem & Jewelry", logo: "/logopartners/Kanak Gem & Jewelry/WhatsApp Image 2026-09-18 at 18.01.33.jpeg" },
  { name: "KAPISH SILVER", logo: "/logopartners/KAPISH SILVER/kj  final logo -01.png" },
  { name: "KATTA'S GEMS & JEWELS", logo: "/logopartners/KATTA_S GEMS & JEWELS/Logo Final Jeweler (1).png" },
  { name: "kay luxe", logo: null },
  { name: "koshore motiwala", logo: "/logopartners/koshore motiwala/WhatsApp Image 2026-09-23 at 3.10.44 PM.jpeg" },
  { name: "KRISHNAM JEWELLERS", logo: "/logopartners/KRISHNAM JEWELLERS/WhatsApp Image 2026-09-18 at 12.29.13 PM (14).jpeg" },
  { name: "LAAVI DHURV CREATIONS", logo: "/logopartners/LAAVI DHURV CREATIONS/LDC GOLD logo.png" },
  { name: "LASHKARI EXPORTS", logo: "/logopartners/LASHKARI EXPORTS/WhatsApp Image 2026-09-18 at 12.29.13 PM (19).jpeg" },
  { name: "lohiya's silver galleria pvt ltd", logo: "/logopartners/lohiya_s silver galleria pvt ltd/WhatsApp Image 2026-09-23 at 4.09.08 PM.jpeg" },
  { name: "MAHAL JEWELS", logo: "/logopartners/MAHAL JEWELS/461967710_1679860362796205_4586781853880899257_n.jpg" },
  { name: "Mahaveer Jewellery House", logo: "/logopartners/Mahaveer Jewellery House/Logo 2 png.png" },
  { name: "marvy jewels", logo: "/logopartners/marvy jewels/WhatsApp Image 2026-09-21 at 15.15.27.jpeg" },
  { name: "MORCHANDRIKA HANDICRAFTS", logo: "/logopartners/MORCHANDRIKA HANDICRAFTS/WhatsApp Image 2026-09-18 at 11.44.21.jpeg" },
  { name: "My SILVERATI By MAGS Gems", logo: "/logopartners/My SILVERATI By MAGS Gems/WhatsApp Image 2026-09-18 at 11.50.06.jpeg" },
  { name: "Nobel Gems and Jewels", logo: "/logopartners/Nobel Gems and Jewels/NOBLE ab01 Final File Logo Variation one.png" },
  { name: "PICHOLA PRIVATE LIMITED", logo: "/logopartners/PICHOLA PRIVATE LIMITED/Full Logo - Mauvepink.png" },
  { name: "Ratnavali Arts", logo: "/logopartners/Ratnavali Arts/WhatsApp Image 2026-09-18 at 12.32.07.jpeg" },
  { name: "RAVI JEWELLERS JAIPUR", logo: "/logopartners/RAVI JEWELLERS JAIPUR/Ravi Jewellers New.jpg.jpeg" },
  { name: "riddhi jewel", logo: null },
  { name: "Ridhi Siddhi Gem and Jewellery", logo: null },
  { name: "RK Silver", logo: "/logopartners/RK Silver/Rk Silver Logo.png" },
  { name: "SACHI DESIGN CREATION", logo: "/logopartners/SACHI DESIGN CREATION/Sachi Jaipur - NEW Logo.png" },
  { name: "shimla impex", logo: "/logopartners/shimla impex/WhatsApp Image 2026-09-18 at 12.03.56.jpeg" },
  { name: "SHREE DEREWALA JEWELLERS", logo: "/logopartners/SHREE DEREWALA JEWELLERS/WhatsApp Image 2026-09-18 at 12.29.13 PM (17).jpeg" },
  { name: "SHREE GEMS & JEWELLERS", logo: "/logopartners/SHREE GEMS & JEWELLERS/WhatsApp Image 2026-09-18 at 12.29.13 PM (1).jpeg" },
  { name: "shree jaipur silver", logo: "/logopartners/shree jaipur silver/WhatsApp Image 2026-09-23 at 1.25.55 PM (1).jpeg" },
  { name: "silver source jewellery", logo: null },
  { name: "sumanglam gold creations pvt ltd", logo: null },
  { name: "tarqash jewels", logo: null },
  { name: "Tvasta 925 by Parth Silver Art", logo: "/logopartners/Tvasta 925 by Parth Silver Art/Tvasta Logo.png" },
  { name: "twisha jewels", logo: null },
  { name: "Vinayak Gem and Jewellery", logo: null }
];

const NEWS_EVENTS = [
  {
    image: "/birla-auditorium.jpg",
    tag: "Press Release",
    date: "15 September 2026",
    title: "Grand Launch: JSA Silver Show 2026 Announced at BM Birla Auditorium",
    desc: "JSA Silver Show officially unveils the premier B2B expo roadmap, uniting over 175 leading silver manufacturers and 10,000 national trade buyers."
  },
  {
    image: "/hero-slide-1.jpg",
    tag: "Industry Milestone",
    date: "24 September 2026",
    title: "Nationwide Delegations: 25+ Sarafa Associations Extend Full Charter Support",
    desc: "Apex jewellery bodies and regional Sarafa Sansthans across Delhi, Mumbai, Chennai, and Rajasthan unite to facilitate pan-India retail buyer delegations."
  },
  {
    image: "/hero-slide-2.jpg",
    tag: "Digital Innovation",
    date: "28 September 2026",
    title: "Digital Accreditation & Spot Bullion Tracking Launched for Visitors",
    desc: "Pre-registered trade delegates can now receive verified instant QR passes and real-time Rajasthan silver spot rates directly through our portal."
  }
];

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [galleryFilter, setGalleryFilter] = useState('all');
  const [scrolled, setScrolled] = useState(false);

  const assocScrollRef = useRef(null);
  const exhibitorsScrollRef = useRef(null);
  const newsScrollRef = useRef(null);

  const scrollContainer = (ref, offset) => {
    if (ref.current) {
      ref.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  const FORM_URL = 'https://www.forms.jsasilvershow.com/';

  const goToForm = () => {
    window.location.href = FORM_URL;
  };

  useEffect(() => {
    // Scroll to top whenever page changes
    window.scrollTo(0, 0);
  }, [currentPage]);

  useEffect(() => {
    // Check URL query / hash for contact routes or external form triggers
    const checkRoute = () => {
      const hash = window.location.hash.toLowerCase();
      const path = window.location.pathname.toLowerCase();
      if (
        hash.includes('admin') ||
        path.includes('admin') ||
        hash.includes('register') ||
        path.includes('register')
      ) {
        window.location.href = FORM_URL;
      } else if (hash === '#contact' || hash === '#/contact' || path.includes('contact')) {
        setCurrentPage('contact');
      } else if (hash.includes('sponsor')) {
        setCurrentPage('sponsorship');
      } else if (hash.includes('news')) {
        setCurrentPage('news-events');
      }
    };

    checkRoute();
    window.addEventListener('hashchange', checkRoute);
    return () => window.removeEventListener('hashchange', checkRoute);
  }, []);

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
              Exhibitor
            </button>
            <button 
              className={`island-link ${currentPage === 'visitor-alerts' ? 'active' : ''}`}
              onClick={() => setCurrentPage('visitor-alerts')}
            >
              Visitor
            </button>
            <button 
              className={`island-link ${currentPage === 'gallery' ? 'active' : ''}`}
              onClick={() => setCurrentPage('gallery')}
            >
              Gallery
            </button>
            <button 
              className={`island-link ${currentPage === 'news-events' ? 'active' : ''}`}
              onClick={() => setCurrentPage('news-events')}
            >
              News &amp; Events
            </button>
            <button 
              className={`island-link ${currentPage === 'sponsorship' ? 'active' : ''}`}
              onClick={() => setCurrentPage('sponsorship')}
            >
              Sponsorship Opportunities
            </button>
            <button 
              className={`island-link ${currentPage === 'contact' ? 'active' : ''}`}
              onClick={() => setCurrentPage('contact')}
            >
              Contact Us
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
              onClick={goToForm}
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
              <span>22, 23, 24 NOVEMBER 2026 • BM BIRLA AUDITORIUM, JAIPUR</span>
            </div>
            <div className="drawer-links">
              <button onClick={() => { setCurrentPage('home'); setMobileMenuOpen(false); }} className={currentPage === 'home' ? 'active' : ''}>Home</button>
              <button onClick={() => { setCurrentPage('about'); setMobileMenuOpen(false); }} className={currentPage === 'about' ? 'active' : ''}>About</button>
              <button onClick={() => { setCurrentPage('exhibitor-alerts'); setMobileMenuOpen(false); }} className={currentPage === 'exhibitor-alerts' ? 'active' : ''}>Exhibitor</button>
              <button onClick={() => { setCurrentPage('visitor-alerts'); setMobileMenuOpen(false); }} className={currentPage === 'visitor-alerts' ? 'active' : ''}>Visitor</button>
              <button onClick={() => { setCurrentPage('gallery'); setMobileMenuOpen(false); }} className={currentPage === 'gallery' ? 'active' : ''}>Gallery</button>
              <button onClick={() => { setCurrentPage('news-events'); setMobileMenuOpen(false); }} className={currentPage === 'news-events' ? 'active' : ''}>News &amp; Events</button>
              <button onClick={() => { setCurrentPage('sponsorship'); setMobileMenuOpen(false); }} className={currentPage === 'sponsorship' ? 'active' : ''}>Sponsorship Opportunities</button>
              <button onClick={() => { setCurrentPage('contact'); setMobileMenuOpen(false); }} className={currentPage === 'contact' ? 'active' : ''}>Contact Us</button>
            </div>
            <div className="drawer-cta-stack">
              <button onClick={goToForm} className="btn-solid w-full">Register as Visitor</button>
              <button onClick={goToForm} className="btn-outlined w-full">Exhibitor Intent</button>
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
                  JSA Silver <br className="hero-break" />
                  <span className="text-shimmer-pink">Show 2026</span>
                </h1>

                <p className="hero-tagline-lead">
                  India’s Most Premium B2B Silver Show!
                </p>

                <div className="hero-subheading-line hero-badge-glow">
                  <span className="live-sparkle-dot"></span>
                  <span>22, 23, 24 NOVEMBER 2026 • BM BIRLA AUDITORIUM, JAIPUR</span>
                </div>

                <div className="hero-cta-row">
                  <button 
                    onClick={goToForm}
                    className="btn-hero-primary"
                  >
                    <span>REGISTER AS VISITOR (FREE)</span>
                    <ArrowRight size={15} />
                  </button>

                  <button 
                    onClick={goToForm} 
                    className="btn-hero-secondary"
                  >
                    <span>EXHIBITOR INTENT</span>
                    <ArrowUpRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* STACKED FULL WEBSITE SECTIONS (TRANSITIONING FROM HERO WITH OVERLAP & BORDER RADIUS) */}
          <div className="stacked-website-content">
            {/* STATS / WHY ATTEND JSA (SYNCHRONIZED COUNTERS) */}
            <section className="section-space stats-hero-stack">
              <div className="container">
                <RevealSection>
                  <div className="section-head">
                    <h2 className="section-title font-serif">Why Attend JSA</h2>
                    <p className="section-lead">Reasons to be part of the community shaping India's silver jewelry &amp; bullion ecosystem.</p>
                  </div>
                </RevealSection>

                {/* 4 Stats Cards: Exhibitor, Buyers & Visitors, Booths, Exhibition Area */}
                <RevealSection>
                  <div className="stats-clean-grid stats-capsule-grid four-col">
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

                    <div className="stat-card stat-capsule-card">
                      <div className="stat-icon-wrap"><Briefcase size={26} /></div>
                      <div className="stat-value font-serif">
                        <CounterNumber endValue={10000} duration={2000} suffix="+" />
                      </div>
                      <h3 className="stat-title">BUYERS &amp; VISITORS</h3>
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
                      <div className="stat-icon-wrap"><Building size={26} /></div>
                      <div className="stat-value font-serif">
                        <CounterNumber endValue={5000} duration={2000} suffix=" SQ.FT" suffixClassName="suffix-unit" />
                      </div>
                      <h3 className="stat-title">EXHIBITION AREA</h3>
                      <p className="stat-desc">
                        Sprawling world-class infrastructure spread across BM Birla Auditorium with dedicated sourcing zones.
                      </p>
                    </div>
                  </div>
                </RevealSection>
              </div>
            </section>

            {/* EVENT VENUE CAPSULE LUXURY CARD (SHIFTED UNDER WHY ATTEND JSA) */}
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
                          BM Birla Auditorium, Jaipur
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
                          onClick={goToForm}
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
                            <strong>BM Birla Auditorium &amp; Convention Centre</strong>
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

            {/* SUPPORTING ASSOCIATIONS - HORIZONTAL SCROLLER */}
            <section className="section-space supporting-assoc-section">
              <div className="container">
                <RevealSection>
                  <div className="section-head-with-controls">
                    <div>
                      <span className="section-kicker">UNITED INDUSTRY LEADERSHIP</span>
                      <h2 className="section-title font-serif">Supporting Associations</h2>
                      <p className="section-lead">Apex jewellery bodies and regional Sarafa Sansthans extending their esteemed patronship to JSA Silver Show 2026.</p>
                    </div>
                    <div className="scroll-arrow-controls">
                      <button 
                        onClick={() => scrollContainer(assocScrollRef, -320)} 
                        className="btn-scroll-arrow"
                        aria-label="Scroll left"
                      >
                        <ChevronLeft size={18} />
                      </button>
                      <button 
                        onClick={() => scrollContainer(assocScrollRef, 320)} 
                        className="btn-scroll-arrow"
                        aria-label="Scroll right"
                      >
                        <ChevronRight size={18} />
                      </button>
                    </div>
                  </div>
                </RevealSection>

                <div 
                  ref={assocScrollRef}
                  className="horizontal-cards-scroller"
                >
                  {SUPPORTING_ASSOCIATIONS.map((leader, idx) => (
                    <div key={idx} className="assoc-leader-card">
                      <div className="assoc-avatar-wrap">
                        <img 
                          src="https://img.magnific.com/premium-vector/avatar-profil-picture-icon-vector-design-template_393879-5783.jpg?semt=ais_hybrid&w=740&q=80" 
                          alt={leader.name}
                          className="assoc-avatar-img"
                          loading="lazy"
                        />
                      </div>
                      <div className="assoc-info">
                        <h4 className="assoc-name">{leader.name}</h4>
                        <p className="assoc-role">{leader.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* OUR EXHIBITORS - HORIZONTAL SCROLLER */}
            <section className="section-space exhibitors-section bg-tint border-top-clean border-bottom-clean">
              <div className="container">
                <RevealSection>
                  <div className="section-head-with-controls">
                    <div>
                      <span className="section-kicker">SHOWCASE PARTICIPANTS</span>
                      <h2 className="section-title font-serif">Our Exhibitors</h2>
                      <p className="section-lead">Distinguished manufacturers, wholesalers, export houses, and master artisans participating in JSA Silver Show 2026.</p>
                    </div>
                    <div className="scroll-arrow-controls">
                      <button 
                        onClick={() => scrollContainer(exhibitorsScrollRef, -320)} 
                        className="btn-scroll-arrow"
                        aria-label="Scroll left"
                      >
                        <ChevronLeft size={18} />
                      </button>
                      <button 
                        onClick={() => scrollContainer(exhibitorsScrollRef, 320)} 
                        className="btn-scroll-arrow"
                        aria-label="Scroll right"
                      >
                        <ChevronRight size={18} />
                      </button>
                    </div>
                  </div>
                </RevealSection>

                <div 
                  ref={exhibitorsScrollRef}
                  className="horizontal-cards-scroller exhibitors-scroller"
                >
                  {EXHIBITORS_LIST.map((item, idx) => (
                    <div key={idx} className="exhibitor-badge-card">
                      {item.logo ? (
                        <div className="exhibitor-logo-box">
                          <img 
                            src={encodeURI(item.logo)} 
                            alt={`${item.name} logo`}
                            className="exhibitor-logo-img" 
                            loading="lazy"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                              const fallback = e.currentTarget.parentElement?.querySelector('.exhibitor-fallback-icon');
                              if (fallback) fallback.style.display = 'flex';
                            }}
                          />
                          <div className="exhibitor-crest-icon exhibitor-fallback-icon" style={{ display: 'none' }}>
                            <Gem size={20} />
                          </div>
                        </div>
                      ) : (
                        <div className="exhibitor-crest-icon placeholder-crest">
                          <Gem size={20} />
                        </div>
                      )}
                      <h4 className="exhibitor-company-name">{item.name}</h4>
                    </div>
                  ))}
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
                        Daily benchmark spot rates monitored and certified by JSA Silver Show to maintain transparency across Rajasthan.
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
                          <p className="insta-tagline">JSA Silver Show 2026 • JSA Official</p>
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
                    title="JSA Silver Show Highlights"
                    style={{ width: '100%', height: '100%', border: 'none', pointerEvents: 'none' }}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  />
                </div>
              </RevealSection>
            </div>
          </section>



          {/* NEWS & EVENTS SECTION (3 RECTANGLE CARDS IN SINGLE HORIZONTAL ROW / MOBILE SCROLLABLE) */}
          <section className="section-space news-events-section bg-tint border-top-clean border-bottom-clean">
            <div className="container">
              <RevealSection>
                <div className="section-head-with-controls">
                  <div>
                    <span className="section-kicker">UPDATES &amp; PRESS</span>
                    <h2 className="section-title font-serif">News &amp; Events</h2>
                    <p className="section-lead">Stay informed with the latest announcements, media releases, and milestones from JSA Silver Show 2026.</p>
                  </div>
                  <div className="scroll-arrow-controls mobile-only-flex">
                    <button 
                      onClick={() => scrollContainer(newsScrollRef, -320)} 
                      className="btn-scroll-arrow"
                      aria-label="Scroll left"
                    >
                      <ChevronLeft size={18} />
                    </button>
                    <button 
                      onClick={() => scrollContainer(newsScrollRef, 320)} 
                      className="btn-scroll-arrow"
                      aria-label="Scroll right"
                    >
                      <ChevronRight size={18} />
                    </button>
                  </div>
                </div>
              </RevealSection>

              <div 
                ref={newsScrollRef}
                className="news-cards-row"
              >
                {NEWS_EVENTS.map((item, idx) => (
                  <div key={idx} className="news-rectangle-card">
                    <div className="news-card-image-wrap">
                      <img 
                        src={item.image} 
                        alt={item.title} 
                        className="news-card-image"
                        loading="lazy" 
                      />
                      <span className="news-tag-badge overlay">{item.tag}</span>
                    </div>
                    <div className="news-card-body">
                      <div className="news-card-meta">
                        <Calendar size={13} />
                        <span>{item.date}</span>
                      </div>
                      <h3 className="news-card-title font-serif">{item.title}</h3>
                      <p className="news-card-desc">{item.desc}</p>
                      <button onClick={goToForm} className="news-card-link-btn">
                        <span>Read Full Release</span>
                        <ArrowRight size={14} />
                      </button>
                    </div>
                  </div>
                ))}
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
                <p className="au-eyebrow">About the Show</p>
                <h1 className="au-hero-title">JSA Silver<br /><em>Show</em></h1>
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
                      Jaipur has long stood as the world's crowning jewel for handcrafted silver artistry, intricate filigree, and authentic bullion trade. JSA Silver Show represents the collective voice of silversmiths, master artisans, casting innovators, and export merchants.
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
                    { name: 'Ujjwal Derewala',     role: 'Chairman',                        quote: 'With a focus on growth and global reach, JSA Silver Show stands as a key initiative for the silver industry.',               img: 'ujjwal_derewala.jpg' },
                    { name: 'Abhineet Boochra',    role: 'Vice Chairman',                   quote: 'JSA Silver Show reflects the strength and legacy of our silver industry. We are committed to an exceptional experience.',       img: '2. ABHINEET BOOCHRA VICE, CHAIRMAN.JPG' },
                    { name: 'Abhishek Bansal',     role: 'Vice Chairman',                   quote: 'This initiative reflects our collective effort to elevate the silver industry to new heights.',                                    img: '3. ABHISHEK BANSAL VICE, CHAIRMAN.JPG' },
                    { name: 'Rahul Jain',          role: 'Hony. Secretary',                 quote: "Being part of JSA Silver Show is more than participation — it's about shaping the future of trade.",                          img: 'rahul_jain.jpg' },
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
          PAGE 3: EXHIBITOR PROFILE
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
                    Exhibitor Profile
                  </h1>
                  <h2 className="portal-hero-subheading font-serif">
                    Who Can Exhibit?
                  </h2>
                  <p className="portal-hero-lead">
                    The exhibition welcomes businesses, manufacturers, wholesalers, artisans, designers, and brands operating across the silver jewellery and lifestyle ecosystem.
                  </p>
                  <div className="portal-hero-actions">
                    <button 
                      onClick={goToForm}
                      className="btn-portal-primary"
                    >
                      <Store size={15} />
                      <span>BOOK A BOOTH / EXHIBITOR INTENT</span>
                      <ArrowRight size={14} />
                    </button>
                    <button 
                      onClick={() => setCurrentPage('contact')} 
                      className="btn-portal-secondary"
                    >
                      <Phone size={15} />
                      <span>SHOW SECRETARIAT</span>
                    </button>
                  </div>
                </div>
              </RevealSection>
            </div>
          </div>

          {/* 5 Core Exhibitor Categories Grid */}
          <div className="portal-content-section">
            <div className="container">
              <RevealSection>
                <div className="portal-section-head">
                  <span className="portal-section-kicker">PARTICIPATION SPECTRUM</span>
                  <h2 className="portal-section-title font-serif">Who Can Exhibit?</h2>
                  <p className="portal-section-subtitle">
                    The exhibition welcomes businesses, manufacturers, wholesalers, artisans, designers, and brands operating across the silver jewellery and lifestyle ecosystem.
                  </p>
                </div>

                <div className="profile-spec-grid">
                  <div className="spec-card">
                    <div className="spec-card-icon-box">
                      <Gem size={24} />
                    </div>
                    <div className="spec-card-body">
                      <h3 className="spec-card-title font-serif">Silver Jewellery Manufacturers</h3>
                      <p className="spec-card-desc">
                        Manufacturers showcasing handcrafted, traditional, contemporary, and 925 sterling silver jewellery.
                      </p>
                    </div>
                  </div>

                  <div className="spec-card">
                    <div className="spec-card-icon-box">
                      <Building size={24} />
                    </div>
                    <div className="spec-card-body">
                      <h3 className="spec-card-title font-serif">Silver Wholesalers &amp; Distributors</h3>
                      <p className="spec-card-desc">
                        Large-scale suppliers serving retailers and jewellery businesses across India and international markets.
                      </p>
                    </div>
                  </div>

                  <div className="spec-card">
                    <div className="spec-card-icon-box">
                      <Award size={24} />
                    </div>
                    <div className="spec-card-body">
                      <h3 className="spec-card-title font-serif">Kundan, Meena &amp; Jadau Artisans</h3>
                      <p className="spec-card-desc">
                        Skilled craftsmen showcasing Jaipur’s traditional jewellery-making techniques on silver.
                      </p>
                    </div>
                  </div>

                  <div className="spec-card">
                    <div className="spec-card-icon-box">
                      <Sparkles size={24} />
                    </div>
                    <div className="spec-card-body">
                      <h3 className="spec-card-title font-serif">Moissanite &amp; Polki Jewellers</h3>
                      <p className="spec-card-desc">
                        Jewellers presenting high-end fashion jewellery featuring silver with Moissanite, Polki, and diamond-inspired accents.
                      </p>
                    </div>
                  </div>

                  <div className="spec-card full-width">
                    <div className="spec-card-icon-box">
                      <Coins size={24} />
                    </div>
                    <div className="spec-card-body">
                      <h3 className="spec-card-title font-serif">Handcrafted Jewellery &amp; Artefact Brands</h3>
                      <p className="spec-card-desc">
                        Businesses offering handmade jewellery, silverware, idols, corporate gifts, traditional artefacts, and lifestyle products.
                      </p>
                    </div>
                  </div>
                </div>
              </RevealSection>

              {/* Ideal Exhibitors Box */}
              <RevealSection>
                <div className="ideal-banner-box">
                  <div className="ideal-banner-header">
                    <BadgeCheck size={22} className="ideal-header-icon" />
                    <div>
                      <h3 className="ideal-title font-serif">Ideal Exhibitors</h3>
                      <p className="ideal-subtitle">Key stakeholder segments represented across our 300+ booths</p>
                    </div>
                  </div>
                  <div className="ideal-pills-wrap">
                    {[
                      "Manufacturers",
                      "Wholesalers",
                      "Distributors",
                      "Exporters",
                      "Artisans",
                      "Jewellery Designers",
                      "Silverware Brands",
                      "Handcrafted Product Businesses",
                      "Lifestyle & Fashion Brands"
                    ].map((pill, i) => (
                      <span key={i} className="ideal-pill-item">
                        <CheckCircle2 size={13} className="ideal-pill-check" />
                        <span>{pill}</span>
                      </span>
                    ))}
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
                  <h2 className="cta-h2 font-serif">Ready to Exhibit at JSA Silver Show 2026?</h2>
                  <p className="cta-p">Submit your space intent now to lock your preferred booth location and connect with pan-India retail buyers.</p>
                </div>
                <div className="portal-cta-actions">
                  <button onClick={goToForm} className="btn-cta-primary">
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
          PAGE 4: TRADE VISITOR PROFILE
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
                    <span>TRADE VISITOR PROFILE • JSA SILVER SHOW 2026</span>
                  </span>
                  <h1 className="portal-hero-title font-serif">
                    Visitor Profile
                  </h1>
                  <h2 className="portal-hero-subheading font-serif">
                    Who Will Visit?
                  </h2>
                  <p className="portal-hero-lead">
                    The exhibition brings together buyers, retailers, designers, industry professionals, institutions, and jewellery enthusiasts looking to discover new products, suppliers, and business opportunities.
                  </p>
                  <div className="portal-hero-actions">
                    <button 
                      onClick={goToForm}
                      className="btn-portal-primary"
                    >
                      <Users size={15} />
                      <span>REGISTER AS VISITOR (FREE PASS)</span>
                      <ArrowRight size={14} />
                    </button>
                    <button 
                      onClick={() => setCurrentPage('contact')} 
                      className="btn-portal-secondary"
                    >
                      <MapPin size={15} />
                      <span>VENUE &amp; SCHEDULE</span>
                    </button>
                  </div>
                </div>
              </RevealSection>
            </div>
          </div>

          {/* 4 Visitor Categories */}
          <div className="portal-content-section">
            <div className="container">
              <RevealSection>
                <div className="portal-section-head">
                  <span className="portal-section-kicker">BUYER CATEGORIES</span>
                  <h2 className="portal-section-title font-serif">Who Will Visit?</h2>
                  <p className="portal-section-subtitle">
                    The exhibition brings together buyers, retailers, designers, industry professionals, institutions, and jewellery enthusiasts looking to discover new products, suppliers, and business opportunities.
                  </p>
                </div>

                <div className="visitor-categories-list">
                  {/* Category 1 */}
                  <div className="visitor-category-group">
                    <div className="vcat-header">
                      <div className="vcat-icon-badge">
                        <Store size={22} />
                      </div>
                      <div>
                        <h3 className="vcat-title font-serif">Retailers &amp; Large-Scale Buyers</h3>
                        <p className="vcat-sub">Showroom operators, curated boutique stores, department stores, and online retail leaders.</p>
                      </div>
                    </div>
                    <div className="vcat-items-grid">
                      <div className="vcat-item-card">
                        <div className="vcat-item-crest"><CheckCircle2 size={16} /></div>
                        <div className="vcat-item-content">
                          <h4 className="vcat-item-name">Jewellery Showroom Owners</h4>
                          <p className="vcat-item-desc">Retailers expanding their inventory with 925 sterling silver jewellery, silver artefacts, and utensils.</p>
                        </div>
                      </div>
                      <div className="vcat-item-card">
                        <div className="vcat-item-crest"><CheckCircle2 size={16} /></div>
                        <div className="vcat-item-content">
                          <h4 className="vcat-item-name">Boutique &amp; Lifestyle Store Owners</h4>
                          <p className="vcat-item-desc">Curators sourcing contemporary jewellery, silverware, handbags, and designer accessories.</p>
                        </div>
                      </div>
                      <div className="vcat-item-card">
                        <div className="vcat-item-crest"><CheckCircle2 size={16} /></div>
                        <div className="vcat-item-content">
                          <h4 className="vcat-item-name">Department Store Buyers</h4>
                          <p className="vcat-item-desc">Category managers looking for major retail collections, corporate silver gifts, and festive silverware.</p>
                        </div>
                      </div>
                      <div className="vcat-item-card">
                        <div className="vcat-item-crest"><CheckCircle2 size={16} /></div>
                        <div className="vcat-item-content">
                          <h4 className="vcat-item-name">E-commerce &amp; Online Sellers</h4>
                          <p className="vcat-item-desc">Digital brands and marketplaces seeking trending, lightweight, and distinctive silver products for online retail.</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Category 2 */}
                  <div className="visitor-category-group">
                    <div className="vcat-header">
                      <div className="vcat-icon-badge">
                        <Globe2 size={22} />
                      </div>
                      <div>
                        <h3 className="vcat-title font-serif">Wholesalers &amp; Trade Intermediaries</h3>
                        <p className="vcat-sub">Sourcing conduits, national distributors, and international trade exporters.</p>
                      </div>
                    </div>
                    <div className="vcat-items-grid three-col">
                      <div className="vcat-item-card">
                        <div className="vcat-item-crest"><CheckCircle2 size={16} /></div>
                        <div className="vcat-item-content">
                          <h4 className="vcat-item-name">Silver Jewellery Wholesalers</h4>
                          <p className="vcat-item-desc">Bulk buyers seeking reliable sourcing channels and manufacturers from Jaipur and other craft hubs.</p>
                        </div>
                      </div>
                      <div className="vcat-item-card">
                        <div className="vcat-item-crest"><CheckCircle2 size={16} /></div>
                        <div className="vcat-item-content">
                          <h4 className="vcat-item-name">Importers &amp; Exporters</h4>
                          <p className="vcat-item-desc">International trading houses looking for traditional Indian handcrafted silver products.</p>
                        </div>
                      </div>
                      <div className="vcat-item-card">
                        <div className="vcat-item-crest"><CheckCircle2 size={16} /></div>
                        <div className="vcat-item-content">
                          <h4 className="vcat-item-name">Distributors &amp; Commission Agents</h4>
                          <p className="vcat-item-desc">Trade intermediaries supplying regional markets and local independent retailers.</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Category 3 */}
                  <div className="visitor-category-group">
                    <div className="vcat-header">
                      <div className="vcat-icon-badge">
                        <Sparkles size={22} />
                      </div>
                      <div>
                        <h3 className="vcat-title font-serif">Design &amp; Corporate Professionals</h3>
                        <p className="vcat-sub">Trend forecasters, corporate procurement heads, and media stylists.</p>
                      </div>
                    </div>
                    <div className="vcat-items-grid three-col">
                      <div className="vcat-item-card">
                        <div className="vcat-item-crest"><CheckCircle2 size={16} /></div>
                        <div className="vcat-item-content">
                          <h4 className="vcat-item-name">Jewellery Designers &amp; Consultants</h4>
                          <p className="vcat-item-desc">Professionals tracking jewellery trends, silver innovations, purity standards, and manufacturing techniques.</p>
                        </div>
                      </div>
                      <div className="vcat-item-card">
                        <div className="vcat-item-crest"><CheckCircle2 size={16} /></div>
                        <div className="vcat-item-content">
                          <h4 className="vcat-item-name">Corporate Gift Buyers</h4>
                          <p className="vcat-item-desc">Procurement teams sourcing premium silver corporate gifts, coins, trophies, and customised artefacts.</p>
                        </div>
                      </div>
                      <div className="vcat-item-card">
                        <div className="vcat-item-crest"><CheckCircle2 size={16} /></div>
                        <div className="vcat-item-content">
                          <h4 className="vcat-item-name">Fashion Stylists &amp; Influencers</h4>
                          <p className="vcat-item-desc">Creative professionals sourcing statement silver pieces for fashion, media, films, and styling.</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Category 4 */}
                  <div className="visitor-category-group">
                    <div className="vcat-header">
                      <div className="vcat-icon-badge">
                        <Building size={22} />
                      </div>
                      <div>
                        <h3 className="vcat-title font-serif">Industry Influencers &amp; Institutions</h3>
                        <p className="vcat-sub">Global buying agencies, trade delegations, and academic design researchers.</p>
                      </div>
                    </div>
                    <div className="vcat-items-grid three-col">
                      <div className="vcat-item-card">
                        <div className="vcat-item-crest"><CheckCircle2 size={16} /></div>
                        <div className="vcat-item-content">
                          <h4 className="vcat-item-name">Buying Houses &amp; Sourcing Agents</h4>
                          <p className="vcat-item-desc">Representatives sourcing products for international brands and large retail organisations.</p>
                        </div>
                      </div>
                      <div className="vcat-item-card">
                        <div className="vcat-item-crest"><CheckCircle2 size={16} /></div>
                        <div className="vcat-item-content">
                          <h4 className="vcat-item-name">Trade Association Delegations</h4>
                          <p className="vcat-item-desc">Organised groups of buyers and industry representatives from the gemstone, silver, and gold sectors.</p>
                        </div>
                      </div>
                      <div className="vcat-item-card">
                        <div className="vcat-item-crest"><CheckCircle2 size={16} /></div>
                        <div className="vcat-item-content">
                          <h4 className="vcat-item-name">Students &amp; Academicians</h4>
                          <p className="vcat-item-desc">Students and researchers from jewellery, gemology, design, and related institutes exploring silver craftsmanship and industry practices.</p>
                        </div>
                      </div>
                    </div>
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
                  <button onClick={goToForm} className="btn-cta-primary">
                    <span>Register as Visitor (Free Pass)</span>
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
                    <div className="g-caption">JSA Silver Show Identity</div>
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
            onGoToForm={goToForm}
          />
        </main>
      )}

      {/* ========================================================
          PAGE 7: NEWS & EVENTS (DEDICATED FULL VIEW)
          ======================================================== */}
      {currentPage === 'news-events' && (
        <main className="page-content news-events-page-root animate-fade-in" style={{ paddingTop: '6.5rem', minHeight: '80vh' }}>
          <section className="section-space">
            <div className="container">
              <RevealSection>
                <div className="section-head text-center">
                  <span className="section-kicker">OFFICIAL PRESS DESK • JSA SILVER SHOW 2026</span>
                  <h1 className="section-title font-serif">News &amp; Events</h1>
                  <p className="section-lead max-w-2xl mx-auto">
                    Stay informed with the latest announcements, media releases, and milestones from JSA Silver Show 2026.
                  </p>
                </div>
              </RevealSection>

              <div className="news-cards-row" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', marginTop: '2.5rem' }}>
                {NEWS_EVENTS.map((item, idx) => (
                  <div key={idx} className="news-rectangle-card">
                    <div className="news-card-image-wrap">
                      <img 
                        src={item.image} 
                        alt={item.title} 
                        className="news-card-image"
                        loading="lazy" 
                      />
                      <span className="news-tag-badge overlay">{item.tag}</span>
                    </div>
                    <div className="news-card-body">
                      <div className="news-card-meta">
                        <Calendar size={13} />
                        <span>{item.date}</span>
                      </div>
                      <h3 className="news-card-title font-serif">{item.title}</h3>
                      <p className="news-card-desc">{item.desc}</p>
                      <button onClick={goToForm} className="news-card-link-btn">
                        <span>Read Full Release</span>
                        <ArrowRight size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </main>
      )}

      {/* ========================================================
          PAGE 8: SPONSORSHIP OPPORTUNITIES
          ======================================================== */}
      {currentPage === 'sponsorship' && (
        <SponsorshipPage onGoToForm={goToForm} />
      )}

      {/* HIGH-AESTHETIC REGISTRATION CTA BANNER */}
      <section className="registration-cta-banner">
        <div className="container">
          <div className="cta-banner-card">
            <div className="cta-banner-content">
              <span className="cta-pill-kicker">
                <span className="live-sparkle-dot"></span>
                22, 23, 24 NOVEMBER 2026 • BM BIRLA AUDITORIUM, JAIPUR
              </span>
              <h2 className="cta-banner-title font-serif">
                Be Part of Jaipur's Silver Legacy
              </h2>
              <p className="cta-banner-desc">
                Whether you're an artisan, trader, manufacturer, or exporter — pre-register now for complimentary direct access, B2B sourcing lounges, and verified hall passes.
              </p>
              <div className="cta-btn-cluster">
                <button 
                  onClick={goToForm}
                  className="btn-cta-primary"
                >
                  <span>Register as Visitor (Free Pass)</span>
                  <ArrowRight size={16} />
                </button>
                <button 
                  onClick={goToForm} 
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
                  <img src="/jsa-show-logo.jpg" alt="JSA Silver Show" className="footer-logo" />
                </div>
                <div>
                  <h3 className="f-title font-serif">JSA Silver Show</h3>
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
                <li><button onClick={goToForm}>Visitor Pass Registration</button></li>
                <li><button onClick={goToForm}>Exhibitor Intent Form</button></li>
                <li><button onClick={() => setCurrentPage('sponsorship')}>Sponsorship Opportunities</button></li>
                <li><button onClick={() => setCurrentPage('gallery')}>Exhibition Gallery</button></li>
              </ul>
            </div>

            {/* Quick Navigation: Association */}
            <div className="footer-col">
              <h4 className="f-head">ASSOCIATION</h4>
              <ul className="f-links">
                <li><button onClick={() => setCurrentPage('about')}>About JSA Silver Show</button></li>
                <li><button onClick={() => setCurrentPage('exhibitor-alerts')}>Exhibitor Alerts</button></li>
                <li><button onClick={() => setCurrentPage('visitor-alerts')}>Visitor Alerts</button></li>
                <li><button onClick={() => setCurrentPage('news-events')}>News &amp; Events</button></li>
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
                  <span>JSA Silver Show</span>
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
            <p className="f-copyright">© 2026 JSA Silver Show. All rights reserved.</p>
            <div className="f-bottom-links">
              <a href="#">Privacy Policy</a>
              <span>•</span>
              <a href="#">Terms & Conditions</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
