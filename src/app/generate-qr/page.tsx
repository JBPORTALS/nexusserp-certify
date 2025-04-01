"use client";

import { useState } from "react";
import QRCode from "qrcode";
import JSZip from "jszip";
import { saveAs } from "file-saver";

export default function Home() {
  const [regNumbers, setRegNumbers] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const generateQRCodes = async () => {
    if (!regNumbers.trim()) {
      setStatus("Please enter registration numbers");
      return;
    }

    setLoading(true);
    setStatus("Generating QR codes...");

    try {
      // Parse registration numbers (accepts numbers separated by comma, space, or new line)
      const regNos = regNumbers
        .split(/[\n,\s]+/)
        .map((no) => no.trim())
        .filter((no) => no);

      if (regNos.length === 0) {
        setStatus("No valid registration numbers found");
        setLoading(false);
        return;
      }

      // Create a zip file to store all QR codes
      const zip = new JSZip();
      const folder = zip.folder("qrcodes");

      // Generate QR code for each registration number
      for (const regNo of regNos) {
        const url = `https://localhost:3000/${regNo}`;

        // Generate QR code as data URL
        const qrDataUrl = await QRCode.toDataURL(url, {
          width: 300,
          margin: 2,
          color: {
            dark: "#000000",
            light: "#ffffff",
          },
        });

        // Convert data URL to binary data
        const binaryData = atob(qrDataUrl.split(",")[1]);
        const array = new Uint8Array(binaryData.length);
        for (let i = 0; i < binaryData.length; i++) {
          array[i] = binaryData.charCodeAt(i);
        }

        // Add to zip
        folder?.file(`${regNo}.png`, array, { binary: true });
      }

      // Generate and download the zip file
      const content = await zip.generateAsync({ type: "blob" });
      saveAs(content, "qrcodes.zip");

      setStatus(`Successfully generated ${regNos.length} QR codes`);
    } catch (error: any) {
      setStatus(`Error: ${error.message}`);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-2xl font-bold mb-4">QR Code Generator</h1>

      <div className="mb-4">
        <label className="block mb-2">
          Enter registration numbers (one per line or comma-separated):
        </label>
        <textarea
          className="w-full p-2 border rounded h-64"
          value={regNumbers}
          onChange={(e) => setRegNumbers(e.target.value)}
          placeholder="e.g. REG001&#10;REG002&#10;REG003"
        />
      </div>

      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:bg-gray-400"
        onClick={generateQRCodes}
        disabled={loading}
      >
        {loading ? "Generating..." : "Generate QR Codes"}
      </button>

      {status && <div className="mt-4 p-2 bg-gray-100 rounded">{status}</div>}
    </div>
  );
}
