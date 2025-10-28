"use client";

import { useState, useRef, useEffect } from 'react';
import { Check, Palette, Eye } from 'lucide-react';
import { useTranslations } from 'next-intl';

export interface ColorOption {
  name: string;
  value: string;
  description?: string;
}

interface ColorPickerProps {
  value?: string;
  onChange: (color: string) => void;
  options?: ColorOption[];
  label?: string;
  description?: string;
  size?: 'sm' | 'md' | 'lg';
  showCustomPicker?: boolean;
  className?: string;
  disabled?: boolean;
}

export default function ColorPicker({
  value,
  onChange,
  options,
  label,
  description,
  size = 'md',
  showCustomPicker = true,
  className = '',
  disabled = false
}: ColorPickerProps) {
  const t = useTranslations('ui.colorPicker');
  
  const DEFAULT_COLORS: ColorOption[] = [
    { name: t('colors.blue'), value: '#3B82F6', description: t('descriptions.blue') },
    { name: t('colors.green'), value: '#10B981', description: t('descriptions.green') },
    { name: t('colors.purple'), value: '#8B5CF6', description: t('descriptions.purple') },
    { name: t('colors.pink'), value: '#EC4899', description: t('descriptions.pink') },
    { name: t('colors.orange'), value: '#F97316', description: t('descriptions.orange') },
    { name: t('colors.teal'), value: '#14B8A6', description: t('descriptions.teal') },
    { name: t('colors.red'), value: '#EF4444', description: t('descriptions.red') },
    { name: t('colors.yellow'), value: '#EAB308', description: t('descriptions.yellow') },
    { name: t('colors.indigo'), value: '#6366F1', description: t('descriptions.indigo') },
    { name: t('colors.gray'), value: '#6B7280', description: t('descriptions.gray') },
    { name: t('colors.emerald'), value: '#059669', description: t('descriptions.emerald') },
    { name: t('colors.rose'), value: '#E11D48', description: t('descriptions.rose') },
  ];
  
  const colorOptions = options || DEFAULT_COLORS;
  const colorLabel = label || t('label');
  const [isCustomPickerOpen, setIsCustomPickerOpen] = useState(false);
  const [customColor, setCustomColor] = useState(value || '#3B82F6');
  const customPickerRef = useRef<HTMLInputElement>(null);

  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10'
  };

  const handleCustomColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    setCustomColor(newColor);
    onChange(newColor);
  };

  const handleColorSelect = (color: string) => {
    onChange(color);
    setCustomColor(color);
  };

  const openCustomPicker = () => {
    setIsCustomPickerOpen(true);
    setTimeout(() => {
      customPickerRef.current?.click();
    }, 100);
  };

  const closeCustomPicker = () => {
    setIsCustomPickerOpen(false);
  };

  // Close custom picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isCustomPickerOpen && !customPickerRef.current?.contains(event.target as Node)) {
        closeCustomPicker();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isCustomPickerOpen]);

  return (
    <div className={`space-y-3 ${className}`}>
      {colorLabel && (
        <div className="space-y-1">
          <label className="text-sm font-medium text-foreground">
            {colorLabel}
          </label>
          {description && (
            <p className="text-xs text-muted-foreground">
              {description}
            </p>
          )}
        </div>
      )}

      <div className="space-y-3">
        {/* Preset Colors */}
        <div className="flex flex-wrap gap-2">
          {colorOptions.map((color) => (
            <button
              type="button"
              key={color.value}
              className={`
                ${sizeClasses[size]} rounded-full border-2 transition-all duration-200
                ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:scale-105'}
                ${value === color.value 
                  ? 'border-foreground scale-110 shadow-lg' 
                  : 'border-transparent hover:border-border'
                }
              `}
              style={{ backgroundColor: color.value }}
              onClick={() => !disabled && handleColorSelect(color.value)}
              title={`${color.name}${color.description ? ` - ${color.description}` : ''}`}
              disabled={disabled}
              aria-label={`Select ${color.name} color`}
            >
              {value === color.value && (
                <Check className="w-full h-full text-white drop-shadow-sm" />
              )}
            </button>
          ))}
        </div>

        {/* Custom Color Picker */}
        {showCustomPicker && (
          <div className="flex items-center space-x-2">
            <div className="relative">
              <button
                type="button"
                className={`
                  ${sizeClasses[size]} rounded-full border-2 border-dashed border-border
                  transition-all duration-200 hover:border-foreground/40 hover:scale-105
                  ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
                  ${isCustomPickerOpen ? 'border-foreground/60 scale-105' : ''}
                  p-1
                `}
                style={{ backgroundColor: customColor }}
                onClick={() => !disabled && openCustomPicker()}
                disabled={disabled}
                aria-label="Open custom color picker"
              >
                <Eye className="w-full h-full text-white/80 drop-shadow-sm" />
              </button>
              
              <input
                ref={customPickerRef}
                type="color"
                value={customColor}
                onChange={handleCustomColorChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
                disabled={disabled}
                aria-label="Custom color picker"
              />
            </div>
            
            <div className="flex flex-col">
              <span className="text-xs font-medium text-foreground">
                {t('custom')}
              </span>
              <span className="text-xs text-muted-foreground font-mono">
                {customColor.toUpperCase()}
              </span>
            </div>
          </div>
        )}

        {/* Current Selection Display */}
        {value && (
          <div className="flex items-center space-x-2 pt-2 border-t border-border">
            <Palette className="w-4 h-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">
              Selected: <span className="font-medium">{colorOptions.find(c => c.value === value)?.name || t('custom')}</span>
            </span>
            <div 
              className="w-3 h-3 rounded-full border border-border"
              style={{ backgroundColor: value }}
            />
          </div>
        )}
      </div>
    </div>
  );
}