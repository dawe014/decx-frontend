export default function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center h-full min-h-[300px]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
    </div>
  );
}
