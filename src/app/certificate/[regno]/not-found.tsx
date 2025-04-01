export default function NotFound() {
  return (
    <div className="flex items-center h-svh flex-col gap-1 justify-center">
      <h1 className="text-3xl font-bold">Certificate Not Found</h1>
      <p className="text-neutral-600">
        Certificate my not found or removed from the repository
      </p>
    </div>
  );
}
