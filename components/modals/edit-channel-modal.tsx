'use client';

import { useEffect } from 'react';
import axios from 'axios';
import qs from 'query-string';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { ChannelType } from '@prisma/client';
import { useRouter } from 'next/navigation';

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '../ui/input';
import { Button } from '../ui/button';

import { modalTypes, useModal } from '@/hooks/use-modal-store';

const formSchema = z.object({
  name: z
    .string()
    .min(1, {
      message: 'Channel name is required',
    })
    .refine((name) => name !== 'general', {
      message: 'Channel name cannot be "general"',
    }),
  type: z.nativeEnum(ChannelType),
});

export const EditChannelModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const isModalOpen = isOpen && type === modalTypes.editChannel; // derive modal state from store
  const { server, channel } = data;

  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: channel?.name || '',
      type: channel?.type || ChannelType.TEXT,
    },
  });

  useEffect(() => {
    if (channel) {
      form.setValue('name', channel.name);
      form.setValue('type', channel.type);
    }
  }, [form, channel]);

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const url = qs.stringifyUrl({
        url: `/api/channels/${channel?.id}`,
        query: {
          serverId: server?.id,
        },
      });
      await axios.patch(url, values);

      form.reset();
      router.refresh();
      onClose();
    } catch (error) {
      console.log(error);
    }
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className='overflow-hidden bg-white p-0 text-black'>
        <DialogHeader className='px-6 pt-8'>
          <DialogTitle className='text-center text-2xl font-bold'>
            Edit channel
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
            <div className='space-y-8 px-6'>
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel
                      className='text-xs font-bold uppercase text-zinc-500'
                      htmlFor='name'
                    >
                      Channel Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        className='border-0 bg-zinc-300/50 text-black focus-visible:ring-0 focus-visible:ring-offset-0'
                        placeholder='Enter a channel name'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='type'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor='type'>Channel Type</FormLabel>
                    <Select
                      // disabled={isLoading}
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className='border-0 bg-zinc-300/50 capitalize text-black outline-none ring-offset-0 focus:ring-0 focus:ring-offset-0'>
                          <SelectValue placeholder='Select a channel type' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.values(ChannelType).map((type) => (
                          <SelectItem
                            key={type}
                            value={type}
                            className='capitalize'
                          >
                            {type.toLowerCase()}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter className='bg-gray-100 px-6 py-4'>
              <Button variant='primary' disabled={isLoading}>
                Save
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
