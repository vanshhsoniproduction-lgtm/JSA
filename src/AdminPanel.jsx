import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  ArrowUpDown,
  CheckCircle,
  Eye,
  Trash2,
  Download,
  LogOut,
  Mail,
  Phone,
  Calendar,
  Building,
  Star,
  RefreshCw,
  SlidersHorizontal,
  ChevronDown,
  X,
  ExternalLink,
  ShieldCheck,
  Users,
  Store,
  Layers,
  Sparkles,
  Inbox,
  Paperclip,
  Image as ImageIcon,
  FileText as FileTextIcon,
  DownloadCloud
} from 'lucide-react';
import {
  getInquiries,
  updateInquiryStatus,
  toggleStarInquiry,
  deleteInquiry,
  bulkMarkRead,
  clearAllInquiries,
  exportInquiriesCSV,
  logoutAdmin
} from './db';

import './AdminPanel.css';

export default function AdminPanel({ onLogout, onGoToSite }) {
  const [inquiries, setInquiries] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date-desc');
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [activeTab, setActiveTab] = useState('inquiries');

  // Load inquiries from local IndexedDB
  const loadData = async () => {
    const list = await getInquiries();
    setInquiries(list);
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filter & Search & Sort Logic
  const filteredInquiries = inquiries
    .filter((item) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        (item.name || '').toLowerCase().includes(q) ||
        (item.phone || '').toLowerCase().includes(q) ||
        (item.email || '').toLowerCase().includes(q) ||
        (item.company || '').toLowerCase().includes(q) ||
        (item.city || '').toLowerCase().includes(q) ||
        (item.message && item.message.toLowerCase().includes(q)) ||
        (item.id || '').toLowerCase().includes(q);

      const matchesType = typeFilter === 'all' || (item.type || '').toLowerCase().includes(typeFilter.toLowerCase());

      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'unread' && item.status === 'unread') ||
        (statusFilter === 'read' && item.status === 'read') ||
        (statusFilter === 'starred' && item.isStarred);

      return matchesSearch && matchesType && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === 'date-desc') return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortBy === 'date-asc') return new Date(a.createdAt) - new Date(b.createdAt);
      if (sortBy === 'name-asc') return (a.name || '').localeCompare(b.name || '');
      return 0;
    });

  // Action handlers
  const handleToggleRead = async (id, currentStatus) => {
    const newStatus = currentStatus === 'unread' ? 'read' : 'unread';
    const updated = await updateInquiryStatus(id, newStatus);
    setInquiries(updated);
    if (selectedInquiry && selectedInquiry.id === id) {
      setSelectedInquiry({ ...selectedInquiry, status: newStatus });
    }
  };

  const handleToggleStar = async (id) => {
    const updated = await toggleStarInquiry(id);
    setInquiries(updated);
    if (selectedInquiry && selectedInquiry.id === id) {
      setSelectedInquiry({ ...selectedInquiry, isStarred: !selectedInquiry.isStarred });
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm(`Are you sure you want to delete inquiry #${id}?`)) {
      const updated = await deleteInquiry(id);
      setInquiries(updated);
      if (selectedInquiry && selectedInquiry.id === id) {
        setSelectedInquiry(null);
      }
    }
  };

  const handleBulkRead = async () => {
    const updated = await bulkMarkRead();
    setInquiries(updated);
  };


  // Metrics
  const totalCount = inquiries.length;
  const unreadCount = inquiries.filter((i) => i.status === 'unread').length;
  const boothCount = inquiries.filter((i) => i.type === 'Booth Booking').length;
  const visitorCount = inquiries.filter((i) => i.type === 'Visitor Pass').length;

  return (
    <div className="admin-wrapper animate-fade-in">
      {/* Admin Top Header Bar */}
      <header className="admin-header">
        <div className="admin-header-inner">
          <div className="admin-brand">
            <img src="/jsa-show-logo.jpg" alt="JSA Logo" className="admin-logo" />
            <div>
              <div className="admin-brand-name font-serif">JSA Silver Show Admin</div>
              <div className="admin-badge">CONTROL SUITE 2026</div>
            </div>
          </div>

          <div className="admin-header-actions">
            <button className="btn-admin-secondary" onClick={onGoToSite}>
              <ExternalLink size={14} />
              <span>View Live Website</span>
            </button>
            <button className="btn-admin-danger" onClick={onLogout}>
              <LogOut size={14} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Admin Content Container */}
      <div className="admin-main container">
        {/* KPI Metric Strip */}
        <div className="admin-metrics-grid">
          <div className="admin-metric-card">
            <div className="metric-header">
              <span className="metric-label">Total Inquiries</span>
              <div className="metric-icon-box"><Inbox size={18} /></div>
            </div>
            <div className="metric-value font-serif">{totalCount}</div>
            <span className="metric-sub">Recorded in local database</span>
          </div>

          <div className="admin-metric-card">
            <div className="metric-header">
              <span className="metric-label">Pending / Unread</span>
              <div className="metric-icon-box unread-glow"><RefreshCw size={18} /></div>
            </div>
            <div className="metric-value font-serif text-wine">{unreadCount}</div>
            <span className="metric-sub">Awaiting team response</span>
          </div>

          <div className="admin-metric-card">
            <div className="metric-header">
              <span className="metric-label">Booth / Stall Leads</span>
              <div className="metric-icon-box"><Store size={18} /></div>
            </div>
            <div className="metric-value font-serif">{boothCount}</div>
            <span className="metric-sub">Exhibitor space requests</span>
          </div>

          <div className="admin-metric-card">
            <div className="metric-header">
              <span className="metric-label">Visitor Passes</span>
              <div className="metric-icon-box"><Users size={18} /></div>
            </div>
            <div className="metric-value font-serif">{visitorCount}</div>
            <span className="metric-sub">Buyer delegate registrations</span>
          </div>
        </div>

        {/* Toolbar: Search, Filters & Export */}
        <div className="admin-toolbar">
          {/* Search Box */}
          <div className="admin-search-wrap">
            <Search size={16} className="search-icon" />
            <input
              type="text"
              placeholder="Search by name, phone, email, ID or message..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="admin-search-input"
            />
            {searchQuery && (
              <button className="clear-search" onClick={() => setSearchQuery('')}>
                <X size={14} />
              </button>
            )}
          </div>

          {/* Filters & Actions Group */}
          <div className="admin-filters-row">
            {/* Category Filter */}
            <div className="filter-select-wrap">
              <label>Topic:</label>
              <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
                <option value="all">All Categories</option>
                <option value="visitor">Visitor Pass</option>
                <option value="booth">Booth Booking</option>
                <option value="member">Membership</option>
                <option value="bullion">Bullion Rates</option>
              </select>
            </div>

            {/* Status Filter */}
            <div className="filter-select-wrap">
              <label>Status:</label>
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                <option value="all">All Inquiries</option>
                <option value="unread">Unread Only</option>
                <option value="read">Read Only</option>
                <option value="starred">Starred Only</option>
              </select>
            </div>

            {/* Sort Order */}
            <div className="filter-select-wrap">
              <label>Sort:</label>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="date-desc">Newest First</option>
                <option value="date-asc">Oldest First</option>
                <option value="name-asc">Name (A-Z)</option>
              </select>
            </div>

            {/* Bulk & CSV Buttons */}
            <div className="admin-action-btns">
              <button className="btn-admin-action" onClick={handleBulkRead} title="Mark all as read">
                <CheckCircle size={14} />
                <span>Mark All Read</span>
              </button>
              <button className="btn-admin-action" onClick={exportInquiriesCSV} title="Export to CSV Spreadsheet">
                <Download size={14} />
                <span>Export CSV</span>
              </button>
              <button 
                className="btn-admin-danger" 
                onClick={() => {
                  if (window.confirm('Are you sure you want to permanently clear all inquiries in the database?')) {
                    const empty = clearAllInquiries();
                    setInquiries(empty);
                    setSelectedInquiry(null);
                  }
                }} 
                title="Clear Database"
              >
                <Trash2 size={14} />
                <span>Clear DB</span>
              </button>
            </div>
          </div>
        </div>

        {/* Inquiries Table / Master View */}
        <div className="admin-table-card">
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th width="40"></th>
                  <th>ID</th>
                  <th>Contact Details</th>
                  <th>Category</th>
                  <th>Message Preview</th>
                  <th>Date & Time</th>
                  <th>Status</th>
                  <th width="120" className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredInquiries.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="empty-table-state">
                      <Inbox size={32} className="empty-icon" />
                      <p>No inquiries found matching your filters.</p>
                      <button 
                        className="btn-admin-secondary" 
                        onClick={() => { setSearchQuery(''); setTypeFilter('all'); setStatusFilter('all'); }}
                      >
                        Reset Filters
                      </button>
                    </td>
                  </tr>
                ) : (
                  filteredInquiries.map((inq) => (
                    <tr 
                      key={inq.id} 
                      className={`table-row ${inq.status === 'unread' ? 'row-unread' : ''} ${selectedInquiry?.id === inq.id ? 'row-active' : ''}`}
                      onClick={() => {
                        setSelectedInquiry(inq);
                        if (inq.status === 'unread') {
                          handleToggleRead(inq.id, 'unread');
                        }
                      }}
                    >
                      {/* Star */}
                      <td onClick={(e) => { e.stopPropagation(); handleToggleStar(inq.id); }}>
                        <button className={`star-btn ${inq.isStarred ? 'is-starred' : ''}`}>
                          <Star size={15} fill={inq.isStarred ? '#e11d5a' : 'none'} />
                        </button>
                      </td>

                      {/* ID */}
                      <td>
                        <span className="inq-id">{inq.id}</span>
                      </td>

                      {/* Name, Phone, Email */}
                      <td>
                        <div className="inq-user-block">
                          <strong className="inq-name">{inq.name}</strong>
                          <div className="inq-sub-contact">
                            <span><Phone size={11} /> {inq.phone}</span>
                            <span><Mail size={11} /> {inq.email}</span>
                          </div>
                        </div>
                      </td>

                      {/* Category Type & Attachments */}
                      <td>
                        <div className="cat-cell-wrap">
                          <span className={`cat-pill cat-${inq.topicId || 'default'}`}>
                            {inq.type}
                          </span>
                          {inq.attachments && inq.attachments.length > 0 && (
                            <span className="media-badge" title={`${inq.attachments.length} attachment(s) available`}>
                              <Paperclip size={11} />
                              {inq.attachments.length}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Message Preview */}
                      <td>
                        <p className="inq-msg-preview">{inq.message || 'No description provided.'}</p>
                      </td>

                      {/* Date */}
                      <td>
                        <span className="inq-date">
                          {new Date(inq.createdAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </td>

                      {/* Status */}
                      <td>
                        <span className={`status-pill status-${inq.status}`}>
                          {inq.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="row-actions">
                          <button 
                            className="action-icon-btn" 
                            title={inq.status === 'unread' ? 'Mark as Read' : 'Mark as Unread'}
                            onClick={() => handleToggleRead(inq.id, inq.status)}
                          >
                            <CheckCircle size={15} />
                          </button>
                          <button 
                            className="action-icon-btn delete-btn" 
                            title="Delete Inquiry"
                            onClick={() => handleDelete(inq.id)}
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Inquiry Detail Flyout Modal with Full Media Attachment Gallery */}
      {selectedInquiry && (
        <div className="detail-modal-backdrop animate-fade-in" onClick={() => setSelectedInquiry(null)}>
          <div className="detail-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="detail-modal-header">
              <div>
                <span className="inq-id-large">{selectedInquiry.id}</span>
                <h3 className="font-serif detail-name">{selectedInquiry.name}</h3>
                {(selectedInquiry.company || selectedInquiry.city) && (
                  <p className="detail-company-line">
                    {selectedInquiry.company} {selectedInquiry.city && `• ${selectedInquiry.city}`}
                  </p>
                )}
              </div>
              <button className="modal-close-icon" onClick={() => setSelectedInquiry(null)}>
                <X size={18} />
              </button>
            </div>

            <div className="detail-modal-body">
              {/* Category & Date strip */}
              <div className="detail-info-strip">
                <div>
                  <label>INQUIRY CATEGORY</label>
                  <span className="cat-pill cat-default">{selectedInquiry.type}</span>
                </div>
                <div>
                  <label>RECEIVED ON</label>
                  <p>{new Date(selectedInquiry.createdAt).toLocaleString('en-IN')}</p>
                </div>
                <div>
                  <label>STATUS</label>
                  <span className={`status-pill status-${selectedInquiry.status}`}>{selectedInquiry.status}</span>
                </div>
              </div>

              {/* Direct Communication Details */}
              <div className="detail-contacts-grid">
                <div className="contact-detail-box">
                  <Phone size={16} className="text-wine" />
                  <div>
                    <label>PHONE NUMBER</label>
                    <a href={`tel:${selectedInquiry.phone}`}>{selectedInquiry.phone}</a>
                  </div>
                </div>

                <div className="contact-detail-box">
                  <Mail size={16} className="text-wine" />
                  <div>
                    <label>EMAIL ADDRESS</label>
                    <a href={`mailto:${selectedInquiry.email}`}>{selectedInquiry.email}</a>
                  </div>
                </div>
              </div>

              {/* Message Details */}
              <div className="detail-message-box">
                <label>INQUIRY MESSAGE / REQUIREMENTS</label>
                <p>{selectedInquiry.message || 'No additional message provided.'}</p>
              </div>

              {/* Media Attachments Gallery */}
              {selectedInquiry.attachments && selectedInquiry.attachments.length > 0 && (
                <div className="detail-attachments-section">
                  <label>ATTACHED MEDIA & DOCUMENTS ({selectedInquiry.attachments.length})</label>
                  <div className="detail-media-grid">
                    {selectedInquiry.attachments.map((file, idx) => (
                      <div key={idx} className="media-preview-card">
                        {file.isImage ? (
                          <div className="media-thumb-wrap">
                            <img src={file.data} alt={file.name} className="media-thumb-img" />
                          </div>
                        ) : (
                          <div className="media-doc-placeholder">
                            <FileTextIcon size={24} className="text-wine" />
                          </div>
                        )}
                        <div className="media-info-bar">
                          <span className="media-filename" title={file.name}>{file.name}</span>
                          <span className="media-filesize">{file.size}</span>
                        </div>
                        <a 
                          href={file.data} 
                          download={file.name} 
                          className="btn-download-media"
                          title="Download file"
                        >
                          <DownloadCloud size={14} />
                          <span>Download</span>
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Quick Actions */}
              <div className="detail-actions-row">
                <button 
                  className="btn-admin-secondary"
                  onClick={() => handleToggleRead(selectedInquiry.id, selectedInquiry.status)}
                >
                  <CheckCircle size={15} />
                  <span>{selectedInquiry.status === 'unread' ? 'Mark as Read' : 'Mark as Unread'}</span>
                </button>

                <button 
                  className="btn-admin-danger"
                  onClick={() => handleDelete(selectedInquiry.id)}
                >
                  <Trash2 size={15} />
                  <span>Delete Record</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
