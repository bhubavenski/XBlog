'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { CaretSortIcon, CheckIcon } from '@radix-ui/react-icons';
import { SubmitHandler, useForm } from 'react-hook-form';
import { cn, getErrorMessage, isAsyncThunkConditionError } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  CreatePostFormValues,
  CreatePostSchema,
} from '../../../../resolvers/create-post-form.resolver';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { Input } from '@/components/ui/input';
import { useToast } from '../../../components/ui/use-toast';
import { useEffect } from 'react';
import { createPost } from './posts.slice';
import { fetchCategories } from '../categories/categorys.slice';

export default function CreatePostForm() {
  const dispatch = useAppDispatch();
  const categoryList = useAppSelector((state) => state.categories.categories);
  const { toast } = useToast();

  const form = useForm<CreatePostFormValues>({
    mode: 'onTouched',
    resolver: zodResolver(CreatePostSchema),
  });
  const { isSubmitting } = form.formState;

  const handleSubmit: SubmitHandler<CreatePostFormValues> = async (
    formData
  ) => {
    dispatch(createPost(formData));
  };

  useEffect(() => {
    const getCategoryList = async () => {
      try {
        await dispatch(fetchCategories()).unwrap();
      } catch (error) {
        if (!isAsyncThunkConditionError(error)) {
          // if its thunk condition error, better to not notify the user with this error
          const message = getErrorMessage(error);
          toast({
            variant: 'destructive',
            title: 'Uh oh! Something went wrong.',
            description: message,
          });
        }
      }
    };
    getCategoryList();
  }, [dispatch, toast]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-4 w-[400px]"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[#4070F4]">Title</FormLabel>
              <FormControl>
                <Input placeholder="title..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[#4070F4]">Content</FormLabel>
              <FormControl>
                <Input placeholder="content..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem className="flex flex-col ">
              <FormLabel className="text-[#4070F4]">Category</FormLabel>
              <Popover>
                <PopoverTrigger asChild className=" w-full">
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        'w-full justify-between',
                        !field.value && 'text-muted-foreground'
                      )}
                    >
                      {field.value || 'Select Category'}
                      <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[400px] p-0">
                  <Command>
                    <CommandInput
                      placeholder="Search category..."
                      className="h-9"
                    />
                    <CommandList className="">
                      <CommandEmpty>No categories found.</CommandEmpty>
                      <CommandGroup>
                        {categoryList &&
                          categoryList.map((item) => (
                            <CommandItem
                              value={item.name}
                              key={item.name}
                              onSelect={() => {
                                form.setValue('category', item.name);
                              }}
                            >
                              {item.name}
                              <CheckIcon
                                className={cn(
                                  'ml-auto h-4 w-4',
                                  item.name === field.value
                                    ? 'opacity-100'
                                    : 'opacity-0'
                                )}
                              />
                            </CommandItem>
                          ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* {postStatus === 'fulfield' && (
          <div className=" bg-emerald-500/15 text-emerald-500 rounded-lg px-3 py-1">
            Success
          </div>
        )}
        {postStatus === 'rejected' && (
          <div className=" bg-destructive/15 text-destructive rounded-lg px-3 py-1">
            {postError}
          </div>
        )} */}
        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-[#4070F4] w-full"
        >
          Submit
        </Button>
      </form>
    </Form>
  );
}
