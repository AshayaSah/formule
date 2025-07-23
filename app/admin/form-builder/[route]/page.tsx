"use client"

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Trash2, Plus } from 'lucide-react';

interface FormField {
    id: string;
    name: string;
    type: 'input' | 'select';
    label: string;
    placeholder?: string;
    options?: string[];
}

export default function FormBuilder() {
    const [fields, setFields] = useState<FormField[]>([]);
    const [newFieldType, setNewFieldType] = useState<'input' | 'select'>('input');
    const [newFieldLabel, setNewFieldLabel] = useState('');
    const [newFieldPlaceholder, setNewFieldPlaceholder] = useState('');
    const [newFieldOptions, setNewFieldOptions] = useState('');
    const router = useRouter();
    const params = useParams();
    const route = params.route as string;

    useEffect(() => {
        async function fetchFormConfig() {
            const response = await fetch(`/api/get-form-config?route=${encodeURIComponent(route)}`);
            if (response.ok) {
                const data = await response.json();
                setFields(data.fields || []);
            }
        }
        if (route) {
            fetchFormConfig();
        }
    }, [route]);

    const addField = () => {
        if (!newFieldLabel) return;

        const newField: FormField = {
            id: newFieldLabel.toLowerCase(),
            name: newFieldLabel.toLowerCase(),
            type: newFieldType,
            label: newFieldLabel,
            placeholder: newFieldPlaceholder || undefined,
            options: newFieldType === 'select' ? newFieldOptions.split(',').map(opt => opt.trim()) : undefined,
        };

        setFields([...fields, newField]);
        setNewFieldLabel('');
        setNewFieldPlaceholder('');
        setNewFieldOptions('');
    };

    const removeField = (id: string) => {
        setFields(fields.filter(field => field.id !== id));
    };

    const handlePublish = async () => {
        try {
            const formConfig = { fields };
            const response = await fetch('/api/publish-form', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ route, formConfig }),
            });

            if (!response.ok) {
                throw new Error('Failed to publish form');
            }

            const data = await response.json();
            console.log(data.message);
            router.push(`/forms/${route}`);
        } catch (error) {
            console.error('Error publishing form:', error);
        }
    };

    return (
        <div className="p-6 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">Form Builder: {route}</h2>
            <div className="mb-6 p-4 border rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Add New Field</h3>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Field Type</label>
                        <Select value={newFieldType} onValueChange={(value: 'input' | 'select') => setNewFieldType(value)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select field type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="input">Input</SelectItem>
                                <SelectItem value="select">Select</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Label</label>
                        <Input
                            value={newFieldLabel}
                            onChange={(e) => setNewFieldLabel(e.target.value)}
                            placeholder="Enter field label"
                        />
                    </div>
                    {newFieldType === 'input' && (
                        <div>
                            <label className="block text-sm font-medium mb-1">Placeholder</label>
                            <Input
                                value={newFieldPlaceholder}
                                onChange={(e) => setNewFieldPlaceholder(e.target.value)}
                                placeholder="Enter placeholder text"
                            />
                        </div>
                    )}
                    {newFieldType === 'select' && (
                        <div>
                            <label className="block text-sm font-medium mb-1">Options (comma-separated)</label>
                            <Input
                                value={newFieldOptions}
                                onChange={(e) => setNewFieldOptions(e.target.value)}
                                placeholder="e.g., Option1, Option2, Option3"
                            />
                        </div>
                    )}
                    <Button onClick={addField} className="mt-2">
                        <Plus className="w-4 h-4 mr-2" /> Add Field
                    </Button>
                </div>
            </div>
            <div className="border rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-2">Form Preview</h3>
                {fields.length === 0 && <p className="text-gray-500">No fields added yet.</p>}
                <div className="space-y-4">
                    {fields.map((field) => (
                        <div key={field.id} className="flex items-center gap-4">
                            <div className="flex-1">
                                <label className="block text-sm font-medium mb-1">{field.label}</label>
                                {field.type === 'input' ? (
                                    <Input placeholder={field.placeholder} />
                                ) : (
                                    <Select>
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
                            <Button
                                variant="destructive"
                                size="icon"
                                onClick={() => removeField(field.id)}
                            >
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </div>
                    ))}
                </div>
            </div>
            <Button onClick={handlePublish} className="mt-4" disabled={fields.length === 0}>
                Publish Form
            </Button>
        </div>
    );
}