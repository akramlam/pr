import React from 'react';
import { LucideIcon } from 'lucide-react';

interface FormFieldProps {
  id: string;
  name: string;
  type: string;
  label: string;
  icon: LucideIcon;
  required?: boolean;
  autoComplete?: string;
  placeholder?: string;
}

const FormField: React.FC<FormFieldProps> = ({
  id,
  name,
  type,
  label,
  icon: Icon,
  required,
  autoComplete,
  placeholder
}) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium mb-2">
      {label}
    </label>
    <div className="relative">
      <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
      <input
        id={id}
        type={type}
        name={name}
        required={required}
        autoComplete={autoComplete}
        placeholder={placeholder || label}
        className="pl-10 w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600
          focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 
          bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
      />
    </div>
  </div>
);

export default FormField;