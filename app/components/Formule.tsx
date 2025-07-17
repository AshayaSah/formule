"use client"

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

interface FormField {
    id: string;
    name: string;
    type: 'input' | 'select';
    label: string;
    placeholder?: string;
    options?: string[];
}

interface FormConfig {
    fields: FormField[];
}

interface FormuleProps {
    config: FormConfig; // Changed from configPath to config
}

export function Formule({ config }: FormuleProps) {
    const [formData, setFormData] = useState<Record<string, string>>({});

    useEffect(() => {
        // Initialize form data with empty values
        const initialData: Record<string, string> = {};
        config.fields.forEach((field: FormField) => {
            initialData[field.id] = '';
        });
        setFormData(initialData);
    }, [config]);

    const handleChange = (name: string, value: string) => {
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Form submitted:', formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {config.fields.map((field) => (
                <div key={field.name}>
                    <label className="block text-sm font-medium mb-1">{field.label}</label>
                    {field.type === 'input' ? (
                        <Input
                            value={formData[field.id] || ''}
                            onChange={(e) => handleChange(field.id, e.target.value)}
                            placeholder={field.placeholder}
                        />
                    ) : (
                        <Select
                            value={formData[field.id] || ''}
                            onValueChange={(value) => handleChange(field.id, value)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select an option" />
                            </SelectTrigger>
                            <SelectContent>
                                {field.options?.map((option) => (
                                    <SelectItem key={option} value={option}>
                                        {option}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                </div>
            ))}
            <Button type="submit">Submit</Button>
        </form>
    );
}