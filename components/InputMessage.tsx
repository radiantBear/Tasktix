export interface InputMessage {
  message: React.ReactNode|string;
  color: 'default'|'success'|'warning'|'danger';
}

export default function Message({data}: {data: InputMessage}) {
  return (
    <span className={`text-${data.color}`}>
      {data.message}
    </span>
  );
}