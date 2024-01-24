'use-client';
import { FileIcon, X } from 'lucide-react';
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
          className='absolute right-0 top-0 -translate-y-5 -scale-[.5] rounded-full bg-rose-400 p-2.5 text-white shadow-sm'
          onClick={() => onChange('')}
          type='button'
        >
          <X className='h-4 w-4' />
        </Button>
      </div>
    );
  }

  if (value && fileType === 'pdf') {
    return (
      <div className='relative mt-2 flex items-center rounded-md bg-background/10 p-2'>
        <FileIcon className='h-10 w-10 fill-indigo-200 stroke-indigo-400' />
        <a
          href={value}
          target='_blank'
          rel='noopener noreferrer'
          className='ml-2 text-sm text-indigo-500 hover:text-indigo-400 hover:underline'
        >
          {value}
        </a>
        <Button
          className='absolute -right-2 -top-2 -translate-y-5 -scale-[.5] rounded-full bg-rose-400 p-2.5 text-white shadow-sm'
          onClick={() => onChange('')}
          type='button'
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
      onUploadError={(error: Error) => console.log(error)}
    />
  );
}
