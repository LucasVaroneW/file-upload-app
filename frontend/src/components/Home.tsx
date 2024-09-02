import React, { useEffect, useMemo, useState, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import '../styles/home.css';
import { ToastContainer, toast, ToastOptions } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import FilesList, { FileMetadata } from './FilesList';

const Home: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [files, setFiles] = useState<FileMetadata[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<number>(1);
  const [fileName, setFileName] = useState<string>('');

  useEffect(() => {
    fetchFiles();
  }, []);

  useEffect(() => {
    console.log(selectedFiles);
  }, [selectedFiles]);

  const fetchFiles = async () => {
    setLoading(true);
    try {
      const response = await axios.get<FileMetadata[]>('http://localhost:3001/');
      setFiles(response.data);
      console.log(response.data);
    } catch (error) {
      console.error('Error fetching files', error);
      toast.error('Error fetching files', toastOptions);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setFileName(selectedFile.name);
    }
  };

  const handleUpload = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      await axios.post('http://localhost:3001/upload', formData);
      toast.success('File uploaded successfully', toastOptions);
      fetchFiles();
      setFileName('');
      setFile(null);
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error('Error uploading file', toastOptions);
    }
  };

  const handleDeleteSuccess = () => {
    toast.success('File deleted successfully', toastOptions);
    fetchFiles();
  };

  const handleDeleteError = () => {
    toast.error('Error deleting file', toastOptions);
  };

  const handleFileSelection = (fileId: string) => {
    setSelectedFiles((prevSelectedFiles) => {
      if (prevSelectedFiles.includes(fileId)) {
        return prevSelectedFiles.filter((id) => id !== fileId);
      } else {
        return [...prevSelectedFiles, fileId];
      }
    });
  };

  // Función para descargar múltiples archivos
  const handleDownload = async () => {
    if (selectedFiles.length === 0) {
      toast.error('No files selected for download', toastOptions);
      return;
    }

    for (const fileId of selectedFiles) {
      try {
        const response = await axios.get(`http://localhost:3001/download/${fileId}`, {
          responseType: 'blob',
        });

        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', fileId);
        document.body.appendChild(link);
        link.click();
        link.remove();

        toast.success(`File ${fileId} downloaded successfully`, toastOptions);
      } catch (error) {
        console.error(`Error downloading file ${fileId}:`, error);
        toast.error(`Error downloading file ${fileId}`, toastOptions);
      }
      setSelectedFiles([]);
    }
  };

  const toastOptions: ToastOptions = useMemo(() => ({
    position: 'top-right',
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    style: {
      borderRadius: '15px',
      backgroundColor: '#d6e6f7',
      color: '#2c2b2bb4',
    },
  }), []);

  return (
    <div className="dashboard-container">
      <div className="tabs">
        <React.Fragment>
          <input
            type="radio"
            id={`tab1`}
            name="tab"
            checked={activeTab === 1}
            onChange={() => setActiveTab(1)}
          />
          <label htmlFor={`tab1`}>File Upload</label>
          <input
            type="radio"
            id={`tab2`}
            name="tab"
            checked={activeTab === 2}
            onChange={() => setActiveTab(2)}
          />
          <label htmlFor={`tab2`}>Uploaded Files</label>
        </React.Fragment>
        <div className="marker">
          <div id="top"></div>
        </div>
      </div>

      <div className='tab-content'>
        {activeTab === 1 && (
          <div className='upload-container'>
            <div className='file-list-title'>
              <div className='file-list-title-text'>
                <h2>Upload File:</h2>
              </div>
            </div>
            <form onSubmit={handleUpload}>
              <div className='btn-container'>
                <input 
                  type="file" 
                  id="file-input" 
                  className="file-input" 
                  onChange={handleFileChange} 
                />
                <label htmlFor="file-input" className="btn-action">
                  Select File
                </label>
                {fileName && <p className="file-name">{fileName}</p>}
                <button type="submit" className='btn-action'>Upload</button>
              </div>
            </form>
          </div>
        )}

        {activeTab === 2 && (
          <>
            <FilesList
              title={'Uploaded Files:'}
              files={files}
              selectedFiles={selectedFiles}
              loading={loading}
              onFileSelection={handleFileSelection}
              onSuccess={handleDeleteSuccess}
              onError={handleDeleteError}
            />
            <div className='btn-container'>
              <button type="button" className='btn-action' onClick={handleDownload}>Download</button>
            </div>
          </>
        )}
      </div>
      <ToastContainer />
    </div>
  );
};

export default Home;
