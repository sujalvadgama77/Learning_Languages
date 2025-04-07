import React, { useState, useEffect, useRef } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { collection, query, where, getDocs, doc, updateDoc, addDoc } from 'firebase/firestore';
import { db } from '../../firebase/Firebase';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { v4 as uuidv4 } from 'uuid';

const Pathway = () => {
  const [userProgress, setUserProgress] = useState({
    Sanskrit_point: 0,
    Hindi_point: 0,
    Gujarati_point: 0,
    English_point: 0
  });
  const [userName, setUserName] = useState('');
  const [userId, setUserId] = useState('');
  const [showCertificate, setShowCertificate] = useState(false);
  const [certificateData, setCertificateData] = useState({ 
    language: '', 
    date: '',
    certificateId: '',
    alreadyDownloaded: false
  });
  const [showTestingPanel, setShowTestingPanel] = useState(false);
  const [pointsToAdd, setPointsToAdd] = useState(50);
  const [selectedLanguage, setSelectedLanguage] = useState('Sanskrit_point');
  const [certificates, setCertificates] = useState({});

  useEffect(() => {
    const fetchUserData = async () => {
      const userEmail = localStorage.getItem("userId");
      if (userEmail) {
        const q = query(collection(db, "users"), where("Email", "==", userEmail));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const docRef = querySnapshot.docs[0];
          const userData = docRef.data();
          setUserId(docRef.id);
          setUserName(userData.Name || 'Student');
          setUserProgress({
            Sanskrit_point: userData.Sanskrit_point || 0,
            Hindi_point: userData.Hindi_point || 0,
            Gujarati_point: userData.Gujarati_point || 0,
            English_point: userData.English_point || 0
          });
        }
      }
    };
    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchUserCertificates = async () => {
      try {
        const userEmail = localStorage.getItem("userId");
        if (userEmail) {
          const certificatesQuery = query(
            collection(db, "certificates"),
            where("userEmail", "==", userEmail)
          );
          
          const querySnapshot = await getDocs(certificatesQuery);
          
          const userCertificates = {};
          querySnapshot.forEach((doc) => {
            const certData = doc.data();
            if (certData.language && certData.certificateId) {
              userCertificates[certData.language] = {
                certificateId: certData.certificateId,
                downloaded: certData.downloaded || false,
                issueDate: certData.issueDate
              };
            }
          });
          
          setCertificates(userCertificates);
        }
      } catch (error) {
        console.error("Error fetching certificates:", error);
      }
    };

    fetchUserCertificates();
  }, []);

  const generateCertificate = async (language) => {
    try {
      if (certificateData.alreadyDownloaded) {
        toast.info('This certificate has already been downloaded. Check your downloads folder.', {
          position: "top-right",
          autoClose: 3000
        });
        return;
      }

      const certificateRef = document.getElementById('certificate-container');
      const canvas = await html2canvas(certificateRef);
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('landscape');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${language.replace('_point', '')}_Certificate.pdf`);
      
      // Get user email for Firestore queries
      const userEmail = localStorage.getItem("userId");
      
      // Get the certificate document to update
      const certificatesQuery = query(
        collection(db, "certificates"),
        where("userEmail", "==", userEmail),
        where("language", "==", language)
      );
      
      const querySnapshot = await getDocs(certificatesQuery);
      if (!querySnapshot.empty) {
        // Update the document to mark as downloaded
        const docRef = querySnapshot.docs[0].ref;
        const downloadDate = new Date().toISOString();
        
        await updateDoc(docRef, {
          downloaded: true,
          downloadDate: downloadDate
        });
        
        // Update local state
        setCertificates(prev => ({
          ...prev,
          [language]: {
            ...prev[language],
            downloaded: true,
            downloadDate: downloadDate
          }
        }));

        console.log(`Certificate for ${language} marked as downloaded in Firestore`);
        
        // Close the certificate modal
        setShowCertificate(false);
        
        // Show success message
        toast.success('Certificate downloaded successfully! It will appear in your profile.', {
          position: "top-right",
          autoClose: 3000
        });
      } else {
        console.error("Certificate document not found for updating");
        toast.error("Error updating certificate status. Please try again.");
      }
    } catch (error) {
      console.error('Error generating certificate:', error);
      toast.error('Failed to generate certificate. Please try again.', {
        position: "top-right",
        autoClose: 3000
      });
    }
  };

  const handleDownloadCertificate = async (language, points) => {
    try {
      if (points >= 150) {
        const userEmail = localStorage.getItem("userId");
        if (!userEmail) {
          toast.error("User not logged in. Please log in to download certificate.");
          return;
        }

        const existingCertificate = certificates[language];
        
        if (existingCertificate && existingCertificate.downloaded) {
          toast.info(`You've already downloaded a certificate for ${language.replace('_point', '')}.`, {
            position: "top-right",
            autoClose: 3000
          });
          return;
        }
        
        let certificateId = existingCertificate?.certificateId || uuidv4().slice(0, 8).toUpperCase();
        
        if (!existingCertificate) {
          const newCertificateData = {
            userEmail,
            language,
            level: "Advanced",
            issueDate: new Date().toISOString(),
            points,
            certificateId,
            downloaded: false
          };
          
          await addDoc(collection(db, "certificates"), newCertificateData);
          
          setCertificates(prev => ({
            ...prev,
            [language]: {
              certificateId,
              downloaded: false,
              issueDate: new Date().toISOString()
            }
          }));
          
          toast.success(`Certificate for ${language.replace('_point', '')} has been created!`);
        }

        setCertificateData({
          language,
          date: new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          }),
          certificateId,
          alreadyDownloaded: existingCertificate?.downloaded || false
        });
        
        setShowCertificate(true);
      } else {
        toast.info("You need at least 150 points to earn a certificate.");
      }
    } catch (error) {
      console.error("Error generating certificate:", error);
      toast.error("Failed to generate certificate. Please try again later.");
    }
  };

  const getLevel = (points) => {
    if (points >= 150) return "Advanced";
    if (points >= 50) return "Intermediate";
    return "Basic";
  };

  const getLevelColor = (level) => {
    switch (level) {
      case "Advanced": return "bg-red-800"; // Darkest red for advanced
      case "Intermediate": return "bg-red-600"; // Medium red for intermediate
      case "Basic": return "bg-red-400"; // Light red for basic
      default: return "bg-gray-200";
    }
  };

  const LanguagePathway = ({ language, points }) => {
    const level = getLevel(points);
    const levelColor = getLevelColor(level);
    const isAdvanced = points >= 150;
    const isSanskrit = language === 'Sanskrit_point';
    const maxPoints = isSanskrit ? 200 : 300;
    
    const getProgressWidth = () => {
      if (isSanskrit) {
        return `${Math.min((points / 200) * 100, 100)}%`;
      }
      return `${Math.min((points / 300) * 100, 100)}%`;
    };
    
    return (
      <div className="mb-16 relative">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <h2 className="text-2xl font-bold text-purple-600">{language.replace('_point', '')}</h2>
            <span className={`ml-4 px-4 py-1 rounded-full ${levelColor} text-white`}>
              {level}
            </span>
          </div>
          <button
            onClick={() => handleDownloadCertificate(language, points)}
            className="px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-300 bg-purple-600 hover:bg-purple-800 text-white cursor-pointer shadow-md hover:shadow-lg"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Certificate
          </button>
        </div>
        
        {/* Progress Line with Stages */}
        <div className="relative mt-8 mb-12">
          <div className="h-1 bg-gray-200 absolute w-full top-5"></div>
          
          {/* Progress overlay */}
          <div 
            className="h-1 bg-purple-600 absolute top-5 transition-all duration-500"
            style={{
              width: getProgressWidth()
            }}
          ></div>

          {/* Stage markers */}
          <div className="relative flex justify-between">
            {/* Basic Stage */}
            <div className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${points >= 0 ? 'bg-purple-600' : 'bg-gray-300'} text-white font-bold`}>
                1
              </div>
              <span className="mt-2 text-sm font-medium text-gray-600">Basic</span>
            </div>

            {/* Intermediate Stage */}
            <div className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${points >= 50 ? 'bg-purple-600' : 'bg-gray-300'} text-white font-bold`}>
                2
              </div>
              <span className="mt-2 text-sm font-medium text-gray-600">Intermediate</span>
            </div>

            {/* Advanced Stage */}
            <div className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${points >= 150 ? 'bg-purple-600' : 'bg-gray-300'} text-white font-bold`}>
                3
              </div>
              <span className="mt-2 text-sm font-medium text-gray-600">Advanced</span>
            </div>

            {/* Test with LangBuddy Stage - Only for non-Sanskrit languages */}
            {!isSanskrit && (
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${points >= 200 ? 'bg-purple-600' : 'bg-gray-300'} text-white`}>
                  {points >= 200 ? (
                    <span className="font-bold">4</span>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  )}
                </div>
                <span className="mt-2 text-sm font-medium text-gray-600">Test with LangBuddy</span>
              </div>
            )}

            {/* Certificate Stage */}
            <div className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${points >= maxPoints ? 'bg-purple-600' : 'bg-gray-300'} text-white`}>
                {points >= maxPoints ? (
                  <span className="font-bold">{isSanskrit ? '4' : '5'}</span>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                )}
              </div>
              <span className="mt-2 text-sm font-medium text-gray-600">Certificate</span>
            </div>
          </div>
        </div>

        <div className="mt-4 text-right">
          <span className="text-lg font-semibold text-purple-600">
            {points} / {maxPoints} points
          </span>
        </div>
      </div>
    );
  };

  // Certificate Template Component
  const Certificate = ({ onClose }) => {
    if (!showCertificate) return null;

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
                  
                  <h2 className="text-5xl font-cursive mb-12">{userName}</h2>
                  
                  <p className="text-xl mb-4">
                    has successfully completed the {certificateData.language.replace('_point', '')} course
                  </p>
                  <p className="text-xl mb-4">
                    under the Learning Languages program
                  </p>
                  <p className="text-xl mb-8">
                    with dedication and excellence.
                  </p>

                  {/* Robot image - moved higher up */}
                  <img 
                    src="/src/component/assets/robot.png" 
                    alt="Robot" 
                    className="absolute bottom-14 -translate-y-1/2 right-1 w-40"
                  />

                  {/* Certificate ID */}
                  <div className="absolute bottom-14 left-4 text-sm text-gray-600">
                    Certificate ID: {certificateData.certificateId}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex justify-end gap-4 mt-4">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              onClick={() => generateCertificate(certificateData.language)}
              className={`px-4 py-2 rounded ${
                certificateData.alreadyDownloaded 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-purple-600 hover:bg-purple-700'
              } text-white`}
              disabled={certificateData.alreadyDownloaded}
            >
              {certificateData.alreadyDownloaded ? 'Already Downloaded' : 'Download PDF'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const handleAddPoints = async () => {
    if (!userId) {
      toast.error("User ID not found. Please log in again.");
      return;
    }

    try {
      const userRef = doc(db, "users", userId);
      
      // Create update object with the selected language field
      const updateData = {};
      updateData[selectedLanguage] = userProgress[selectedLanguage] + pointsToAdd;
      
      // Update in Firestore
      await updateDoc(userRef, updateData);
      
      // Update local state
      setUserProgress({
        ...userProgress,
        [selectedLanguage]: userProgress[selectedLanguage] + pointsToAdd
      });
      
      toast.success(`Successfully added ${pointsToAdd} points to ${selectedLanguage.replace('_point', '')}`);
    } catch (error) {
      console.error("Error updating points:", error);
      toast.error("Failed to update points. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <Navbar />
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-center mb-12 text-purple-600">
          Your Learning Journey
        </h1>

        <div className="max-w-3xl mx-auto">
          {Object.entries(userProgress).map(([language, points]) => (
            <LanguagePathway 
              key={language} 
              language={language} 
              points={points}
            />
          ))}

          {/* Testing Panel Toggle */}
          <div className="text-center mt-12">
            <button 
              onClick={() => setShowTestingPanel(!showTestingPanel)}
              className="text-sm text-gray-500 hover:text-purple-600 underline"
            >
              {showTestingPanel ? 'Hide Testing Panel' : 'Show Testing Panel'}
            </button>
          </div>

          {/* Testing Panel */}
          {showTestingPanel && (
            <div className="mt-8 p-6 border border-purple-200 rounded-lg bg-purple-50">
              <h3 className="text-lg font-semibold mb-4 text-purple-700">Testing Utility - Add Points</h3>
              
              <div className="flex flex-col md:flex-row gap-4 mb-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
                  <select
                    value={selectedLanguage}
                    onChange={(e) => setSelectedLanguage(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                  >
                    <option value="Sanskrit_point">Sanskrit</option>
                    <option value="Hindi_point">Hindi</option>
                    <option value="Gujarati_point">Gujarati</option>
                    <option value="English_point">English</option>
                  </select>
                </div>
                
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Points to Add</label>
                  <input
                    type="number"
                    value={pointsToAdd}
                    onChange={(e) => setPointsToAdd(parseInt(e.target.value) || 0)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                    min="1"
                    max="300"
                  />
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-600">
                  Current {selectedLanguage.replace('_point', '')} Points: {userProgress[selectedLanguage]}
                </div>
                <button
                  onClick={handleAddPoints}
                  className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
                >
                  Add Points
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <Certificate onClose={() => setShowCertificate(false)} />
      <ToastContainer />
      <Footer />
    </div>
  );
};

export default Pathway;