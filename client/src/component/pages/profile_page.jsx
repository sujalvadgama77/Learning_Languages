/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { collection, query, where, getDocs, doc, updateDoc } from "firebase/firestore";
import Footer from "../components/Footer";
import { db, storage } from "../../firebase/Firebase";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const ProfilePage = () => {
  const navigate = useNavigate();
  const [totalPoints, setTotalPoints] = useState(100);
  const [earnedPoints, setEarnedPoints] = useState(50);
  const [email, setEmail] = useState();
  const [data, setData] = useState(null);
  const [certificates, setCertificates] = useState([]);
  const [showCertificate, setShowCertificate] = useState(false);
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    const storedEmail = localStorage.getItem("userId");
    if (storedEmail) {
      setEmail(storedEmail);
      const q = query(
        collection(db, "users"),
        where("Email", "==", storedEmail)
      );
      getQuery(q);
      fetchCertificates(storedEmail);
    }
  }, [refreshTrigger]); // Add refreshTrigger to dependency array

  const getQuery = async (q) => {
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      setData(doc.data());
    });
  };

  const fetchCertificates = async (userEmail) => {
    try {
      const certificatesQuery = query(
        collection(db, "certificates"),
        where("userEmail", "==", userEmail)
      );
      const querySnapshot = await getDocs(certificatesQuery);
      
      const userCertificates = [];
      querySnapshot.forEach((doc) => {
        const certData = doc.data();
        userCertificates.push({ 
          id: doc.id, 
          certificateId: certData.certificateId || 'N/A',
          language: certData.language?.replace('_point', '') || certData.language,
          issueDate: certData.issueDate,
          level: certData.level || 'Advanced',
          downloaded: certData.downloaded || false,
          downloadDate: certData.downloadDate,
          pdfUrl: certData.pdfUrl || null
        });
      });
      
      setCertificates(userCertificates);
      console.log("Fetched certificates:", userCertificates);
    } catch (error) {
      console.error("Error fetching certificates:", error);
    }
  };

  const sections = [
    {
      title: "Sanskrit",
      value: Math.round((data?.Sanskrit_point / 300) * 100),
    },
    { title: "Hindi", value: Math.round((data?.Hindi_point / 300) * 100) },
    {
      title: "Gujarati",
      value: Math.round((data?.Gujarati_point / 300) * 100),
    },
    { title: "English", value: Math.round((data?.English_point / 300) * 100) },
  ];

  const handleDownloadCertificate = (certificate) => {
    setSelectedCertificate(certificate);
    setShowCertificate(true);
  };
  
  const downloadCertificate = async (certificate) => {
    try {
      const certificateContainer = document.getElementById('certificate-container');
      
      if (!certificateContainer) {
        console.error("Certificate container not found");
        toast.error("Could not find certificate element");
        return;
      }
      
      console.log("Generating PDF for certificate:", certificate);
      
      // Generate PDF certificate
      const canvas = await html2canvas(certificateContainer);
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('landscape');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      
      // Create blob for storage upload
      const pdfBlob = pdf.output('blob');
      
      // Save to Firebase Storage
      const userEmail = localStorage.getItem("userId");
      
      // Use a predictable and consistent storage path
      const storageRef = ref(storage, `certificates/${certificate.id}.pdf`);
      console.log("Uploading PDF to:", `certificates/${certificate.id}.pdf`);
      
      await uploadBytes(storageRef, pdfBlob);
      console.log("PDF uploaded successfully");
      
      // Get the download URL
      const pdfUrl = await getDownloadURL(storageRef);
      console.log("Generated PDF URL:", pdfUrl);
      
      // Save locally
      pdf.save(`${certificate.language}_Certificate.pdf`);
      
      // Update certificate status in Firestore
      const certificatesQuery = query(
        collection(db, "certificates"),
        where("userEmail", "==", userEmail),
        where("language", "==", certificate.language)
      );
      
      const querySnapshot = await getDocs(certificatesQuery);
      console.log("Found certificates in DB:", querySnapshot.size);
      
      if (!querySnapshot.empty) {
        const docRef = querySnapshot.docs[0].ref;
        const updateData = {
          downloaded: true,
          downloadDate: new Date().toISOString(),
          pdfUrl: pdfUrl // Store the PDF URL in the database
        };
        
        console.log("Updating certificate with data:", updateData);
        await updateDoc(docRef, updateData);
        console.log("Certificate updated in database");
        
        // Close the certificate modal
        setShowCertificate(false);
        
        // Force a refresh of the certificates
        setRefreshTrigger(prev => prev + 1);
        
        // Show success message
        toast.success('Certificate downloaded and stored successfully!');
      } else {
        
      }
    } catch (error) {
      console.error('Error generating certificate:', error);
      toast.error(`Failed to generate certificate: ${error.message}`);
    }
  };

  // Add a view certificate function with better debugging
  const viewCertificate = (certificate) => {
    console.log("Certificate data:", certificate);
    
    if (certificate.pdfUrl) {
      console.log("Opening PDF URL:", certificate.pdfUrl);
      window.open(certificate.pdfUrl, '_blank');
    } else {
      console.log("PDF URL not available for certificate:", certificate.id);
      
      // Directly open the certificate modal to regenerate
      toast.info('Preparing certificate for viewing. Please download it when ready.');
      setSelectedCertificate(certificate);
      setShowCertificate(true);
    }
  };

  // Certificate Template Component
  const CertificateModal = () => {
    if (!showCertificate || !selectedCertificate) return null;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-8 rounded-lg max-w-4xl w-full mx-4">
          <div id="certificate-container" className="relative w-full aspect-[1.4/1] bg-white">
            {/* Yellow background */}
            <div className="absolute inset-0 bg-[#FFD700]">
              {/* White certificate area */}
              <div className="absolute inset-[40px] bg-white">
                {/* Content */}
                <div className="relative z-10 p-12 text-center">
                  {/* Logo */}
                  <img 
                    src="/src/component/assets/logo.png" 
                    alt="Learning Languages Logo" 
                    className="w-32 mx-auto mb-8"
                  />
                  
                  <h1 className="text-4xl font-serif mb-8">CERTIFICATE OF COMPLETION</h1>
                  
                  <h2 className="text-5xl font-cursive mb-12">{data?.Name || 'Student'}</h2>
                  
                  <p className="text-xl mb-4">
                    has successfully completed the {selectedCertificate.language} course
                  </p>
                  <p className="text-xl mb-4">
                    under the Learning Languages program
                  </p>
                  <p className="text-xl mb-8">
                    with dedication and excellence.
                  </p>

                  {/* Robot image */}
                  <img 
                    src="/src/component/assets/robot.png" 
                    alt="Robot" 
                    className="absolute bottom-14 -translate-y-1/2 right-1 w-40"
                  />

                  {/* Certificate ID */}
                  <div className="absolute bottom-14 left-4 text-sm text-gray-600">
                    Certificate ID: {selectedCertificate.certificateId}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex justify-end gap-4 mt-4">
            <button
              onClick={() => setShowCertificate(false)}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              onClick={() => downloadCertificate(selectedCertificate)}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded"
            >
              Download PDF
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Separate the downloaded and pending certificates for rendering
  const downloadedCertificates = certificates.filter(cert => cert.downloaded);

  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl w-full bg-white rounded-lg shadow-lg p-8">
          <div className="flex items-center justify-center mb-6">
            <img
              className="w-32 h-32 rounded-full object-cover"
              src={data?.ProfilePicture}
              alt="Profile"
            />
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-2">
            {data?.Name}
          </h2>
          <p className="text-gray-600 text-center mb-6">{data?.Email}</p>
          <div className="container mx-auto px-4">
            <div className="points_container text-center mb-8">
              <div className="bg-purple-700 text-white rounded-md py-4 px-6 mb-4 inline-block mr-4">
                <h2 className="text-lg font-semibold mb-2">
                  Total Earned Points
                </h2>
                <p className="text-2xl">
                  {data?.Sanskrit_point +
                    data?.Hindi_point +
                    data?.Gujarati_point +
                    data?.English_point || 0}
                </p>
              </div>
            </div>
          </div>
          <p className="text-gray-700 mb-6">{data?.Description}</p>
          
          {/* Language Progress Section */}
          <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Language Progress</h3>
          <div className="flex flex-col md:flex-row justify-between items-center mb-12">
            {sections.map((section, index) => (
              <div
                key={index}
                className="flex flex-col items-center justify-center w-full md:w-auto mb-8 md:mb-0"
              >
                <div className="w-20 h-20 ">
                  <CircularProgressbar
                    value={section.value || 0}
                    text={`${section.value || 0}%`}
                    strokeWidth={10}
                    styles={buildStyles({
                      textColor: "#1e40af",
                      pathColor: "#1e40af",
                      trailColor: "#e5e7eb",
                    })}
                  />
                </div>
                <p className="text-gray-700 font-bold mt-2">{section.title}</p>
              </div>
            ))}
          </div>
          
          {/* Earned Certificates Section */}
          <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Earned Certificates</h3>
          {downloadedCertificates.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {/* Downloaded Certificates */}
              {downloadedCertificates.map((certificate, index) => (
                <div key={`downloaded-${certificate.id}`} className="bg-gray-50 rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <div className="bg-green-100 p-3 rounded-full mr-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-gray-800">{certificate.language}</h4>
                        <p className="text-sm text-gray-500">Level: {certificate.level}</p>
                        <p className="text-xs text-gray-500 mt-1">ID: {certificate.certificateId}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">Issued on</p>
                      <p className="text-sm font-medium">{new Date(certificate.issueDate).toLocaleDateString()}</p>
                      {certificate.downloadDate && (
                        <>
                          <p className="text-xs text-gray-500 mt-1">Downloaded on</p>
                          <p className="text-sm font-medium">{new Date(certificate.downloadDate).toLocaleDateString()}</p>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-medium px-2 py-1 rounded-full bg-green-100 text-green-600">
                      Downloaded
                    </span>
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => viewCertificate(certificate)}
                        className="text-indigo-600 hover:text-indigo-800 text-sm font-medium focus:outline-none"
                      >
                        View Certificate
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 mb-8 p-6 bg-gray-50 rounded-lg">
              <p>You haven't downloaded any certificates yet. Go to the Pathway page to earn and download certificates!</p>
            </div>
          )}
          
          <div className="flex items-center justify-center mt-8">
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
              onClick={() => navigate("/editprofile")}
            >
              Edit Profile
            </button>
          </div>
        </div>
      </div>
      <CertificateModal />
      <ToastContainer />
      <Footer />
    </>
  );
};

export default ProfilePage; 