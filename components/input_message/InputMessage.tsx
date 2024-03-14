import { InputMessage } from "./types";

export default function Message({data}: {data: InputMessage}) {
  return (
    <span className={`text-${data.color}`}>
      {data.message}
    </span>
  );
}