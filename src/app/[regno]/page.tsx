import { Metadata } from "next";
import { notFound } from "next/navigation";

export type Certificate = {
  id: string;
  certificate_number: string;
  regno: string;
  name: string;
  url: string;
  start_date: string;
  end_date: string;
  participant: {
    name: string;
    gender: string;
    role: string;
  };
};

async function getCertificate(regno: string) {
  const res = await fetch(
    `https://api.nexusserp.com/api/certificates/getByRegNo.php?regno=${regno}`
  );

  if (!res.ok) {
    console.log(await res.json());
    return null;
  }

  return res.json() as Promise<Certificate>;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ regno: string }>;
}): Promise<Metadata> {
  const { regno } = await params;
  const c = await getCertificate(regno);
  console.log(c);
  if (!c) return {};

  const pronoun =
    c.participant.gender?.toUpperCase() === "MALE" ? "his" : "her";
  const previewUrl = `/api/certificate-preview?regno=${regno}`;

  return {
    title: `${c.participant.name} - ${c.name} | JB PORTALS`,
    description: `Official Internship Certificate for ${c.participant.name}, who successfully completed ${pronoun} internship at JB PORTALS.`,
    openGraph: {
      title: `${c.participant.name} - ${c.name}`,
      description: `${c.participant.name} successfully completed ${pronoun} Internship at JB PORTALS.`,
      url: `/certificate/${c.regno}`,
      type: "article",
      images: [
        {
          url: previewUrl,
          width: 1200,
          height: 630,
          alt: "Internship Certificate Preview",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${c.name} | ${c.participant.name}`,
      description: `Internship Certificate for ${c.participant.name}. View the official certificate.`,
      images: [previewUrl],
    },
    alternates: {
      canonical: `/certificate/${c.regno}`,
    },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ regno: string }>;
}) {
  const { regno } = await params;
  const c = await getCertificate(regno);

  console.log(c);

  if (!c) notFound();

  return <embed src={c.url} type="application/pdf" className="h-svh w-svw" />;
}
