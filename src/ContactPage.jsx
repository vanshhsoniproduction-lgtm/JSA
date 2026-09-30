import React from 'react';
import {
  MapPin,
  Phone,
  Mail,
  CheckCircle2,
  ArrowRight,
  Building,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import './ContactPage.css';

const FORM_URL = 'https://www.forms.jsasilvershow.com/';

export default function ContactPage({ onGoHome, onGoToForm }) {
  const handleRedirect = () => {
    if (onGoToForm) {
      onGoToForm();
    } else {
      window.location.href = FORM_URL;
    }
  };

  return (
    <div className="contact-page animate-fade-in">
      {/* Hero Header */}
      <section className="contact-hero-banner">
        <div className="container">
          <span className="contact-kicker">
            <Sparkles size={14} />
            DIRECT SECRETARIAT DESK
          </span>
          <h1 className="contact-title font-serif">Contact Jaipur Silver Association</h1>
          <p className="contact-lead">
            Whether you have questions regarding stall bookings, visitor access passes, logistics, or committee partnerships, our dedicated secretariat team is here to assist you.
          </p>
        </div>
      </section>

      <div className="container">
        {/* 4 Cards Quick Info Grid */}
        <div className="contact-cards-grid">
          <div className="contact-card">
            <div className="contact-card-icon">
              <Building size={24} />
            </div>
            <h3>Secretariat Office</h3>
            <p>JSA Silver Show</p>
            <span className="contact-card-note">Central Administration Office</span>
          </div>

          <div className="contact-card">
            <div className="contact-card-icon">
              <MapPin size={24} />
            </div>
            <h3>Exhibition Venue</h3>
            <p>Birla Auditorium, Statue Circle, Rambagh, Jaipur, Rajasthan 302001</p>
            <span className="contact-card-note">Event Dates: 22–24 Nov 2026</span>
          </div>

          <div className="contact-card">
            <div className="contact-card-icon">
              <Phone size={24} />
            </div>
            <h3>Official Infolines</h3>
            <p>
              <a href="tel:+917737637938">+91 7737637938</a>
              <br />
              <a href="tel:+917300023083">+91 7300023083</a>
            </p>
            <span className="contact-card-note">Mon–Sat: 10:00 AM – 7:00 PM</span>
          </div>

          <div className="contact-card">
            <div className="contact-card-icon">
              <Mail size={24} />
            </div>
            <h3>Official Email Desk</h3>
            <p>
              <a href="mailto:info@jaipursilverassociation.com">info@jaipursilverassociation.com</a>
            </p>
            <span className="contact-card-note">Average response: &lt; 24 hrs</span>
          </div>
        </div>

        {/* Main 2-Col Layout */}
        <div className="contact-main-grid">
          {/* Left: Portal Action Box */}
          <div className="contact-form-box">
            <span className="contact-kicker">
              <Sparkles size={14} />
              CENTRAL APPLICATION PORTAL
            </span>
            <h2>Official Registration &amp; Inquiries</h2>
            <p className="form-desc">
              All official trade visitor passes, exhibitor space bookings, sponsorship inquiries, and formal secretariat requests for JSA Silver Show 2026 are processed centrally through our official online form portal.
            </p>

            <div className="contact-portal-highlights">
              <div className="portal-hl-item">
                <CheckCircle2 size={18} className="text-pink" />
                <span>Instant Trade Visitor Passes &amp; QR Digital Accreditation</span>
              </div>
              <div className="portal-hl-item">
                <CheckCircle2 size={18} className="text-pink" />
                <span>Exhibitor Stall Intent &amp; Prime Pavilion Selection</span>
              </div>
              <div className="portal-hl-item">
                <CheckCircle2 size={18} className="text-pink" />
                <span>Direct Secretariat Inquiries &amp; Buyer Matchmaking</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleRedirect}
              className="btn-contact-submit"
            >
              <span>Proceed to Official Form</span>
              <ExternalLink size={16} />
            </button>
          </div>

          {/* Right: Map & Registration CTAs */}
          <div className="contact-side-col">
            <div className="side-map-box">
              <div className="side-map-header">
                <h3>Birla Auditorium, Jaipur</h3>
                <p>Statue Circle, Rambagh, Jaipur (Official Venue)</p>
              </div>
              <div className="map-iframe-wrapper">
                <iframe
                  title="Birla Auditorium Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3557.8596656755106!2d75.80164807611094!3d26.907156960309996!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x396db41328bc6e3f%3A0xe54d8b965fcae135!2sBirla%20Auditorium!5e0!3m2!1sen!2sin!4v1709500000000!5m2!1sen!2sin"
                  loading="lazy"
                  allowFullScreen
                ></iframe>
              </div>
            </div>

            <div className="side-action-card">
              <h3>Participate in JSA Silver Show 2026</h3>
              <p>
                Join over 10,000 verified B2B buyers and 175+ leading silver manufacturers at India's premier silver platform.
              </p>
              <div className="side-action-buttons">
                <button
                  type="button"
                  onClick={handleRedirect}
                  className="btn-side-white"
                >
                  <span>Register as Trade Visitor (Free)</span>
                  <ArrowRight size={14} />
                </button>
                <button
                  type="button"
                  onClick={handleRedirect}
                  className="btn-side-outline"
                >
                  <span>Submit Exhibitor Intent Form</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
