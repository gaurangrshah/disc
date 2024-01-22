'use client';

import { useState } from 'react';
import axios from 'axios';
import { Check, Copy, RefreshCw } from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

import { modalTypes, useModal } from '@/hooks/use-modal-store';
import { useOrigin } from '@/hooks/use-origin';

export const LeaveServerModal = () => {
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { onOpen, isOpen, onClose, type, data } = useModal();
  const isModalOpen = isOpen && type === modalTypes.leaveServer; // derive modal state from store

  const { server } = data;
  const origin = useOrigin();
  const inviteUrl = `${origin}/invite/${server?.inviteCode}`;

  const onCopy = () => {
    navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1000);
  };

  // regenerate invite link
  const onNew = async () => {
    try {
      setIsLoading(true);
      const response = await axios.patch(
        `/api/servers/${server?.id}/invite-code`
      );

      // re-open modal with updated server data
      onOpen('invite', { server: response.data });
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className='overflow-hidden bg-white p-0 text-black'>
        <DialogHeader className='px-6 pt-8'>
          <DialogTitle className='text-center text-2xl font-bold'>
            Invite Your Friends
          </DialogTitle>
        </DialogHeader>
        <div className='p-6'>
          <Label className='text-xs font-bold uppercase text-zinc-500 dark:text-secondary/70'>
            Server invite link
          </Label>
          <div className='mt-2 flex items-center gap-x-2'>
            <Input
              className='border-0 bg-zinc-300/50 text-black focus-visible:ring-0 focus-visible:ring-offset-0 dark:text-[#999999]'
              value={inviteUrl}
              disabled={isLoading}
            />
            <Button size='icon' onClick={onCopy} disabled={isLoading}>
              {copied ? (
                <Check className='h-4 w-4' />
              ) : (
                <Copy className='h-4 w-4' />
              )}
            </Button>
          </div>
          <Button
            variant='link'
            size='sm'
            className='mt-4 text-xs text-zinc-500'
            disabled={isLoading}
            onClick={onNew}
          >
            Generate a new link
            <RefreshCw className='ml-2 h-4 w-4' />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
