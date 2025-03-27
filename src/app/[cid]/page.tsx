import { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";

const data = [
  {
    id: 67,
    name: "Advanced Web Development Certification",
    url: "https://arxiv.org/pdf/2312.07549.pdf",
    participant: {
      name: "John Michael Smith",
      email: "john.smith@example.com",
      profilePic: "https://randomuser.me/api/portraits/men/1.jpg",
    },
  },
  {
    id: 68,
    name: "Data Science Professional Diploma",
    url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    participant: {
      name: "Emily Rose Chen",
      email: "emily.chen@example.com",
      profilePic: "https://randomuser.me/api/portraits/women/2.jpg",
    },
  },
  {
    id: 69,
    name: "Project Management Masterclass Certificate",
    url: "https://www.iso.org/files/live/sites/isoorg/files/archive/pdf/en/annual_report_2022.pdf",
    participant: {
      name: "Ahmed Hassan Mohammed",
      email: "ahmed.mohammed@example.com",
      profilePic: "https://randomuser.me/api/portraits/men/3.jpg",
    },
  },
  {
    id: 70,
    name: "Artificial Intelligence Specialist Certification",
    url: "https://www.un.org/development/desa/publications/world-population-prospects-2022.pdf",
    participant: {
      name: "Sofia Elena Rodriguez",
      email: "sofia.rodriguez@example.com",
      profilePic: "https://randomuser.me/api/portraits/women/4.jpg",
    },
  },
  {
    id: 71,
    name: "Cloud Computing Professional Certification",
    url: "https://openaccess.city.ac.uk/id/eprint/24147/1/PhD_THESIS_AKINWANDE.pdf",
    participant: {
      name: "Raj Kumar Patel",
      email: "raj.patel@example.com",
      profilePic: "https://randomuser.me/api/portraits/men/5.jpg",
    },
  },
  {
    id: 72,
    name: "Cybersecurity Advanced Training Certificate",
    url: "https://www.africle.org/download/sample-research-paper.pdf",
    participant: {
      name: "Lisa Marie Johnson",
      email: "lisa.johnson@example.com",
      profilePic: "https://randomuser.me/api/portraits/women/6.jpg",
    },
  },
  {
    id: 73,
    name: "Machine Learning Expert Diploma",
    url: "https://ntrs.nasa.gov/api/citations/20200001708/downloads/20200001708.pdf",
    participant: {
      name: "David Alexander Wong",
      email: "david.wong@example.com",
      profilePic: "https://randomuser.me/api/portraits/men/7.jpg",
    },
  },
  {
    id: 74,
    name: "Digital Marketing Professional Certification",
    url: "https://www.press.jhu.edu/sites/default/files/2023-08/Sample_PDF.pdf",
    participant: {
      name: "Olivia Grace Kim",
      email: "olivia.kim@example.com",
      profilePic: "https://randomuser.me/api/portraits/women/8.jpg",
    },
  },
];

export type Certificate = (typeof data)[number];

export async function generateMetadata({
  params,
}: {
  params: { cid: string };
}): Promise<Metadata> {
  const cid = parseInt(params.cid);
  const c = data.filter((d) => d.id === cid).findLast((c) => c);

  if (!c) return {};

  return {
    title: `Certificate: ${c.name} - ${c.participant.name}`,
    description: `Certification of achievement for ${c.participant.name} in ${c.name}`,
    openGraph: {
      title: `${c.participant.name} - ${c.name} Certificate`,
      description: `Certified achievement in ${c.name}`,
      images: [
        {
          url: c.participant.profilePic,
          width: 400,
          height: 400,
          alt: `${c.participant.name}'s Profile Picture`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `Certificate: ${c.name}`,
      description: `Certification for ${c.participant.name}`,
      images: [c.participant.profilePic],
    },
    alternates: {
      canonical: `/certificate/${c.id}`,
    },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ cid: string }>;
}) {
  const { cid } = await params;
  const c = data.filter((d) => d.id === parseInt(cid)).findLast((c) => c);

  if (!c) notFound();

  return (
    <main className="flex flex-col gap-4 w-full items-center min-h-screen py-8 px-4 sm:py-16">
      <p className="text-base sm:text-xl text-center animate-blur text-muted-foreground mb-2">
        This is to certify that
      </p>
      <Image
        src={c.participant.profilePic}
        height={100}
        width={100}
        className="rounded-full animate-blur delay-75 border-border border-4 sm:h-[120px] sm:w-[120px]"
        alt={`${c.participant}'s Profile Picture`}
      />
      <div className="text-center">
        <p className="text-xl sm:text-2xl animate-blur delay-75">
          <b>{c.participant.name}</b>
        </p>
        <p className="text-sm sm:text-base text-muted-foreground animate-blur delay-75">
          {c.participant.email}
        </p>
      </div>
      <p className="text-base sm:text-lg italic text-foreground/60 animate-blur delay-100 mb-3 text-center">
        has successfully completed the
      </p>

      <h1 className="text-2xl sm:text-4xl animate-blur delay-150 font-bold text-center break-words w-full sm:w-2/3 md:w-1/2 bg-linear-90 from-foreground to-foreground/40 bg-clip-text text-transparent px-4">
        {c.name}
      </h1>

      <p className="text-base sm:text-xl text-foreground/80 animate-blur delay-200 font-mono mb-2 text-center px-4">
        {`" with outstanding performance and dedication "`}
      </p>
      <div className="text-xs sm:text-sm animate-blur delay-250 text-muted-foreground/50 italic text-center">
        Issued on: {new Date().toLocaleDateString()}
      </div>

      <Image
        src={"/seal.png"}
        alt="Company Seal"
        height={70}
        width={70}
        className="invert opacity-70 animate-blur delay-300 sm:h-[90px] sm:w-[90px]"
      />
    </main>
  );
}
