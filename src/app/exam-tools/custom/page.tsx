"use client";

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { EXAM_DATABASE } from '@/lib/data/exams';

function CustomRequirementsForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultType = searchParams.get('type') || 'photo';

  const [width, setWidth] = useState('350');
  const [height, setHeight] = useState('450');
  const [minKB, setMinKB] = useState('20');
  const [maxKB, setMaxKB] = useState('50');
  const [docType, setDocType] = useState(defaultType);

  const handleCreateCustom = () => {
    const customId = 'custom-' + Date.now();

    EXAM_DATABASE.push({
      id: customId,
      name: 'Custom Requirements',
      organization: 'User Defined',
      category: 'Other',
      slug: customId,
      sourceUrl: null,
      lastVerified: new Date().toISOString().split('T')[0],
      verificationStatus: 'Verified',
      active: true,
      notes: 'Custom dimensions and sizes set by you.',
      requirements: {
        [docType]: {
          documentType: docType as any,
          format: ['jpg', 'jpeg'],
          width: parseInt(width) || null,
          height: parseInt(height) || null,
          unit: 'px',
          minKB: parseInt(minKB) || 0,
          maxKB: parseInt(maxKB) || 100,
          aspectRatio: (parseInt(width) && parseInt(height)) ? parseInt(width) / parseInt(height) : null,
          nameRequired: false,
          dateRequired: false,
          backgroundRequirement: null,
          notes: null,
        }
      }
    });

    router.push(`/exam-tools/studio?exam=${customId}&type=${docType}`);
  };

  return (
    <div className="bg-card border border-border p-6 rounded-xl space-y-6">
      <div className="space-y-2">
        <Label>Document Type</Label>
        <div className="flex gap-4">
          <Button
            variant={docType === 'photo' ? 'default' : 'outline'}
            className="w-full"
            onClick={() => setDocType('photo')}
          >
            Photograph
          </Button>
          <Button
            variant={docType === 'signature' ? 'default' : 'outline'}
            className="w-full"
            onClick={() => setDocType('signature')}
          >
            Signature
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Width (px)</Label>
          <Input type="number" value={width} onChange={e => setWidth(e.target.value)} placeholder="e.g. 350" />
        </div>
        <div className="space-y-2">
          <Label>Height (px)</Label>
          <Input type="number" value={height} onChange={e => setHeight(e.target.value)} placeholder="e.g. 450" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Minimum File Size (KB)</Label>
          <Input type="number" value={minKB} onChange={e => setMinKB(e.target.value)} placeholder="e.g. 20" />
        </div>
        <div className="space-y-2">
          <Label>Maximum File Size (KB)</Label>
          <Input type="number" value={maxKB} onChange={e => setMaxKB(e.target.value)} placeholder="e.g. 50" />
        </div>
      </div>

      <Button className="w-full mt-4" size="lg" onClick={handleCreateCustom}>
        Create & Open Studio
      </Button>
    </div>
  );
}

export default function CustomRequirementsPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">Custom Document Requirements</h1>
        <p className="text-secondary-text">Set your own dimensions and file size limits.</p>
      </header>

      <Suspense fallback={<div>Loading...</div>}>
        <CustomRequirementsForm />
      </Suspense>
    </div>
  );
}
