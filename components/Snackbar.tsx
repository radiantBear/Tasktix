'use client';

import { useCallback, useEffect, useState } from "react";
import { generateId } from "@/lib/generateId";
import { setTimeout } from "timers";


export interface SnackbarFns {
  add: (message: SnackbarMessage['message'], color: SnackbarMessage['color']) => string;
  remove: (id: string) => void;
}

export interface SnackbarMessage {
  id: string;
  message: string;
  color: 'default'|'success'|'warning'|'error';
}


export let addSnackbar: SnackbarFns['add'];
export let removeSnackbar: SnackbarFns['remove'];


export default function Snackbar() {
  const [snackbarQueue, setSnackbarQueue] = useState<SnackbarMessage[]>([]);

  /* Copied styles from https://github.com/nextui-org/nextui/blob/main/packages/core/theme/src/utils/variants.ts for consistency */
  const styles: any = {
    default: "bg-default/40 text-default-foreground",
    success: "bg-success/20 text-success-600 dark:text-success",
    warning: "bg-warning/20 text-warning-600 dark:text-warning",
    error: "bg-danger/20 text-danger dark:text-danger-500",
  };

  addSnackbar = useCallback((message: SnackbarMessage['message'], color: SnackbarMessage['color'] = 'default') => {
    const id = generateId();
    setSnackbarQueue(snackbarQueue => [...snackbarQueue, {id, message, color}]);
    return id;
  }, []);

  removeSnackbar = useCallback((id: string) => {
    setSnackbarQueue(snackbarQueue => snackbarQueue.filter(item => item.id != id));
  }, []);

  /* 5 seconds after rendering this snackbar message, render the next one by removing this one */
  useEffect(() => {
    if(snackbarQueue.length > 0)
      setTimeout(() => removeSnackbar(snackbarQueue[0].id), 5000);
  }, [snackbarQueue]);
  
  return (
    <div className='absolute bottom-0 right-0 w-96 overflow-x-clip'>
      <div key={snackbarQueue[0] ? snackbarQueue[0].id : 'empty' } className={`bg-background/50 backdrop-blur-md z-50 absolute bottom-4 w-80 p-0 flex overflow-hidden rounded-md ${snackbarQueue[0] ? 'animate-slide-from-right right-4' : 'right-[-20rem]'}`}>
        <span className={`w-full h-full py-2 px-3 grow ${snackbarQueue[0] ? styles[snackbarQueue[0].color] : styles.default}`}>
          {snackbarQueue[0] ? snackbarQueue[0].message : ''}
        </span>
      </div>
    </div>
  );
}