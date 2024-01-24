'use client';

import { z } from 'zod';
import qs from 'query-string';
import axios from 'axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { Plus, Smile } from 'lucide-react';

import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useModal } from '@/hooks/use-modal-store';

interface ChatInputProps {
  apiUrl: string;
  query: Record<string, any>;
  name: string;
  type: 'conversation' | 'channel';
}

const formSchema = z.object({
  content: z.string().min(1),
});

export const ChatInput = ({ apiUrl, query, name, type }: ChatInputProps) => {
  const { onOpen } = useModal();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: '',
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const url = qs.stringifyUrl({
        url: apiUrl,
        query,
      });

      await axios.post(url, values);

      form.reset();
      router.refresh();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormControl>
          <FormField
            name='content'
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <div className='relative p-4 pb-6'>
                  <button
                    type='button'
                    onClick={() => onOpen('messageFile', { apiUrl, query })}
                    className='dark:hover:bg-zing-300 absolute left-8 top-7 flex h-[24px] w-[24px] items-center justify-center rounded-full bg-zinc-500 p-1 transition hover:bg-zinc-600 dark:bg-zinc-400'
                  >
                    <Plus className='text-white dark:text-[#313338]' />
                  </button>
                  <Input
                    {...field}
                    disabled={isLoading}
                    placeholder={`Message ${type === 'conversation' ? name : '# ' + name}`}
                    className='bg-zin-200/90 border-0 border-none px-14 py-6 text-zinc-600 focus-visible:ring-0 focus-visible:ring-offset-0 dark:bg-zinc-700/75 dark:text-zinc-200'
                  />
                  <div className='absolute right-8 top-7'>
                    <Smile className='' />
                  </div>
                </div>
              </FormItem>
            )}
          />
        </FormControl>
      </form>
    </Form>
  );
};
