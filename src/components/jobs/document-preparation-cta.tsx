import React from 'react';
import Link from 'next/link';
import { Camera, PenTool, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function DocumentPreparationCTA() {
  return (
    <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-primary/10 rounded-full blur-xl pointer-events-none" />

      <h3 className="font-heading font-bold text-xl mb-2 text-foreground">Prepare Your Photo &amp; Signature for Government Applications</h3>
      <p className="text-secondary-text text-sm mb-6 max-w-sm">
        Prepare image files to match the document specifications stated in your recruitment notification. Always verify the required dimensions, file size, format, and other conditions in the official notification.
      </p>

      <div className="flex flex-col gap-3">
        <Link href="/exam-tools" className="w-full">
          <Button className="w-full justify-between group" variant="default">
            <span className="flex items-center"><Camera className="w-4 h-4 mr-2" /> Open Exam Document Studio</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
        <Link href="/exam-tools/custom?type=photo" className="w-full">
          <Button className="w-full justify-start text-secondary-text" variant="outline">
            <PenTool className="w-4 h-4 mr-2" /> Prepare Photograph
          </Button>
        </Link>
        <Link href="/exam-tools/custom?type=signature" className="w-full">
          <Button className="w-full justify-start text-secondary-text" variant="outline">
            <PenTool className="w-4 h-4 mr-2" /> Prepare Signature
          </Button>
        </Link>
      </div>
    </div>
  );
}
