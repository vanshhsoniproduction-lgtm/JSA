import React, { useState } from 'react';
import {
  Download,
  Phone,
  Mail,
  Calendar,
  MapPin,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Maximize2,
  X,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Award,
  Layers,
  ShieldCheck,
  Eye
} from 'lucide-react';
import './SponsorshipPage.css';

const SPONSORSHIP_PACKAGES = [
  {
    id: 1,
    page: 2,
    image: '/sponsorship/page_2.png',
    title: 'Water Bottle Branding',
    price: 'Rs. 5.50 Lakh + GST',
    category: 'Mass Touchpoint',
    desc: 'High-frequency brand impressions across all exhibition halls and conference lounges with 250ml co-branded water bottles placed at attendee tables and registration counters.',
    highlights: [
      '250ml branded bottles across all 3 days',
      'Distributed at registration, lounges & stalls',
      'Direct hands-on physical engagement'
    ]
  },
  {
    id: 2,
    page: 3,
    image: '/sponsorship/page_3.png',
    title: 'Badge Lanyard',
    price: 'Rs. 5.50 Lakh + GST',
    category: 'Maximum Personal Visibility',
    desc: 'Your brand worn around the neck of every single registered buyer, VIP delegate, exhibitor, and trade visitor throughout the 3-day show.',
    highlights: [
      'Continuous walking advertisement',
      'Worn by 100% of attendees & delegates',
      'Exclusive logo placement on premium woven ribbon'
    ]
  },
  {
    id: 3,
    page: 4,
    image: '/sponsorship/page_4.png',
    title: 'Flyer / Overhead Banners',
    price: 'Hall 1: Rs. 2 Lakh | Hall 2 & 3: Rs. 2.50 Lakh + GST',
    category: 'Ceiling Landmark Visibility',
    desc: 'Prominently suspended hanging banners positioned directly above prime hall walkways and central thoroughfares, visible from every aisle.',
    highlights: [
      'Prime elevation above central walkways',
      'Hall 1 (Ground), Hall 2 & 3 Options',
      'Unobstructed sightlines for buyers'
    ]
  },
  {
    id: 4,
    page: 5,
    image: '/sponsorship/page_5.png',
    title: 'Main Gate Entry Arch',
    price: 'Rs. 2.50 Lakh + GST',
    category: 'Grand Entrance Landmark',
    desc: 'Monumental branded welcome arch at the primary entrance of B.M. Birla Auditorium greeting all trade buyers, industry leaders, dignitaries, and media.',
    highlights: [
      'First sight for every visitor arriving at the show',
      'Prime photo & VIP arrival backdrop',
      'Unmatched architectural scale'
    ]
  },
  {
    id: 5,
    page: 6,
    image: '/sponsorship/page_6.png',
    title: 'Carry Bags (Visitors & Exhibitors)',
    price: 'Rs. 7.50 Lakh + GST',
    category: 'Premium Walkable Media',
    desc: 'Executive leather bags provided to exhibitors plus high-finish branded shopping carry bags gifted to all trade buyers to carry catalogues & purchases.',
    highlights: [
      'Exhibitor Executive Leather Bags included',
      'High-volume visitor carry bags',
      'Retained by buyers long after the show concludes'
    ]
  },
  {
    id: 6,
    page: 7,
    image: '/sponsorship/page_7.png',
    title: 'Digital Screen Branding',
    price: 'Rs. 1.50 Lakh + GST (5 Companies/Day)',
    category: 'Dynamic Digital Video',
    desc: 'High-definition 30-second video and motion graphic ad loops broadcasting continuously across prime LED totem displays and video walls.',
    highlights: [
      '30-second commercial loop throughout show hours',
      'Limited to only 5 select companies per day',
      'Crisp high-brightness full-colour display'
    ]
  },
  {
    id: 7,
    page: 8,
    image: '/sponsorship/page_8.png',
    title: 'VIP Visitor Lounge',
    price: 'Rs. 2.50 Lakh + GST',
    category: 'Executive Hospitality Zone',
    desc: 'Title branding within the air-conditioned VIP & buyer hospitality lounge where large volume bullion traders and high-net-worth jewellers conduct negotiations.',
    highlights: [
      'Exclusive branding across seating & hospitality desks',
      'Targeted high-net-worth B2B buyers',
      'Extended dwell-time networking presence'
    ]
  },
  {
    id: 8,
    page: 9,
    image: '/sponsorship/page_9.png',
    title: 'Food Court Branding',
    price: 'Rs. 3 Lakh / Hall + GST',
    category: 'High Dwell-Time Zone',
    desc: 'Complete table-top, tent-card, pillar, and perimeter branding across the busy catering and dining pavilions where buyers relax and network.',
    highlights: [
      'Prime dining space branding per hall',
      'High dwell-time visibility during lunch & tea hours',
      'Table-top and wall placement options'
    ]
  },
  {
    id: 9,
    page: 10,
    image: '/sponsorship/page_10.png',
    title: 'Registration Area Branding',
    price: 'Rs. 3 Lakh + GST',
    category: '100% Mandatory Check-in',
    desc: 'Front desk wrap, queue stanchions, and prominent backdrops positioned directly at the main visitor registration and trade badge pickup counters.',
    highlights: [
      'Mandatory interaction for every attendee',
      'Prime front desk counter wrap & branding',
      'High-authority position at the official desk'
    ]
  }
];

const CATALOG_SLIDES = [
  { page: 1, img: '/sponsorship/page_1.png', label: 'Cover • Sponsorship Opportunities' },
  { page: 2, img: '/sponsorship/page_2.png', label: '01 • Water Bottle Branding' },
  { page: 3, img: '/sponsorship/page_3.png', label: '02 • Badge Lanyard' },
  { page: 4, img: '/sponsorship/page_4.png', label: '03 • Flyer / Overhead Banners' },
  { page: 5, img: '/sponsorship/page_5.png', label: '04 • Main Gate Entry' },
  { page: 6, img: '/sponsorship/page_6.png', label: '05 • Carry Bags (Visitor & Exhibitor)' },
  { page: 7, img: '/sponsorship/page_7.png', label: '06 • Digital Screen Branding' },
  { page: 8, img: '/sponsorship/page_8.png', label: '07 • Visitor Lounge' },
  { page: 9, img: '/sponsorship/page_9.png', label: '08 • Food Court Branding' },
  { page: 10, img: '/sponsorship/page_10.png', label: '09 • Registration Area' },
  { page: 11, img: '/sponsorship/page_11.png', label: 'Closing • Event Spaces & Enquiries' }
];

export default function SponsorshipPage({ onGoToForm }) {
  const [selectedSlide, setSelectedSlide] = useState(null);

  const openLightbox = (slideIndex) => {
    setSelectedSlide(slideIndex);
  };

  const closeLightbox = () => {
    setSelectedSlide(null);
  };

  const nextSlide = () => {
    if (selectedSlide !== null) {
      setSelectedSlide((selectedSlide + 1) % CATALOG_SLIDES.length);
    }
  };

  const prevSlide = () => {
    if (selectedSlide !== null) {
      setSelectedSlide((selectedSlide - 1 + CATALOG_SLIDES.length) % CATALOG_SLIDES.length);
    }
  };

  return (
    <div className="sponsorship-page animate-fade-in">
      {/* HERO BANNER */}
      <section className="sponsorship-hero">
        <div className="container">
          <div className="sponsorship-hero-content">
            <h1 className="sponsorship-title font-serif">
              Make Your Brand Part of the Show
            </h1>
            <p className="sponsorship-subtitle">
              Be a part of India's most premier B2B Silver Show. Elevate your brand presence before 15,000+ verified trade buyers, bullion refiners, jewellery delegations, and decision makers.
            </p>

            <div className="sponsorship-meta-bar">
              <div className="meta-pill">
                <Calendar size={15} />
                <span>22, 23, 24 NOVEMBER 2026</span>
              </div>
              <div className="meta-pill">
                <MapPin size={15} />
                <span>B.M. Birla Auditorium, Jaipur</span>
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="sponsorship-actions-row">
              <a 
                href="/jsa-sponsorship-catalog.pdf" 
                download="JSA-Silver-Show-2026-Sponsorship-Catalog.pdf"
                className="btn-download-catalogue"
              >
                <Download size={18} />
                <span>Download Sponsorship Catalogue (PDF)</span>
                <span className="file-size-badge">1.5 MB</span>
              </a>

              <a 
                href="https://wa.me/919216030976?text=Hi%2C%20I%20am%20interested%20in%20JSA%20Silver%20Show%202026%20Sponsorship%20Opportunities." 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn-enquire-whatsapp"
              >
                <Phone size={16} />
                <span>Enquire: 92160 30976</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* QUICK HIGHLIGHTS METRICS */}
      <section className="sponsorship-stats-strip">
        <div className="container">
          <div className="sponsorship-stats-grid">
            <div className="stat-capsule">
              <span className="stat-num font-serif">15,000+</span>
              <span className="stat-desc">Target Trade Visitors &amp; High-Volume Bullion Buyers</span>
            </div>
            <div className="stat-capsule">
              <span className="stat-num font-serif">3 Days</span>
              <span className="stat-desc">Continuous Uninterrupted Spotlight at B.M. Birla Auditorium</span>
            </div>
            <div className="stat-capsule">
              <span className="stat-num font-serif">3 Halls</span>
              <span className="stat-desc">Multi-Pavilion Exhibition Footprint with High Footfall</span>
            </div>
            <div className="stat-capsule">
              <span className="stat-num font-serif">100% B2B</span>
              <span className="stat-desc">Strictly Verified Wholesalers, Retail Chains &amp; Artisans</span>
            </div>
          </div>
        </div>
      </section>

      {/* CORE SPONSORSHIP PACKAGES GRID */}
      <section className="section-space">
        <div className="container">
          <div className="section-head text-center">
            <span className="section-kicker">CURATED BRANDING SPACES</span>
            <h2 className="section-title font-serif">Featured Sponsorship Packages</h2>
            <p className="section-lead max-w-2xl mx-auto">
              Choose from high-visibility on-ground branding placements engineered to deliver maximum brand recall, trust, and direct trade leads.
            </p>
          </div>

          <div className="sponsorship-cards-grid">
            {SPONSORSHIP_PACKAGES.map((pkg) => (
              <div key={pkg.id} className="sponsorship-card">
                <div 
                  className="sponsorship-card-image-wrap"
                  onClick={() => openLightbox(pkg.page - 1)}
                  title="Click to view full catalogue page"
                >
                  <img 
                    src={pkg.image} 
                    alt={pkg.title} 
                    className="sponsorship-card-img" 
                    loading="lazy"
                  />
                  <div className="view-zoom-hint">
                    <Maximize2 size={16} />
                    <span>View Page</span>
                  </div>
                </div>

                <div className="sponsorship-card-body">
                  <div className="pkg-index-row">
                    <span className="pkg-number">OPTION 0{pkg.id}</span>
                  </div>
                  <h3 className="pkg-title font-serif">{pkg.title}</h3>
                  <div className="pkg-price-badge">{pkg.price}</div>
                  <p className="pkg-desc">{pkg.desc}</p>

                  <ul className="pkg-highlights-list">
                    {pkg.highlights.map((h, i) => (
                      <li key={i}>
                        <CheckCircle2 size={14} className="pkg-check-ico" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="pkg-card-footer">
                    <a 
                      href={`https://wa.me/919216030976?text=Hi%2C%20I%20want%20to%20book%20the%20${encodeURIComponent(pkg.title)}%20sponsorship%20package%20at%20JSA%20Silver%20Show%202026.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-book-package"
                    >
                      <span>Book This Space</span>
                      <ArrowRight size={14} />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>



      {/* DIRECT SECRETARIAT CONTACT BANNER */}
      <section className="section-space sponsorship-contact-section">
        <div className="container">
          <div className="sponsorship-contact-card">
            <div className="contact-card-content">
              <span className="sponsorship-kicker">HAVE CUSTOM BRANDING IDEAS?</span>
              <h2 className="font-serif">Reserve Your Prime Show Placement Today</h2>
              <p>
                Sponsorship opportunities are strictly allocated on a first-come, first-served basis. Connect with the JSA Silver Show Secretariat for custom pavilion sponsorships, lanyard branding, or multi-hall packages.
              </p>

              <div className="sponsorship-desk-contacts">
                <a href="tel:9216030976" className="desk-contact-item">
                  <Phone size={18} />
                  <div>
                    <span className="contact-type">Booking Hotline</span>
                    <strong>+91 92160 30976</strong>
                  </div>
                </a>

                <a href="mailto:jaipursilverassociation@gmail.com" className="desk-contact-item">
                  <Mail size={18} />
                  <div>
                    <span className="contact-type">Email Secretariat</span>
                    <strong>jaipursilverassociation@gmail.com</strong>
                  </div>
                </a>

                <div className="desk-contact-item">
                  <MapPin size={18} />
                  <div>
                    <span className="contact-type">Show Venue</span>
                    <strong>B.M. Birla Auditorium, Jaipur</strong>
                  </div>
                </div>
              </div>
            </div>

            <div className="contact-card-cta-box">
              <div className="cta-download-box">
                <h4>Official Catalogue</h4>
                <p>Complete rate card, technical dimensions, and branding specs.</p>
                <a 
                  href="/jsa-sponsorship-catalog.pdf" 
                  download="JSA-Silver-Show-2026-Sponsorship-Catalog.pdf"
                  className="btn-download-catalogue w-full"
                >
                  <Download size={16} />
                  <span>Download Catalogue</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FULLSCREEN LIGHTBOX MODAL */}
      {selectedSlide !== null && (
        <div className="sponsorship-lightbox-backdrop" onClick={closeLightbox}>
          <div className="sponsorship-lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button className="btn-close-lightbox" onClick={closeLightbox} aria-label="Close">
              <X size={24} />
            </button>
            
            <button className="btn-lightbox-nav prev" onClick={prevSlide} aria-label="Previous">
              <ChevronLeft size={28} />
            </button>

            <div className="lightbox-image-container">
              <img 
                src={CATALOG_SLIDES[selectedSlide].img} 
                alt={CATALOG_SLIDES[selectedSlide].label} 
                className="lightbox-main-img"
              />
              <div className="lightbox-caption">
                <span>{CATALOG_SLIDES[selectedSlide].label}</span>
                <span className="lightbox-counter">Page {selectedSlide + 1} of {CATALOG_SLIDES.length}</span>
              </div>
            </div>

            <button className="btn-lightbox-nav next" onClick={nextSlide} aria-label="Next">
              <ChevronRight size={28} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
