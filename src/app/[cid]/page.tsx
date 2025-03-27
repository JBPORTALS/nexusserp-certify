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

export default async function Page({
  params,
}: {
  params: Promise<{ cid: string }>;
}) {
  const { cid } = await params;
  const c = data.filter((d) => d.id === parseInt(cid)).findLast((c) => c);

  if (!c) notFound();

  return (
    <div className="flex flex-col gap-4 w-full items-center h-svh py-16">
      <p className="text-xl animate-blur text-muted-foreground mb-2">
        This is to certify that
      </p>
      <Image
        src={c.participant.profilePic}
        height={120}
        width={120}
        className="rounded-full animate-blur delay-75 border-border border-4"
        alt={`${c.participant}'s Profile Picture`}
      />
      <div>
        <p className="text-2xl animate-blur delay-75 text-center">
          <b>{c.participant.name}</b>
        </p>
        <p className="text-muted-foreground animate-blur delay-75 text-center">
          {c.participant.email}
        </p>
      </div>
      <p className="text-lg italic text-foreground/60 animate-blur delay-100 mb-3">
        has successfully completed the
      </p>

      <h1 className="text-4xl animate-blur delay-150  font-bold text-center break-words w-1/3 bg-linear-90 from-foreground to-foreground/40 bg-clip-text text-transparent">
        {c.name}
      </h1>

      <p className="text-xl text-foreground/80 animate-blur delay-200 font-mono mb-2">
        " with outstanding performance and dedication "
      </p>
      <div className="text-sm animate-blur delay-250 text-muted-foreground/50 italic">
        Issued on: {new Date().toLocaleDateString()}
      </div>

      <Image
        src={"/seal.png"}
        alt="Company Seal"
        height={90}
        width={90}
        className="invert opacity-70 animate-blur delay-300"
      />
    </div>
  );
}
