"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { upload } from "@vercel/blob/client";
import { submitIntake } from "@/app/actions";
import type { IntakePayload } from "@/lib/types";
import { PhotoTile } from "@/components/PhotoTile";

type Photos = {
  photo1: File | null;
  photo2: File | null;
  photo3: File | null;
  photo4: File | null;
  realtor: File | null;
};

const emptyPhotos: Photos = {
  photo1: null,
  photo2: null,
  photo3: null,
  photo4: null,
  realtor: null,
};

async function uploadPhoto(file: File, prefix: string) {
  return upload(`${prefix}-${Date.now()}-${file.name}`, file, {
    access: "public",
    handleUploadUrl: "/api/blob-upload",
  });
}

export function IntakeForm() {
  const router = useRouter();
  // Generated client-side only, after mount — computing this during render
  // would run once on the server and again on the client, and the two
  // random values would mismatch during hydration.
  const [fileNo, setFileNo] = useState<number | null>(null);
  useEffect(() => {
    setFileNo(Math.floor(1000 + Math.random() * 9000));
  }, []);

  const [photos, setPhotos] = useState<Photos>(emptyPhotos);
  const [fields, setFields] = useState({
    address: "",
    price: "",
    beds: "",
    baths: "",
    sqft: "",
    yearBuilt: "",
    keyFeatures: "",
    description: "",
    submitterEmail: "",
  });
  const [status, setStatus] = useState<"idle" | "uploading" | "submitting">(
    "idle",
  );
  const [error, setError] = useState<string | null>(null);

  const allPhotosSelected =
    photos.photo1 &&
    photos.photo2 &&
    photos.photo3 &&
    photos.photo4 &&
    photos.realtor;

  function updateField(name: keyof typeof fields, value: string) {
    setFields((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!allPhotosSelected) {
      setError("All five photos are required before you can cut the trailer.");
      return;
    }

    try {
      setStatus("uploading");
      const [photo1, photo2, photo3, photo4, realtorPhoto] = await Promise.all([
        uploadPhoto(photos.photo1!, "photo1"),
        uploadPhoto(photos.photo2!, "photo2"),
        uploadPhoto(photos.photo3!, "photo3"),
        uploadPhoto(photos.photo4!, "photo4"),
        uploadPhoto(photos.realtor!, "realtor"),
      ]);

      setStatus("submitting");
      const payload: IntakePayload = {
        ...fields,
        photo1Url: photo1.url,
        photo2Url: photo2.url,
        photo3Url: photo3.url,
        photo4Url: photo4.url,
        realtorPhotoUrl: realtorPhoto.url,
      };

      const { submissionId } = await submitIntake(payload);
      router.push(`/status/${submissionId}`);
    } catch (err) {
      setStatus("idle");
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong submitting the listing.",
      );
    }
  }

  const busy = status !== "idle";

  return (
    <div className="paper-scene min-h-screen">
      <div className="mx-auto flex max-w-2xl flex-col items-center px-6 py-16">
        <div className="stamp-badge">
          <span className="stamp-badge__title">Listing Intake</span>
          <span className="stamp-badge__file">
            File No. {fileNo ?? "----"}
          </span>
        </div>

        <h1 className="mt-8 text-center font-display text-3xl leading-tight text-ink sm:text-4xl">
          Turn the listing into a trailer.
        </h1>
        <p className="mt-3 max-w-md text-center text-ink-muted">
          Hand over the photos and the details. We cut a branded walkthrough
          video while you get back to showing houses.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-10 w-full rounded-lg border border-brass/30 bg-paper-card px-6 py-8 shadow-[0_1px_0_rgba(0,0,0,0.06)] sm:px-10"
        >
          <section>
            <p className="slip-eyebrow">Property</p>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <label className="col-span-full flex flex-col gap-1">
                <span className="text-sm text-ink-muted">Address</span>
                <input
                  required
                  value={fields.address}
                  onChange={(e) => updateField("address", e.target.value)}
                  placeholder="1234 Parker Street, Los Angeles, CA 90045"
                  className="rounded border border-brass/40 bg-white/60 px-3 py-2 text-ink outline-none"
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-sm text-ink-muted">Price</span>
                <input
                  required
                  value={fields.price}
                  onChange={(e) => updateField("price", e.target.value)}
                  placeholder="$1,252,000"
                  className="rounded border border-brass/40 bg-white/60 px-3 py-2 text-ink outline-none"
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-sm text-ink-muted">Year built</span>
                <input
                  required
                  value={fields.yearBuilt}
                  onChange={(e) => updateField("yearBuilt", e.target.value)}
                  placeholder="1998"
                  className="rounded border border-brass/40 bg-white/60 px-3 py-2 text-ink outline-none"
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-sm text-ink-muted">Beds</span>
                <input
                  required
                  value={fields.beds}
                  onChange={(e) => updateField("beds", e.target.value)}
                  placeholder="4"
                  className="rounded border border-brass/40 bg-white/60 px-3 py-2 text-ink outline-none"
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-sm text-ink-muted">Baths</span>
                <input
                  required
                  value={fields.baths}
                  onChange={(e) => updateField("baths", e.target.value)}
                  placeholder="2"
                  className="rounded border border-brass/40 bg-white/60 px-3 py-2 text-ink outline-none"
                />
              </label>
              <label className="col-span-full flex flex-col gap-1 sm:col-span-1">
                <span className="text-sm text-ink-muted">Square feet</span>
                <input
                  required
                  value={fields.sqft}
                  onChange={(e) => updateField("sqft", e.target.value)}
                  placeholder="2123"
                  className="rounded border border-brass/40 bg-white/60 px-3 py-2 text-ink outline-none"
                />
              </label>
              <label className="col-span-full flex flex-col gap-1">
                <span className="text-sm text-ink-muted">Key features</span>
                <textarea
                  value={fields.keyFeatures}
                  onChange={(e) => updateField("keyFeatures", e.target.value)}
                  placeholder="Renovated kitchen, pool, corner lot"
                  rows={2}
                  className="rounded border border-brass/40 bg-white/60 px-3 py-2 text-ink outline-none"
                />
              </label>
              <label className="col-span-full flex flex-col gap-1">
                <span className="text-sm text-ink-muted">Description</span>
                <textarea
                  value={fields.description}
                  onChange={(e) => updateField("description", e.target.value)}
                  placeholder="A few sentences for the listing page."
                  rows={3}
                  className="rounded border border-brass/40 bg-white/60 px-3 py-2 text-ink outline-none"
                />
              </label>
            </div>
          </section>

          <hr className="ledger-rule" />

          <section>
            <p className="slip-eyebrow">Photos</p>
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-5">
              <PhotoTile
                label="Photo 1"
                file={photos.photo1}
                onChange={(f) => setPhotos((p) => ({ ...p, photo1: f }))}
              />
              <PhotoTile
                label="Photo 2"
                file={photos.photo2}
                onChange={(f) => setPhotos((p) => ({ ...p, photo2: f }))}
              />
              <PhotoTile
                label="Photo 3"
                file={photos.photo3}
                onChange={(f) => setPhotos((p) => ({ ...p, photo3: f }))}
              />
              <PhotoTile
                label="Photo 4"
                file={photos.photo4}
                onChange={(f) => setPhotos((p) => ({ ...p, photo4: f }))}
              />
              <PhotoTile
                label="You"
                sublabel="closing shot"
                file={photos.realtor}
                onChange={(f) => setPhotos((p) => ({ ...p, realtor: f }))}
              />
            </div>
          </section>

          <hr className="ledger-rule" />

          <section>
            <p className="slip-eyebrow">Your info</p>
            <label className="mt-4 flex flex-col gap-1">
              <span className="text-sm text-ink-muted">
                Email (matched to your agent profile)
              </span>
              <input
                required
                type="email"
                value={fields.submitterEmail}
                onChange={(e) => updateField("submitterEmail", e.target.value)}
                placeholder="you@example.com"
                className="rounded border border-brass/40 bg-white/60 px-3 py-2 text-ink outline-none"
              />
            </label>
          </section>

          {error && (
            <p className="mt-6 rounded border border-stamp/40 bg-stamp/10 px-3 py-2 text-sm text-stamp-dark">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={busy}
            className="mt-8 w-full rounded-md bg-stamp px-6 py-3 font-stamp text-sm uppercase tracking-widest text-paper-card transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {status === "uploading"
              ? "Uploading photos…"
              : status === "submitting"
                ? "Sending to the lab…"
                : "Cut the trailer →"}
          </button>
        </form>
      </div>
    </div>
  );
}
