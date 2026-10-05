import React, { useState } from 'react';
import { MenuItem, MenuItemCustomization } from '../../../types';

interface CustomizationModalProps {
  item: MenuItem;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (item: MenuItem, quantity: number, customization: MenuItemCustomization) => void;
}

const SIZE_OPTIONS: Array<{ name: 'Small' | 'Medium' | 'Large'; price: number; description: string }> = [
  { name: 'Small', price: 0, description: 'Single portion' },
  { name: 'Medium', price: 3.50, description: 'Regular (Serves 1-2)' },
  { name: 'Large', price: 6.00, description: 'Feast size (Serves 2-3)' }
];

const ADDON_OPTIONS = [
  { name: 'Extra Melted Cheese', price: 2.00 },
  { name: 'Black Truffle Infused Sauce', price: 3.00 },
  { name: 'Crisp Garlic Croutons', price: 1.50 },
  { name: 'Charred Jalapeño Peppers', price: 1.50 },
  { name: 'Artisan Herb Butter', price: 1.75 }
];

export const CustomizationModal: React.FC<CustomizationModalProps> = ({
  item,
  isOpen,
  onClose,
  onAddToCart
}) => {
  const [selectedSize, setSelectedSize] = useState<'Small' | 'Medium' | 'Large'>('Medium');
  const [selectedAddons, setSelectedAddons] = useState<Array<{ name: string; price: number }>>([]);
  const [instructions, setInstructions] = useState('');
  const [quantity, setQuantity] = useState(1);

  if (!isOpen) return null;

  const currentSizeOption = SIZE_OPTIONS.find((s) => s.name === selectedSize);
  const sizePrice = currentSizeOption ? currentSizeOption.price : 0;
  const addonsTotal = selectedAddons.reduce((sum, a) => sum + a.price, 0);
  const singleUnitPrice = item.price + sizePrice + addonsTotal;
  const totalPrice = Number((singleUnitPrice * quantity).toFixed(2));

  const toggleAddon = (addon: { name: string; price: number }) => {
    setSelectedAddons((prev) => {
      const exists = prev.some((a) => a.name === addon.name);
      if (exists) {
        return prev.filter((a) => a.name !== addon.name);
      } else {
        return [...prev, addon];
      }
    });
  };

  const handleConfirm = () => {
    onAddToCart(item, quantity, {
      size: selectedSize,
      sizePrice,
      addOns: selectedAddons,
      instructions: instructions.trim() || undefined
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-lg bg-surface-container-lowest rounded-3xl shadow-level-3 ghost-border overflow-hidden max-h-[90vh] flex flex-col animate-in zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-surface-container">
          <div className="flex items-center gap-3">
            <span
              className={`w-4 h-4 rounded-sm flex items-center justify-center border ${
                item.isVeg ? 'border-secondary' : 'border-primary'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  item.isVeg ? 'bg-secondary' : 'bg-primary'
                }`}
              />
            </span>
            <div>
              <h3 className="font-headline font-bold text-base sm:text-lg text-on-surface">
                Customize "{item.name}"
              </h3>
              <p className="font-body text-xs text-on-surface-variant">Base price: ${item.price.toFixed(2)}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          {/* Size Choice */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-headline font-bold text-sm text-on-surface">Choose Size</h4>
              <span className="text-xs font-label text-primary font-semibold bg-primary-fixed px-2 py-0.5 rounded-full">
                Required
              </span>
            </div>
            <div className="space-y-2">
              {SIZE_OPTIONS.map((size) => (
                <label
                  key={size.name}
                  onClick={() => setSelectedSize(size.name)}
                  className={`flex items-center justify-between p-3.5 rounded-2xl border cursor-pointer transition-all ${
                    selectedSize === size.name
                      ? 'border-primary bg-primary-fixed/20 shadow-sm'
                      : 'border-surface-container hover:bg-surface-container-low'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="size"
                      checked={selectedSize === size.name}
                      onChange={() => setSelectedSize(size.name)}
                      className="accent-primary w-4 h-4"
                    />
                    <div>
                      <span className="font-label text-sm font-bold text-on-surface">{size.name}</span>
                      <p className="text-xs text-on-surface-variant">{size.description}</p>
                    </div>
                  </div>
                  <span className="font-label text-xs font-bold text-on-surface">
                    {size.price === 0 ? 'Included' : `+$${size.price.toFixed(2)}`}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Add-ons Choice */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-headline font-bold text-sm text-on-surface">Add Extra Flavors & Toppings</h4>
              <span className="text-xs font-label text-outline">Optional</span>
            </div>
            <div className="space-y-2">
              {ADDON_OPTIONS.map((addon) => {
                const isSelected = selectedAddons.some((a) => a.name === addon.name);
                return (
                  <label
                    key={addon.name}
                    onClick={() => toggleAddon(addon)}
                    className={`flex items-center justify-between p-3 rounded-2xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-primary bg-primary-fixed/20'
                        : 'border-surface-container hover:bg-surface-container-low'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleAddon(addon)}
                        className="accent-primary w-4 h-4 rounded"
                      />
                      <span className="font-body text-xs sm:text-sm font-medium text-on-surface">
                        {addon.name}
                      </span>
                    </div>
                    <span className="font-label text-xs font-bold text-on-surface">
                      +${addon.price.toFixed(2)}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Special Instructions */}
          <div>
            <h4 className="font-headline font-bold text-sm text-on-surface mb-2">Special Chef Instructions</h4>
            <textarea
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="e.g. Less spicy, dressing on the side, allergies..."
              rows={2}
              className="w-full p-3 rounded-2xl bg-surface-container-low border border-surface-container text-xs font-body text-on-surface placeholder:text-on-surface-variant/70 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-surface-container-lowest transition-all resize-none"
            />
          </div>
        </div>

        {/* Modal Footer with Live Quantity & Add to Cart */}
        <div className="p-4 sm:p-6 bg-surface-container-low border-t border-surface-container flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 bg-surface-container-lowest border border-surface-container rounded-2xl p-1.5 shadow-sm">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-8 h-8 rounded-xl flex items-center justify-center text-on-surface hover:bg-surface-container active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined text-[18px]">remove</span>
            </button>
            <span className="font-label text-sm font-bold text-on-surface px-2">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="w-8 h-8 rounded-xl flex items-center justify-center text-on-surface hover:bg-surface-container active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
            </button>
          </div>

          <button
            onClick={handleConfirm}
            className="flex-1 py-3.5 px-6 rounded-2xl bg-primary text-white font-label text-sm font-bold hover:bg-primary-container shadow-glow-primary active:scale-98 transition-all flex items-center justify-between"
          >
            <span>Add Item to Cart</span>
            <span>${totalPrice.toFixed(2)}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
