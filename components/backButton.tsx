"use client";
import { useRouter } from "next/navigation";

const BackButton = () => {
  const router = useRouter();
  return (
    <div>
      <button onClick={() => router.back()}>Back</button>
    </div>
  );
};

export default BackButton;
