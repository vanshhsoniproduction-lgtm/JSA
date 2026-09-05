// IndexedDB Storage Database Configuration
const DB_NAME = 'JSA_Silver_Show_DB';
const DB_VERSION = 2;
const STORE_INQUIRIES = 'inquiries_store';

// Open & Initialize IndexedDB
const openDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_INQUIRIES)) {
        const store = db.createObjectStore(STORE_INQUIRIES, { keyPath: 'id' });
        store.createIndex('createdAt', 'createdAt', { unique: false });
        store.createIndex('type', 'type', { unique: false });
        store.createIndex('status', 'status', { unique: false });
      }
    };

    request.onsuccess = (event) => resolve(event.target.result);
    request.onerror = (event) => reject(event.target.error);
  });
};

// Helper: Convert File to Base64 with Metadata for Offline/Client-side Media Storage
export const processFileAttachment = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      resolve({
        id: 'ATT-' + Math.random().toString(36).substring(2, 9),
        name: file.name,
        size: (file.size / 1024).toFixed(1) + ' KB',
        rawSize: file.size,
        type: file.type,
        data: reader.result,
        isImage: file.type.startsWith('image/'),
        isPdf: file.type === 'application/pdf',
        uploadedAt: new Date().toISOString()
      });
    };
    reader.onerror = (error) => reject(error);
  });
};

// Initialize DB Engine
export const initStorage = async () => {
  try {
    await openDB();
    // Clean legacy localstorage items
    localStorage.removeItem('jsa_inquiries_data_v1');
    localStorage.removeItem('jsa_inquiries_data_v2');
  } catch (err) {
    console.error('Database initialization error:', err);
  }
};

// Retrieve all inquiries
export const getInquiries = async () => {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_INQUIRIES], 'readonly');
      const store = transaction.objectStore(STORE_INQUIRIES);
      const request = store.getAll();

      request.onsuccess = () => {
        const result = request.result || [];
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        resolve(result);
      };
      request.onerror = () => reject(request.error);
    });
  } catch (err) {
    console.error('Error fetching inquiries from IndexedDB:', err);
    return [];
  }
};

// Save new inquiry with attachments, category, media
export const saveInquiry = async (inquiryData) => {
  try {
    const db = await openDB();
    const existing = await getInquiries();
    const newId = `JSA-2026-${1000 + existing.length + 1}`;

    const newEntry = {
      ...inquiryData,
      id: newId,
      name: inquiryData.name || '',
      phone: inquiryData.phone || '',
      email: inquiryData.email || '',
      company: inquiryData.company || '',
      city: inquiryData.city || '',
      state: inquiryData.state || '',
      country: inquiryData.country || 'India',
      pincode: inquiryData.pincode || '',
      address: inquiryData.address || '',
      gst_number: inquiryData.gst_number || '',
      resident_type: inquiryData.resident_type || 'indian',
      business_categories: inquiryData.business_categories || [],
      type: inquiryData.type || 'Visitor Registration',
      topicId: inquiryData.topicId || 'visitor',
      message: inquiryData.message || (inquiryData.business_categories && inquiryData.business_categories.length ? `Categories: ${inquiryData.business_categories.join(', ')}` : ''),
      attachments: inquiryData.attachments || [], // Array of media files / docs
      status: 'unread',
      isStarred: false,
      createdAt: new Date().toISOString(),
      source: inquiryData.source || 'Visitor Registration Form'
    };

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_INQUIRIES], 'readwrite');
      const store = transaction.objectStore(STORE_INQUIRIES);
      const request = store.add(newEntry);

      request.onsuccess = () => resolve(newEntry);
      request.onerror = () => reject(request.error);
    });
  } catch (err) {
    console.error('Error saving inquiry:', err);
    return null;
  }
};

// Update status (mark read/unread)
export const updateInquiryStatus = async (id, newStatus) => {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_INQUIRIES], 'readwrite');
      const store = transaction.objectStore(STORE_INQUIRIES);
      const getReq = store.get(id);

      getReq.onsuccess = () => {
        const data = getReq.result;
        if (data) {
          data.status = newStatus;
          const putReq = store.put(data);
          putReq.onsuccess = async () => {
            const all = await getInquiries();
            resolve(all);
          };
          putReq.onerror = () => reject(putReq.error);
        } else {
          resolve([]);
        }
      };
      getReq.onerror = () => reject(getReq.error);
    });
  } catch (err) {
    console.error('Error updating status:', err);
    return [];
  }
};

// Toggle Star
export const toggleStarInquiry = async (id) => {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_INQUIRIES], 'readwrite');
      const store = transaction.objectStore(STORE_INQUIRIES);
      const getReq = store.get(id);

      getReq.onsuccess = () => {
        const data = getReq.result;
        if (data) {
          data.isStarred = !data.isStarred;
          const putReq = store.put(data);
          putReq.onsuccess = async () => {
            const all = await getInquiries();
            resolve(all);
          };
          putReq.onerror = () => reject(putReq.error);
        } else {
          resolve([]);
        }
      };
      getReq.onerror = () => reject(getReq.error);
    });
  } catch (err) {
    console.error('Error toggling star:', err);
    return [];
  }
};

// Delete inquiry
export const deleteInquiry = async (id) => {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_INQUIRIES], 'readwrite');
      const store = transaction.objectStore(STORE_INQUIRIES);
      const req = store.delete(id);

      req.onsuccess = async () => {
        const all = await getInquiries();
        resolve(all);
      };
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.error('Error deleting inquiry:', err);
    return [];
  }
};

// Bulk Mark All Read
export const bulkMarkRead = async () => {
  try {
    const all = await getInquiries();
    const db = await openDB();
    const transaction = db.transaction([STORE_INQUIRIES], 'readwrite');
    const store = transaction.objectStore(STORE_INQUIRIES);

    for (const item of all) {
      item.status = 'read';
      store.put(item);
    }

    return new Promise((resolve) => {
      transaction.oncomplete = async () => {
        const updated = await getInquiries();
        resolve(updated);
      };
    });
  } catch (err) {
    console.error('Error bulk updating:', err);
    return [];
  }
};

// Clear entire database
export const clearAllInquiries = async () => {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_INQUIRIES], 'readwrite');
      const store = transaction.objectStore(STORE_INQUIRIES);
      const req = store.clear();

      req.onsuccess = () => resolve([]);
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.error('Error clearing database:', err);
    return [];
  }
};

// Export to CSV Spreadsheet (Including media attachment count)
export const exportInquiriesCSV = async () => {
  try {
    const current = await getInquiries();
    const headers = ['Inquiry ID', 'Date & Time', 'Full Name', 'Company', 'City', 'Phone', 'Email', 'Category', 'Attachments Count', 'Status', 'Message'];
    const rows = current.map(item => [
      item.id,
      new Date(item.createdAt).toLocaleString('en-IN'),
      `"${(item.name || '').replace(/"/g, '""')}"`,
      `"${(item.company || '').replace(/"/g, '""')}"`,
      `"${(item.city || '').replace(/"/g, '""')}"`,
      item.phone,
      item.email,
      item.type,
      item.attachments ? item.attachments.length : 0,
      item.status,
      `"${(item.message || '').replace(/"/g, '""')}"`
    ]);
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `JSA_Inquiries_Export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (err) {
    console.error('Export error:', err);
  }
};

// Local Admin Authentication (Zero Third Party)
export const checkAdminAuth = () => {
  try {
    return sessionStorage.getItem('jsa_admin_auth_session_v1') === 'jsa_authenticated_admin_session';
  } catch {
    return false;
  }
};

export const loginAdmin = (username, password) => {
  if (username.trim().toLowerCase() === 'admin' && password.trim() === 'admin') {
    sessionStorage.setItem('jsa_admin_auth_session_v1', 'jsa_authenticated_admin_session');
    return { success: true };
  }
  return { success: false, error: 'Invalid username or password' };
};

export const logoutAdmin = () => {
  sessionStorage.removeItem('jsa_admin_auth_session_v1');
};
