export default function Spinner() {
  return (
    <div className="flex h-screen items-center justify-center bg-[#060C11]">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-600 border-t-white" />
    </div>
  );
}