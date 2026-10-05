import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLocation } from '../../context/LocationContext';
import { userService } from '../../services/userService';
import { Address } from '../../types';

export const AddressesView: React.FC = () => {
  const { savedAddresses, refreshAddresses } = useLocation();

  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [label, setLabel] = useState('Home');
  const [streetAddress, setStreetAddress] = useState('');
  const [aptSuite, setAptSuite] = useState('');
  const [city, setCity] = useState('New York');
  const [state, setState] = useState('NY');
  const [zipCode, setZipCode] = useState('10001');
  const [isDefault, setIsDefault] = useState(false);

  const openAddModal = () => {
    setEditingId(null);
    setLabel('Home');
    setStreetAddress('');
    setAptSuite('');
    setCity('New York');
    setState('NY');
    setZipCode('10001');
    setIsDefault(savedAddresses.length === 0);
    setShowModal(true);
  };

  const openEditModal = (addr: Address) => {
    setEditingId(addr.id || null);
    setLabel(addr.label);
    setStreetAddress(addr.streetAddress);
    setAptSuite(addr.aptSuite || '');
    setCity(addr.city);
    setState(addr.state);
    setZipCode(addr.zipCode);
    setIsDefault(addr.isDefault || false);
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!streetAddress.trim() || !city.trim() || !zipCode.trim()) {
      alert('Please fill out all required address fields.');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        label,
        streetAddress: streetAddress.trim(),
        aptSuite: aptSuite.trim() || undefined,
        city: city.trim(),
        state: state.trim(),
        zipCode: zipCode.trim(),
        isDefault
      };

      if (editingId) {
        await userService.updateAddress(editingId, payload);
      } else {
        await userService.addAddress(payload);
      }
      await refreshAddresses();
      setShowModal(false);
    } catch (err: any) {
      console.warn('Address mutation error:', err);
      alert('Failed to save address.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Delete this delivery address?')) {
      try {
        await userService.deleteAddress(id);
        await refreshAddresses();
      } catch (err) {
        alert('Could not delete address.');
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8 pb-32">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <nav className="flex items-center gap-2 text-xs font-label text-outline">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <span>/</span>
            <Link to="/profile" className="hover:text-primary transition-colors">Profile</Link>
            <span>/</span>
            <span className="text-on-surface font-bold">Delivery Addresses</span>
          </nav>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-on-surface">
            Saved Delivery Addresses
          </h1>
          <p className="font-body text-xs sm:text-sm text-on-surface-variant">
            Manage your home, office, and preferred delivery destinations
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="px-6 py-3 rounded-2xl bg-primary text-white font-label text-xs font-bold hover:bg-primary-container shadow-glow-primary active:scale-95 transition-all flex items-center gap-2 w-fit"
        >
          <span className="material-symbols-outlined text-[18px]">add_location_alt</span>
          Add New Address
        </button>
      </div>

      {/* Address Cards Grid */}
      {savedAddresses.length === 0 ? (
        <div className="p-16 rounded-3xl bg-surface-container-lowest ghost-border text-center space-y-4 max-w-md mx-auto">
          <span className="material-symbols-outlined text-outline text-[48px]">home_pin</span>
          <h3 className="font-headline font-bold text-lg text-on-surface">No saved addresses</h3>
          <p className="font-body text-xs text-on-surface-variant">
            Add your primary residence or workplace for quick 1-click checkout.
          </p>
          <button
            onClick={openAddModal}
            className="px-6 py-2.5 rounded-xl bg-primary text-white font-label text-xs font-bold"
          >
            Add Address
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {savedAddresses.map((addr) => (
            <div
              key={addr.id}
              className="bg-surface-container-lowest rounded-3xl p-6 ghost-border shadow-sm flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-headline font-bold text-sm text-on-surface flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-[20px]">
                      {addr.label === 'Work' ? 'business' : addr.label === 'Home' ? 'home' : 'pin_drop'}
                    </span>
                    {addr.label}
                  </span>
                  {addr.isDefault && (
                    <span className="px-2.5 py-0.5 rounded-full bg-secondary-fixed text-secondary font-label text-[10px] font-bold">
                      Default
                    </span>
                  )}
                </div>

                <p className="font-body text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                  {addr.streetAddress}{addr.aptSuite ? `, ${addr.aptSuite}` : ''} <br />
                  {addr.city}, {addr.state} {addr.zipCode}
                </p>
              </div>

              <div className="pt-3 border-t border-surface-container flex items-center justify-end gap-2 text-xs font-label">
                <button
                  onClick={() => openEditModal(addr)}
                  className="px-3 py-1.5 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface font-bold transition-colors"
                >
                  Edit
                </button>
                {addr.id && (
                  <button
                    onClick={() => handleDelete(addr.id!)}
                    className="px-3 py-1.5 rounded-xl text-error hover:bg-error-container/30 font-bold transition-colors"
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Address Dialog Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg bg-surface-container-lowest rounded-3xl p-6 sm:p-8 ghost-border shadow-level-3 space-y-6 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-surface-container pb-4">
              <h3 className="font-headline font-bold text-lg text-on-surface">
                {editingId ? 'Edit Delivery Address' : 'Add New Delivery Address'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-outline hover:text-on-surface p-1"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Address Label Choice */}
              <div>
                <label className="text-xs font-label font-bold text-on-surface block mb-1.5">
                  Address Type
                </label>
                <div className="flex gap-2">
                  {['Home', 'Work', 'Other'].map((l) => (
                    <button
                      key={l}
                      type="button"
                      onClick={() => setLabel(l)}
                      className={`px-4 py-2 rounded-xl font-label text-xs font-bold transition-all ${
                        label === l
                          ? 'bg-primary text-white shadow-sm'
                          : 'bg-surface-container-low text-on-surface border border-surface-container'
                      }`}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              </div>

              {/* Street Address */}
              <div className="space-y-1">
                <label className="text-xs font-label font-bold text-on-surface">Street Address</label>
                <input
                  type="text"
                  value={streetAddress}
                  onChange={(e) => setStreetAddress(e.target.value)}
                  placeholder="e.g. 142 Mercer Street"
                  required
                  className="w-full p-3 rounded-2xl bg-surface-container-low border border-surface-container text-xs font-body text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Apt / Suite */}
              <div className="space-y-1">
                <label className="text-xs font-label font-bold text-on-surface">Apartment / Suite / Floor (Optional)</label>
                <input
                  type="text"
                  value={aptSuite}
                  onChange={(e) => setAptSuite(e.target.value)}
                  placeholder="e.g. Apt 4B / Floor 3"
                  className="w-full p-3 rounded-2xl bg-surface-container-low border border-surface-container text-xs font-body text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* City, State, Zip */}
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-label font-bold text-on-surface">City</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                    className="w-full p-3 rounded-2xl bg-surface-container-low border border-surface-container text-xs font-body text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-label font-bold text-on-surface">State</label>
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    required
                    className="w-full p-3 rounded-2xl bg-surface-container-low border border-surface-container text-xs font-body text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-label font-bold text-on-surface">Zip Code</label>
                  <input
                    type="text"
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                    required
                    className="w-full p-3 rounded-2xl bg-surface-container-low border border-surface-container text-xs font-body text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              {/* Default checkbox */}
              <label className="flex items-center gap-2 pt-1 cursor-pointer select-none text-xs font-label font-medium text-on-surface">
                <input
                  type="checkbox"
                  checked={isDefault}
                  onChange={(e) => setIsDefault(e.target.checked)}
                  className="accent-primary w-4 h-4 rounded"
                />
                <span>Set as my default delivery address</span>
              </label>

              {/* Actions */}
              <div className="pt-4 border-t border-surface-container flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2.5 rounded-2xl bg-surface-container-low hover:bg-surface-container text-on-surface font-label text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 rounded-2xl bg-primary text-white font-label text-xs font-bold hover:bg-primary-container shadow-sm"
                >
                  {loading ? 'Saving...' : 'Save Address'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
