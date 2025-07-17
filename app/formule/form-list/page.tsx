"use client"

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface FormItem {
    name: string;
    route: string;
}

export default function FormListView() {
    const [forms, setForms] = useState<FormItem[]>([]); // Replace with API fetch in production
    const [newRoute, setNewRoute] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const router = useRouter();

    const handleAddForm = async () => {

        if (newRoute) {
            // In production, save to backend or local storage
            setForms([...forms, { name: newRoute, route: newRoute }]);

            try {
                const response = await fetch('/api/routes-list', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ newRoute }),
                });

                if (!response.ok) {
                    throw new Error('Failed to publish form');
                }

                const data = await response.json();
                console.log(data.message);
            } catch (error) {
                console.error('Error creating route:', error);
            }

            router.push(`form-builder/${newRoute}`);
            setNewRoute('');
            setIsModalOpen(false);
        }
    };


    return (
        <div className="p-6 max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Form List</h2>
                <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="w-4 h-4 mr-2" /> Add Form
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Create New Form</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Route Name</label>
                                <Input
                                    value={newRoute}
                                    onChange={(e) => setNewRoute(e.target.value.replace(/[^a-zA-Z0-9-]/g, ''))}
                                    placeholder="e.g., contact-form"
                                />
                            </div>
                            <Button onClick={handleAddForm} disabled={!newRoute}>
                                Create
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
            <div className="border rounded-lg p-4">
                {forms.length === 0 ? (
                    <p className="text-gray-500">No forms created yet.</p>
                ) : (
                    <ul className="space-y-2">
                        {forms.map((form) => (
                            <li key={form.route} className="flex justify-between items-center p-2 border-b">
                                <span>{form.name}</span>
                                <Button
                                    variant="outline"
                                    onClick={() => router.push(`form-builder/${form.route}`)}
                                >
                                    Edit
                                </Button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}