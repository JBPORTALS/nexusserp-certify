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
  if (!c) {
    return {
      title: "Certificate Not Found",
      description: "The requested certificate could not be found.",
      openGraph: {
        title: "Certificate Not Found",
        description: "This certificate might not exist or has been removed.",
        url: `/certificate/${regno}`,
      },
    };
  }

  const pronoun =
    c.participant.gender?.toUpperCase() === "MALE" ? "his" : "her";
  const internshipDuration = `${c.start_date} to ${c.end_date}`;
  const previewUrl = `/api/certificate-preview?regno=${c.regno}`;

  return {
    title: `${c.participant.name} - ${c.name} | JB PORTALS`,
    description: `Official Internship Certificate for ${c.participant.name}, who successfully completed ${pronoun} internship as a ${c.participant.role} at JB PORTALS from ${internshipDuration}.`,
    openGraph: {
      title: `${c.participant.name} - ${c.name} | JB PORTALS`,
      description: `${c.participant.name} successfully completed ${pronoun} Internship in ${c.participant.role} at JB PORTALS from ${internshipDuration}. View the official certificate.`,
      url: `/certificate/${c.regno}`,
      type: "article",
      images: [
        {
          url: previewUrl,
          width: 480,
          height: 540,
          alt: "Internship Certificate Preview",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${c.name} | ${c.participant.name}`,
      description: `${c.participant.name} has successfully completed ${pronoun} Internship as a ${c.participant.role} at JB PORTALS. View the official certificate.`,
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
