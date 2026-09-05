import React, { useState } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  UploadCloud,
  FileText,
  Image as ImageIcon,
  X,
  ShieldCheck,
  Building,
  User,
  Phone,
  Mail,
  MapPin,
  FileCheck,
  Printer,
  Calendar,
  Clock
} from 'lucide-react';
import { saveInquiry, processFileAttachment } from './db';
import './RegistrationPage.css';

export default function RegistrationPage({ onGoHome }) {
  // Form State
  const [residentType, setResidentType] = useState('indian'); // 'indian' | 'nri'
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: '',
    gstNumber: '',
    company: '',
    country: 'India',
    state: '',
    city: '',
    pincode: '',
    address: '',
    passportNumber: '',
    passportExpiry: '',
    agreement: false
  });

  const [selectedCategories, setSelectedCategories] = useState([]);
  const [files, setFiles] = useState({
    idFront: null,
    idBack: null,
    photo: null,
    idProofNri: null
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(null);

  const businessCategoriesList = [
    'Manufacturer',
    'Wholesaler',
    'Retailer / Showroom Owner',
    'Bullion Dealer / Trader',
    'Exporter / Importer',
    'Artisan / Silversmith',
    'Machinery & Allied Tech',
    'Sourcing Agent / Distributor'
  ];

  // Handle Text Inputs
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    if (errors[name]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[name];
        return copy;
      });
    }
  };

  // Handle Category Toggle
  const handleCategoryToggle = (category) => {
    setSelectedCategories((prev) => {
      const exists = prev.includes(category);
      const updated = exists ? prev.filter((c) => c !== category) : [...prev, category];
      if (errors.categories && updated.length > 0) {
        setErrors((errs) => {
          const copy = { ...errs };
          delete copy.categories;
          return copy;
        });
      }
      return updated;
    });
  };

  // Handle File Change with Validations (type & size max 5MB)
  const handleFileChange = async (fieldName, e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        [fieldName]: 'File size must be less than 5MB'
      }));
      return;
    }

    // Validate type
    const validImageTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    const validDocTypes = [...validImageTypes, 'application/pdf'];

    if (fieldName === 'photo' && !validImageTypes.includes(file.type)) {
      setErrors((prev) => ({
        ...prev,
        [fieldName]: 'Photo must be JPG, PNG, or WEBP image'
      }));
      return;
    }

    if (!validDocTypes.includes(file.type)) {
      setErrors((prev) => ({
        ...prev,
        [fieldName]: 'Allowed formats: JPG, PNG, PDF'
      }));
      return;
    }

    try {
      const processed = await processFileAttachment(file);
      setFiles((prev) => ({ ...prev, [fieldName]: processed }));
      if (errors[fieldName]) {
        setErrors((prev) => {
          const copy = { ...prev };
          delete copy[fieldName];
          return copy;
        });
      }
    } catch (err) {
      console.error('File read error:', err);
      setErrors((prev) => ({
        ...prev,
        [fieldName]: 'Failed to process file. Please try another.'
      }));
    }
  };

  const removeFile = (fieldName) => {
    setFiles((prev) => ({ ...prev, [fieldName]: null }));
  };

  // Comprehensive Form Validation
  const validateForm = () => {
    const newErrors = {};

    // Name
    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
    } else if (formData.name.trim().length < 3) {
      newErrors.name = 'Name must be at least 3 characters';
    }

    // Mobile (Indian 10-digits or International)
    const indianPhoneRegex = /^[6-9]\d{9}$/;
    if (!formData.mobile.trim()) {
      newErrors.mobile = 'Mobile number is required';
    } else if (residentType === 'indian' && !indianPhoneRegex.test(formData.mobile.replace(/\D/g, ''))) {
      newErrors.mobile = 'Enter a valid 10-digit Indian mobile number';
    } else if (formData.mobile.trim().length < 7) {
      newErrors.mobile = 'Enter a valid mobile number';
    }

    // Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Company
    if (!formData.company.trim()) {
      newErrors.company = 'Company / Business name is required';
    }

    // State & City
    if (!formData.state.trim()) {
      newErrors.state = 'State / Region is required';
    }
    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }

    // Pincode
    if (residentType === 'indian') {
      if (!formData.pincode.trim()) {
        newErrors.pincode = 'Pincode is required';
      } else if (!/^\d{6}$/.test(formData.pincode.trim())) {
        newErrors.pincode = 'Enter a valid 6-digit Pincode';
      }
    }

    // Address
    if (!formData.address.trim()) {
      newErrors.address = 'Full street address is required';
    }

    // Documents
    if (residentType === 'indian') {
      if (!files.idFront) {
        newErrors.idFront = 'ID Card / Aadhaar (Front) is required';
      }
    } else {
      if (!formData.passportNumber.trim()) {
        newErrors.passportNumber = 'Passport number is required';
      }
      if (!files.idProofNri) {
        newErrors.idProofNri = 'Passport / ID document is required';
      }
    }

    // Photo
    if (!files.photo) {
      newErrors.photo = 'Visitor portrait photo is required for badge';
    }

    // Business Category
    if (selectedCategories.length === 0) {
      newErrors.categories = 'Please select at least one business category';
    }

    // Agreement
    if (!formData.agreement) {
      newErrors.agreement = 'You must accept the terms & conditions to proceed';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      const firstErr = document.querySelector('.field-error');
      if (firstErr) {
        firstErr.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    setIsSubmitting(true);

    try {
      // Gather all uploaded attachments
      const attachments = [];
      if (files.idFront) attachments.push({ ...files.idFront, label: 'ID Card Front' });
      if (files.idBack) attachments.push({ ...files.idBack, label: 'ID Card Back' });
      if (files.photo) attachments.push({ ...files.photo, label: 'Badge Photo' });
      if (files.idProofNri) attachments.push({ ...files.idProofNri, label: 'Passport / NRI ID' });

      const payload = {
        name: formData.name.trim(),
        phone: (residentType === 'indian' ? '+91 ' : '') + formData.mobile.trim(),
        email: formData.email.trim(),
        company: formData.company.trim(),
        gst_number: formData.gstNumber.trim().toUpperCase(),
        resident_type: residentType,
        country: residentType === 'indian' ? 'India' : formData.country.trim(),
        state: formData.state.trim(),
        city: formData.city.trim(),
        pincode: formData.pincode.trim(),
        address: formData.address.trim(),
        passport_number: formData.passportNumber.trim().toUpperCase(),
        passport_expiry: formData.passportExpiry,
        business_categories: selectedCategories,
        type: 'Trade Visitor Pass',
        topicId: 'visitor',
        source: 'Visitor Registration Portal',
        attachments: attachments
      };

      const savedEntry = await saveInquiry(payload);
      setIsSubmitting(false);

      if (savedEntry) {
        setRegistrationSuccess(savedEntry);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        alert('Could not save registration. Please try again.');
      }
    } catch (err) {
      console.error('Submission error:', err);
      setIsSubmitting(false);
      alert('An unexpected error occurred. Please try again.');
    }
  };

  return (
    <div className="reg-page-root">
      {/* Top Bar Navigation */}
      <header className="reg-header">
        <div className="container reg-header-container">
          <button onClick={onGoHome} className="reg-back-btn">
            <ArrowLeft size={16} />
            <span>Back to Exhibition</span>
          </button>
          <div className="reg-header-brand">
            <img src="/jsa-show-logo.jpg" alt="JSA Logo" className="reg-logo" />
            <div>
              <span className="reg-brand-title font-serif">JSA Silver Show 2026</span>
              <span className="reg-brand-sub">JAIPUR • 22–24 NOV</span>
            </div>
          </div>
        </div>
      </header>

      <main className="reg-main-container container">
        {/* SUCCESS CONFIRMATION STATE - EXECUTIVE ACCREDITATION SLIP */}
        {registrationSuccess ? (
          <div className="reg-success-wrapper animate-fade-in">
            {/* Top Status Notification */}
            <div className="docket-status-banner">
              <div className="docket-status-icon">
                <CheckCircle2 size={24} />
              </div>
              <div className="docket-status-text">
                <strong>Pre-Registration Successfully Confirmed</strong>
                <p>Your official visitor dossier has been verified and registered for the Jaipur Silver Show 2026.</p>
              </div>
              <span className="docket-live-chip">CONFIRMED</span>
            </div>

            {/* Official Confirmation Docket */}
            <div className="official-docket-card" id="official-docket-print">
              {/* Docket Top Header Row */}
              <div className="docket-header-row">
                <div className="docket-brand">
                  <img src="/jsa-show-logo.jpg" alt="JSA Logo" className="docket-logo" />
                  <div className="docket-brand-info">
                    <span className="docket-org-name">JAIPUR SILVER ASSOCIATION</span>
                    <h2 className="docket-event-title font-serif">Jaipur Silver Show 2026</h2>
                    <span className="docket-event-sub">Official Visitor Accreditation Slip & E-Acknowledgment</span>
                  </div>
                </div>

                <div className="docket-reg-badge">
                  <span className="docket-reg-label">REGISTRATION ID</span>
                  <strong className="docket-reg-value">{registrationSuccess.id}</strong>
                  <span className="docket-timestamp">
                    {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </span>
                </div>
              </div>

              {/* Exhibition Quick Reference Strip */}
              <div className="docket-meta-strip">
                <div className="meta-strip-item">
                  <Calendar size={15} className="meta-ico" />
                  <div>
                    <label>EXHIBITION DATES</label>
                    <span>22 – 24 November 2026</span>
                  </div>
                </div>
                <div className="meta-strip-item">
                  <Clock size={15} className="meta-ico" />
                  <div>
                    <label>DAILY TIMINGS</label>
                    <span>10:00 AM – 07:00 PM</span>
                  </div>
                </div>
                <div className="meta-strip-item">
                  <MapPin size={15} className="meta-ico" />
                  <div>
                    <label>VENUE LOCATION</label>
                    <span>Birla Auditorium, Statue Circle, Jaipur</span>
                  </div>
                </div>
                <div className="meta-strip-item">
                  <ShieldCheck size={15} className="meta-ico" />
                  <div>
                    <label>ACCESS TIER</label>
                    <span>Complimentary B2B Buyer</span>
                  </div>
                </div>
              </div>

              {/* Delegate Dossier Details */}
              <div className="docket-body">
                <div className="docket-delegate-card">
                  <div className="delegate-avatar-col">
                    {files.photo && files.photo.data ? (
                      <div className="delegate-photo">
                        <img src={files.photo.data} alt="Delegate Portrait" />
                      </div>
                    ) : (
                      <div className="delegate-photo-placeholder">
                        <User size={38} />
                      </div>
                    )}
                    <span className="delegate-type-tag">
                      {registrationSuccess.resident_type === 'nri' ? '✈️ NRI DELEGATE' : '🇮🇳 INDIAN TRADE'}
                    </span>
                  </div>

                  <div className="delegate-details-col">
                    <div className="delegate-primary-info">
                      <h3 className="delegate-name">{registrationSuccess.name}</h3>
                      <p className="delegate-company">
                        <Building size={15} />
                        <strong>{registrationSuccess.company}</strong>
                      </p>
                    </div>

                    <div className="delegate-info-grid">
                      <div className="info-cell">
                        <label>Mobile Contact</label>
                        <span>{registrationSuccess.phone}</span>
                      </div>
                      <div className="info-cell">
                        <label>Email Address</label>
                        <span>{registrationSuccess.email}</span>
                      </div>
                      <div className="info-cell">
                        <label>City & State</label>
                        <span>{registrationSuccess.city}, {registrationSuccess.state}</span>
                      </div>
                      <div className="info-cell">
                        <label>Country</label>
                        <span>{registrationSuccess.country || 'India'}</span>
                      </div>
                      {registrationSuccess.gst_number && (
                        <div className="info-cell">
                          <label>GST Number</label>
                          <span className="mono-text">{registrationSuccess.gst_number}</span>
                        </div>
                      )}
                      {registrationSuccess.passport_number && (
                        <div className="info-cell">
                          <label>Passport Number</label>
                          <span className="mono-text">{registrationSuccess.passport_number}</span>
                        </div>
                      )}
                    </div>

                    {registrationSuccess.business_categories && registrationSuccess.business_categories.length > 0 && (
                      <div className="delegate-categories-wrap">
                        <label>Sourcing & Business Interests:</label>
                        <div className="cat-tags-row">
                          {registrationSuccess.business_categories.map((cat, idx) => (
                            <span key={idx} className="cat-pill">{cat}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Next Steps / Exhibition Day Instructions */}
                <div className="docket-instructions-box">
                  <h4 className="instructions-title">
                    <FileCheck size={16} />
                    <span>Important Guidelines for Physical Badge Handover at Venue:</span>
                  </h4>
                  <div className="instructions-timeline">
                    <div className="instruction-step">
                      <span className="step-num">1</span>
                      <div>
                        <strong>Keep Slip Accessible</strong>
                        <p>Save or print this confirmation slip with your Registration ID (or keep SMS/Email on your phone).</p>
                      </div>
                    </div>
                    <div className="instruction-step">
                      <span className="step-num">2</span>
                      <div>
                        <strong>Government ID Verification</strong>
                        <p>Carry your original government photo ID (Aadhaar / Driving License / Passport) matching your registration name.</p>
                      </div>
                    </div>
                    <div className="instruction-step">
                      <span className="step-num">3</span>
                      <div>
                        <strong>Express Badge Collection</strong>
                        <p>Head directly to Counter #4 (Pre-Registered Trade Desk) at Gate 1, Birla Auditorium for immediate badge handover.</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Verification Footer Note */}
                <div className="docket-footer-bar">
                  <div className="docket-auth-note">
                    <ShieldCheck size={14} className="sec-ico" />
                    <span>Issued under official charter of Jaipur Silver Association • Valid for all 3 show days (22–24 Nov 2026)</span>
                  </div>
                  <div className="docket-helpline">
                    <span>Helpdesk: info@jaipursilverassociation.com | +91 7737637938</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="docket-actions-row">
              <button onClick={() => window.print()} className="btn-docket-print">
                <Printer size={16} />
                <span>Print or Save Confirmation Slip (PDF)</span>
              </button>
              <button 
                onClick={() => {
                  setRegistrationSuccess(null);
                  setFormData({
                    name: '',
                    mobile: '',
                    email: '',
                    gstNumber: '',
                    company: '',
                    country: 'India',
                    state: '',
                    city: '',
                    pincode: '',
                    address: '',
                    passportNumber: '',
                    passportExpiry: '',
                    agreement: false
                  });
                  setSelectedCategories([]);
                  setFiles({ idFront: null, idBack: null, photo: null, idProofNri: null });
                }} 
                className="btn-docket-secondary"
              >
                <span>Register Another Visitor</span>
              </button>
              <button onClick={onGoHome} className="btn-docket-back">
                <ArrowLeft size={15} />
                <span>Return to Exhibition</span>
              </button>
            </div>
          </div>
        ) : (
          /* MAIN REGISTRATION FORM */
          <div className="reg-form-card">
            <div className="reg-card-intro">
              <span className="reg-badge-chip">FREE B2B ENTRY PASS</span>
              <h1 className="reg-form-title font-serif">Trade Visitor Registration</h1>
              <p className="reg-form-lead">
                Pre-register online to receive your express digital pass for direct hall entry, sourcing lounges, and verified bullion trade pavilions at Birla Auditorium.
              </p>
            </div>

            <form onSubmit={handleSubmit} noValidate>
              {/* 1. REGISTRATION TYPE TOGGLE */}
              <div className="form-block">
                <h2 className="form-block-heading">01. Registration Type</h2>
                <div className="resident-toggle-grid">
                  <label 
                    className={`resident-toggle-card ${residentType === 'indian' ? 'active' : ''}`}
                    onClick={() => {
                      setResidentType('indian');
                      setFormData((prev) => ({ ...prev, country: 'India' }));
                    }}
                  >
                    <input 
                      type="radio" 
                      name="resident_type" 
                      value="indian" 
                      checked={residentType === 'indian'} 
                      onChange={() => {}} 
                    />
                    <div className="toggle-card-body">
                      <span className="toggle-flag">🇮🇳</span>
                      <div>
                        <strong>Indian Resident</strong>
                        <p>For visitors, showroom buyers & traders within India</p>
                      </div>
                    </div>
                  </label>

                  <label 
                    className={`resident-toggle-card ${residentType === 'nri' ? 'active' : ''}`}
                    onClick={() => {
                      setResidentType('nri');
                      setFormData((prev) => ({ ...prev, country: '' }));
                    }}
                  >
                    <input 
                      type="radio" 
                      name="resident_type" 
                      value="nri" 
                      checked={residentType === 'nri'} 
                      onChange={() => {}} 
                    />
                    <div className="toggle-card-body">
                      <span className="toggle-flag">✈️</span>
                      <div>
                        <strong>International / NRI Visitor</strong>
                        <p>For global delegates, export buyers & foreign citizens</p>
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              {/* 2. PERSONAL INFORMATION */}
              <div className="form-block">
                <h2 className="form-block-heading">02. Personal Information</h2>
                <div className="form-grid-2">
                  <div className="form-field">
                    <label htmlFor="reg_name">Full Name <span className="req">*</span></label>
                    <div className="input-wrap">
                      <User size={16} className="input-icon" />
                      <input 
                        type="text" 
                        id="reg_name"
                        name="name" 
                        placeholder="Enter your full name" 
                        value={formData.name} 
                        onChange={handleInputChange} 
                        className={errors.name ? 'is-invalid' : ''}
                      />
                    </div>
                    {errors.name && <span className="field-error">{errors.name}</span>}
                  </div>

                  <div className="form-field">
                    <label htmlFor="reg_mobile">Mobile Number <span className="req">*</span></label>
                    <div className="input-wrap">
                      <span className="mobile-prefix">{residentType === 'indian' ? '+91' : '🌐'}</span>
                      <input 
                        type="tel" 
                        id="reg_mobile"
                        name="mobile" 
                        placeholder={residentType === 'indian' ? '10-digit mobile number' : 'Country code + mobile'} 
                        value={formData.mobile} 
                        onChange={handleInputChange} 
                        maxLength={residentType === 'indian' ? 10 : 15}
                        className={errors.mobile ? 'is-invalid' : ''}
                      />
                    </div>
                    {errors.mobile && <span className="field-error">{errors.mobile}</span>}
                  </div>

                  <div className="form-field form-field-full">
                    <label htmlFor="reg_email">Email Address <span className="req">*</span></label>
                    <div className="input-wrap">
                      <Mail size={16} className="input-icon" />
                      <input 
                        type="email" 
                        id="reg_email"
                        name="email" 
                        placeholder="e.g. buyer@jewellers.com" 
                        value={formData.email} 
                        onChange={handleInputChange} 
                        className={errors.email ? 'is-invalid' : ''}
                      />
                    </div>
                    {errors.email && <span className="field-error">{errors.email}</span>}
                    <small className="field-hint">Your QR entry pass and badge details will be sent here.</small>
                  </div>
                </div>
              </div>

              {/* 3. COMPANY & LOCATION */}
              <div className="form-block">
                <h2 className="form-block-heading">03. Company & Location</h2>
                <div className="form-grid-2">
                  <div className="form-field">
                    <label htmlFor="reg_company">Company / Brand Name <span className="req">*</span></label>
                    <div className="input-wrap">
                      <Building size={16} className="input-icon" />
                      <input 
                        type="text" 
                        id="reg_company"
                        name="company" 
                        placeholder="e.g. Royal Silver Emporium" 
                        value={formData.company} 
                        onChange={handleInputChange} 
                        className={errors.company ? 'is-invalid' : ''}
                      />
                    </div>
                    {errors.company && <span className="field-error">{errors.company}</span>}
                  </div>

                  <div className="form-field">
                    <label htmlFor="reg_gst">GST Number (Optional)</label>
                    <div className="input-wrap">
                      <ShieldCheck size={16} className="input-icon" />
                      <input 
                        type="text" 
                        id="reg_gst"
                        name="gstNumber" 
                        placeholder="e.g. 08AAAAA0000A1Z5" 
                        value={formData.gstNumber} 
                        onChange={handleInputChange} 
                        maxLength={15}
                        style={{ textTransform: 'uppercase' }}
                      />
                    </div>
                  </div>

                  <div className="form-field">
                    <label htmlFor="reg_country">Country <span className="req">*</span></label>
                    <input 
                      type="text" 
                      id="reg_country"
                      name="country" 
                      placeholder="Enter country" 
                      value={formData.country} 
                      onChange={handleInputChange} 
                      readOnly={residentType === 'indian'}
                      className={residentType === 'indian' ? 'readonly-input' : ''}
                    />
                  </div>

                  <div className="form-field">
                    <label htmlFor="reg_state">State / Province <span className="req">*</span></label>
                    <input 
                      type="text" 
                      id="reg_state"
                      name="state" 
                      placeholder="e.g. Rajasthan, Maharashtra" 
                      value={formData.state} 
                      onChange={handleInputChange} 
                      className={errors.state ? 'is-invalid' : ''}
                    />
                    {errors.state && <span className="field-error">{errors.state}</span>}
                  </div>

                  <div className="form-field">
                    <label htmlFor="reg_city">City <span className="req">*</span></label>
                    <input 
                      type="text" 
                      id="reg_city"
                      name="city" 
                      placeholder="e.g. Jaipur, Mumbai, Delhi" 
                      value={formData.city} 
                      onChange={handleInputChange} 
                      className={errors.city ? 'is-invalid' : ''}
                    />
                    {errors.city && <span className="field-error">{errors.city}</span>}
                  </div>

                  <div className="form-field">
                    <label htmlFor="reg_pincode">Pincode / Postal Code <span className="req">*</span></label>
                    <input 
                      type="text" 
                      id="reg_pincode"
                      name="pincode" 
                      placeholder="6-digit pincode" 
                      value={formData.pincode} 
                      onChange={handleInputChange} 
                      maxLength={10}
                      className={errors.pincode ? 'is-invalid' : ''}
                    />
                    {errors.pincode && <span className="field-error">{errors.pincode}</span>}
                  </div>

                  <div className="form-field form-field-full">
                    <label htmlFor="reg_address">Full Street Address <span className="req">*</span></label>
                    <input 
                      type="text" 
                      id="reg_address"
                      name="address" 
                      placeholder="Shop/Office Number, Street, Commercial Area" 
                      value={formData.address} 
                      onChange={handleInputChange} 
                      className={errors.address ? 'is-invalid' : ''}
                    />
                    {errors.address && <span className="field-error">{errors.address}</span>}
                  </div>
                </div>
              </div>

              {/* 4. DOCUMENTS & IDENTITY VERIFICATION */}
              <div className="form-block">
                <h2 className="form-block-heading">04. Documents & Identity Verification</h2>
                <p className="form-block-sub">
                  Required for security clearance and B2B badge issuance inside Birla Auditorium.
                </p>

                <div className="form-grid-2">
                  {residentType === 'indian' ? (
                    <>
                      {/* ID FRONT */}
                      <div className="form-field">
                        <label>ID Card / Aadhaar (Front) <span className="req">*</span></label>
                        {files.idFront ? (
                          <div className="file-preview-card">
                            <div className="file-preview-meta">
                              <ImageIcon size={18} className="file-ico" />
                              <div className="file-text-col">
                                <strong className="file-name">{files.idFront.name}</strong>
                                <small>{files.idFront.size}</small>
                              </div>
                            </div>
                            <button 
                              type="button" 
                              onClick={() => removeFile('idFront')} 
                              className="file-remove-btn"
                              aria-label="Remove File"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        ) : (
                          <label className="file-upload-dropzone">
                            <input 
                              type="file" 
                              accept="image/*,application/pdf" 
                              onChange={(e) => handleFileChange('idFront', e)} 
                              style={{ display: 'none' }}
                            />
                            <UploadCloud size={24} className="dropzone-icon" />
                            <span className="dropzone-label">Click to upload Front ID</span>
                            <span className="dropzone-hint">JPG, PNG, or PDF up to 5MB</span>
                          </label>
                        )}
                        {errors.idFront && <span className="field-error">{errors.idFront}</span>}
                      </div>

                      {/* ID BACK */}
                      <div className="form-field">
                        <label>ID Card / Aadhaar (Back) (Optional)</label>
                        {files.idBack ? (
                          <div className="file-preview-card">
                            <div className="file-preview-meta">
                              <ImageIcon size={18} className="file-ico" />
                              <div className="file-text-col">
                                <strong className="file-name">{files.idBack.name}</strong>
                                <small>{files.idBack.size}</small>
                              </div>
                            </div>
                            <button 
                              type="button" 
                              onClick={() => removeFile('idBack')} 
                              className="file-remove-btn"
                              aria-label="Remove File"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        ) : (
                          <label className="file-upload-dropzone">
                            <input 
                              type="file" 
                              accept="image/*,application/pdf" 
                              onChange={(e) => handleFileChange('idBack', e)} 
                              style={{ display: 'none' }}
                            />
                            <UploadCloud size={24} className="dropzone-icon" />
                            <span className="dropzone-label">Click to upload Back ID</span>
                            <span className="dropzone-hint">JPG, PNG, or PDF up to 5MB</span>
                          </label>
                        )}
                      </div>
                    </>
                  ) : (
                    <>
                      {/* NRI PASSPORT DETAILS */}
                      <div className="form-field">
                        <label htmlFor="reg_pass">Passport Number <span className="req">*</span></label>
                        <input 
                          type="text" 
                          id="reg_pass"
                          name="passportNumber" 
                          placeholder="e.g. Z1234567" 
                          value={formData.passportNumber} 
                          onChange={handleInputChange} 
                          className={errors.passportNumber ? 'is-invalid' : ''}
                        />
                        {errors.passportNumber && <span className="field-error">{errors.passportNumber}</span>}
                      </div>

                      <div className="form-field">
                        <label>Upload Passport Copy <span className="req">*</span></label>
                        {files.idProofNri ? (
                          <div className="file-preview-card">
                            <div className="file-preview-meta">
                              <FileText size={18} className="file-ico" />
                              <div className="file-text-col">
                                <strong className="file-name">{files.idProofNri.name}</strong>
                                <small>{files.idProofNri.size}</small>
                              </div>
                            </div>
                            <button 
                              type="button" 
                              onClick={() => removeFile('idProofNri')} 
                              className="file-remove-btn"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        ) : (
                          <label className="file-upload-dropzone">
                            <input 
                              type="file" 
                              accept="image/*,application/pdf" 
                              onChange={(e) => handleFileChange('idProofNri', e)} 
                              style={{ display: 'none' }}
                            />
                            <UploadCloud size={24} className="dropzone-icon" />
                            <span className="dropzone-label">Upload Passport (PDF/JPG)</span>
                          </label>
                        )}
                        {errors.idProofNri && <span className="field-error">{errors.idProofNri}</span>}
                      </div>
                    </>
                  )}

                  {/* VISITOR PORTRAIT PHOTO */}
                  <div className="form-field form-field-full">
                    <label>Badge Photo <span className="req">*</span></label>
                    {files.photo ? (
                      <div className="file-preview-card file-preview-photo">
                        <img src={files.photo.data} alt="Badge Preview" className="photo-thumb-preview" />
                        <div className="file-preview-meta">
                          <div className="file-text-col">
                            <strong className="file-name">{files.photo.name}</strong>
                            <small>{files.photo.size} • Ready for badge printing</small>
                          </div>
                        </div>
                        <button 
                          type="button" 
                          onClick={() => removeFile('photo')} 
                          className="file-remove-btn"
                          aria-label="Remove Photo"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ) : (
                      <label className="file-upload-dropzone">
                        <input 
                          type="file" 
                          accept="image/*" 
                          onChange={(e) => handleFileChange('photo', e)} 
                          style={{ display: 'none' }}
                        />
                        <UploadCloud size={24} className="dropzone-icon" />
                        <span className="dropzone-label">Upload Clear Visitor Portrait Photo</span>
                        <span className="dropzone-hint">Clear front-facing portrait. No hats or sunglasses allowed.</span>
                      </label>
                    )}
                    {errors.photo && <span className="field-error">{errors.photo}</span>}
                  </div>
                </div>
              </div>

              {/* 5. VISITING AS / BUSINESS CATEGORIES */}
              <div className="form-block">
                <h2 className="form-block-heading">05. Business Profile & Interest <span className="req">*</span></h2>
                <p className="form-block-sub">Select one or more categories that match your business sourcing goals:</p>

                <div className="categories-selection-grid">
                  {businessCategoriesList.map((cat) => {
                    const isChecked = selectedCategories.includes(cat);
                    return (
                      <div 
                        key={cat} 
                        className={`cat-checkbox-card ${isChecked ? 'selected' : ''}`}
                        onClick={() => handleCategoryToggle(cat)}
                      >
                        <div className="cat-checkbox-indicator">
                          {isChecked && <CheckCircle2 size={14} />}
                        </div>
                        <span className="cat-checkbox-label">{cat}</span>
                      </div>
                    );
                  })}
                </div>
                {errors.categories && <span className="field-error mt-2">{errors.categories}</span>}
              </div>

              {/* 6. DECLARATION & SUBMISSION */}
              <div className="form-block form-block-submit">
                <label className="terms-checkbox-label">
                  <input 
                    type="checkbox" 
                    name="agreement" 
                    checked={formData.agreement} 
                    onChange={handleInputChange} 
                  />
                  <span>
                    I confirm that the details and identity documents provided are genuine and belong to me. I agree to abide by the trade exhibition guidelines at Birla Auditorium, Jaipur.
                  </span>
                </label>
                {errors.agreement && <span className="field-error mb-3">{errors.agreement}</span>}

                <div className="submit-actions-wrap">
                  <button 
                    type="submit" 
                    className="btn-solid btn-submit-reg" 
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="submit-spinner"></span>
                        <span>Generating Digital Pass...</span>
                      </>
                    ) : (
                      <>
                        <FileCheck size={18} />
                        <span>Submit & Get Digital Visitor Pass</span>
                      </>
                    )}
                  </button>
                  <p className="secure-badge-note">
                    <ShieldCheck size={14} className="sec-ico" />
                    <span>256-bit Encrypted B2B Registration • Standard JSA Hall Pass Protocol</span>
                  </p>
                </div>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
