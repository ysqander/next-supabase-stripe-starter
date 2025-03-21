'use client';

import { useTheme } from 'next-themes';
import { IoMoon, IoSunny } from 'react-icons/io5';

import { Button } from './button';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant='ghost'
      size='icon'
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className='h-9 w-9'
      aria-label='Toggle theme'
    >
      <IoSunny className='h-5 w-5 rotate-0 scale-100 transition-transform dark:-rotate-90 dark:scale-0' />
      <IoMoon className='absolute h-5 w-5 rotate-90 scale-0 transition-transform dark:rotate-0 dark:scale-100' />
    </Button>
  );
}
