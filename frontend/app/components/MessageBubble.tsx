// app/components/MessageBubble.tsx

export default function MessageBubble({ msg }: any) {
  return (
    <div
      className={`max-w-[80%] p-4 rounded-2xl ${
        msg.role === "user"
          ? "bg-blue-600 text-white ml-auto"
          : "bg-white border"
      }`}
    >
      <p className="text-sm">{msg.text}</p>
    </div>
  );
}