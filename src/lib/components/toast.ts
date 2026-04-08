import { writable } from 'svelte/store';

export const toast = writable<string>('');

let timer: ReturnType<typeof setTimeout> | null = null;

export function pushToast(msg: string, ms = 1800) {
  toast.set(msg);
  if (timer) clearTimeout(timer);
  timer = setTimeout(() => toast.set(''), ms);
}
