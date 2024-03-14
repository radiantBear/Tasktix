export interface SnackbarFns {
  add: (message: SnackbarMessage['message'], color: SnackbarMessage['color']) => string;
  remove: (id: string) => void;
}

export interface SnackbarMessage {
  id: string;
  message: string;
  color: 'default'|'success'|'warning'|'error';
}
