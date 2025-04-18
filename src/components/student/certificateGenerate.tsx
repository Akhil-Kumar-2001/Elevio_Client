import { toast } from 'react-toastify';
import jsPDF from 'jspdf';

interface CertificateGeneratorProps {
  courseTitle: string;
  username: string;
  completionDate?: string;
  certificateId?: string;
  instructorName?: string;
  logoImage?: string;
}

const CertificateGenerator: React.FC<CertificateGeneratorProps> = ({ 
  courseTitle, 
  username, 
  completionDate = new Date().toLocaleDateString(),
  certificateId = `EL-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
  instructorName = "Dr. Emily Johnson",
  logoImage = "/images/logo.png"
}) => {
  const generateCertificate = () => {
    if (!courseTitle || !username) {
      toast.error("Cannot generate certificate. Missing course or user information.");
      return;
    }

    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4',
    });

    // Clean gradient background
    doc.setFillColor(240, 248, 255); // Alice blue
    doc.rect(0, 0, 297, 210, 'F');
    doc.setFillColor(255, 250, 240); // Floral white
    doc.rect(15, 15, 267, 180, 'F');

    // Elegant border
    doc.setDrawColor(0, 64, 128); // Navy blue
    doc.setLineWidth(2);
    doc.roundedRect(15, 15, 267, 180, 10, 10);
    doc.setDrawColor(139, 69, 19); // Saddle brown
    doc.setLineWidth(0.5);
    doc.rect(20, 20, 257, 170);

    // Logo with image
    if (logoImage) {
      try {
        doc.addImage(logoImage, 'PNG', 130.5, 22, 36, 36); // Adjust x, y, width, height to center and fit within 18mm radius circle
      } catch (error) {
        console.error("Failed to add logo image:", error);
        toast.error("Error loading logo image. Using default design.");
      }
    }
    doc.setDrawColor(0, 64, 128);
    doc.setLineWidth(1.5);
    doc.circle(148.5, 40, 18);

    // Certificate title
    doc.setFontSize(32);
    doc.setFont('times', 'bold');
    doc.setTextColor(139, 69, 19);
    doc.text('Certificate of Achievement', 148.5, 70, { align: 'center' });

    // Decorative line
    doc.setDrawColor(139, 69, 19);
    doc.setLineWidth(0.7);
    doc.line(90, 75, 207, 75);

    // Recognition text
    doc.setFontSize(16);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 64, 128);
    doc.text('This is to certify that', 148.5, 90, { align: 'center' });

    // Recipient name
    doc.setFontSize(24);
    doc.setFont('times', 'italic');
    doc.setTextColor(0, 64, 128);
    doc.text(username, 148.5, 105, { align: 'center' });

    // Decorative line under name
    doc.setDrawColor(139, 69, 19);
    doc.setLineWidth(0.5);
    doc.line(90, 110, 207, 110);

    // Achievement description
    doc.setFontSize(16);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 64, 128);
    doc.text('has successfully completed the course', 148.5, 125, { align: 'center' });

    // Course title
    doc.setFontSize(20);
    doc.setFont('times', 'bold');
    doc.setTextColor(139, 69, 19);
    const splitTitle = doc.splitTextToSize(courseTitle, 200);
    doc.text(splitTitle, 148.5, 140, { align: 'center' });

    // Date, certificate ID, and signature
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(105, 105, 105); // Dim gray
    doc.text(`Date: ${completionDate}`, 70, 170);
    doc.text(`Certificate ID: ${certificateId}`, 70, 175);
    doc.line(195, 170, 245, 170);
    doc.text(instructorName, 220, 175, { align: 'center' });

    // Footer with organization name
    doc.setFontSize(14);
    doc.setFont('times', 'italic');
    doc.setTextColor(0, 64, 128);
    doc.text('Elevio Learning', 148.5, 185, { align: 'center' });

    // Decorative seal
    doc.setFillColor(255, 215, 0); // Gold
    doc.circle(148.5, 195, 8, 'F');
    doc.setDrawColor(0, 64, 128);
    doc.setLineWidth(1);
    doc.circle(148.5, 195, 8);

    // Save the PDF
    doc.save(`Certificate_${courseTitle.replace(/\s+/g, '_')}_${username.replace(/\s+/g, '_')}.pdf`);
    
    toast.success("Certificate generated successfully!");
  };

return (
    <button
      onClick={generateCertificate}
      className="bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white px-4 py-2 rounded-full flex items-center justify-center shadow-md hover:shadow-xl transition-all duration-300 text-sm  transform hover:-translate-y-1"
    >
      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
      </svg>
      Download Certificate
    </button>
  );
};

export default CertificateGenerator;