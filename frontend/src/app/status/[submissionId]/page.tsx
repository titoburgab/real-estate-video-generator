import { StatusPoller } from "@/components/StatusPoller";

export default async function StatusPage({
  params,
}: {
  params: Promise<{ submissionId: string }>;
}) {
  const { submissionId } = await params;

  return (
    <main className="room-scene flex min-h-screen flex-col items-center justify-center px-6 py-16">
      <div className="mx-auto flex w-full max-w-xl flex-col items-center">
        <StatusPoller submissionId={submissionId} />
      </div>
    </main>
  );
}
