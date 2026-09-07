import React, { useState } from 'react';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Building,
  User,
  Sparkles
} from 'lucide-react';
import { saveInquiry } from './db';
import './ContactPage.css';

export default function ContactPage({ onGoHome, onGoToRegister }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    department: 'general',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setErrorMessage('Please fill in your name, email, and message.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      await saveInquiry({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        company: formData.company.trim(),
        type: `Contact Inquiry: ${formData.department.toUpperCase()}`,
        topicId: 'contact',
        source: 'Dedicated Contact Page',
        message: formData.message.trim()
      });

      setIsSubmitting(false);
      setSubmitted(true);
    } catch (err) {
      console.error('Failed to submit contact message:', err);
      setIsSubmitting(false);
      setErrorMessage('Could not send message. Please try again or call us directly.');
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
            <p>Apex Tower, Lalkothi, Jaipur, Rajasthan 302015, India</p>
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
          {/* Left: Contact Form */}
          <div className="contact-form-box">
            <h2>Send Us a Direct Message</h2>
            <p className="form-desc">
              Submit your inquiry below. Our organizing desk will promptly review and get back to you.
            </p>

            {submitted ? (
              <div className="contact-success-state">
                <div className="contact-success-icon">
                  <CheckCircle2 size={32} />
                </div>
                <h3>Inquiry Received Successfully!</h3>
                <p>
                  Thank you for reaching out, <strong>{formData.name}</strong>. Your message has been logged in our secretariat desk and an association coordinator will contact you shortly.
                </p>
                <button
                  type="button"
                  className="btn-solid"
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({
                      name: '',
                      email: '',
                      phone: '',
                      company: '',
                      department: 'general',
                      message: ''
                    });
                  }}
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                {errorMessage && (
                  <div style={{ color: '#dc2626', marginBottom: '1rem', fontSize: '0.9rem' }}>
                    {errorMessage}
                  </div>
                )}

                <div className="form-row-2">
                  <div className="c-field">
                    <label>Your Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      required
                      placeholder="e.g. Ramesh Chandra Soni"
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="c-field">
                    <label>Mobile Number</label>
                    <input
                      type="tel"
                      name="phone"
                      placeholder="e.g. +91 98290XXXXX"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="form-row-2">
                  <div className="c-field">
                    <label>Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      required
                      placeholder="name@jewellers.com"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="c-field">
                    <label>Company / Firm Name</label>
                    <input
                      type="text"
                      name="company"
                      placeholder="e.g. Royal Silver Arts"
                      value={formData.company}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="c-field">
                  <label>Department / Subject of Inquiry</label>
                  <select name="department" value={formData.department} onChange={handleChange}>
                    <option value="general">General Exhibition Inquiries</option>
                    <option value="exhibitor">Exhibitor Booth Booking & Floor Plan</option>
                    <option value="visitor">Visitor Registration & Badges</option>
                    <option value="sponsorship">Sponsorship & Brand Partnerships</option>
                    <option value="press">Press, Media & Delegations</option>
                  </select>
                </div>

                <div className="c-field">
                  <label>Message / Details *</label>
                  <textarea
                    rows={4}
                    name="message"
                    required
                    placeholder="Provide details about your inquiry, stall size requirements, or questions..."
                    value={formData.message}
                    onChange={handleChange}
                  ></textarea>
                </div>

                <button type="submit" disabled={isSubmitting} className="btn-contact-submit">
                  <Send size={16} />
                  <span>{isSubmitting ? 'Sending Inquiry...' : 'Submit Inquiry'}</span>
                </button>
              </form>
            )}
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
              <h3>Participate in Jaipur Silver Show 2026</h3>
              <p>
                Join over 10,000 verified B2B buyers and 175+ leading silver manufacturers at India's premier silver platform.
              </p>
              <div className="side-action-buttons">
                <button
                  type="button"
                  onClick={() => onGoToRegister && onGoToRegister('visitor')}
                  className="btn-side-white"
                >
                  <span>Register as Trade Visitor (Free)</span>
                  <ArrowRight size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => onGoToRegister && onGoToRegister('exhibitor')}
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
