'use-client';
import { X } from 'lucide-react';
import Image from 'next/image';
import { UploadDropzone } from '@/lib/uploadthing';
import '@uploadthing/react/styles.css';
import { Button } from './ui/button';

interface FileUploadProps {
  endpoint: 'messageFile' | 'serverImage';
  value: string;
  onChange: (url: string) => void;
}

export function FileUpload({ endpoint, value, onChange }: FileUploadProps) {
  const fileType = value?.split('.').pop();
  if (value && fileType !== 'pdf') {
    return (
      <div className='relative h-20 w-20'>
        <Image fill src={value} alt='Upload' className='rounded-full' />
        <Button
          className='absolute right-0 top-0 rounded-full bg-rose-400 p-1 text-white shadow-sm'
          onClick={() => onChange('')}
        >
          <X className='h-4 w-4' />
        </Button>
      </div>
    );
  }
  return (
    <UploadDropzone
      endpoint={endpoint}
      onClientUploadComplete={(res) => onChange(res?.[0].url)}
      onUploadError={console.log}
    />
  );
}
