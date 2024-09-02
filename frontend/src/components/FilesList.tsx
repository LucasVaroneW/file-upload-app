import React, { useState } from 'react';
import axios from 'axios';
import '../styles/home.css';

export type FileMetadata = {
  _id: string;
  filename: string;
  originalName: string;
  size: number;
  type: string;
  uploadDate: string;
  url: string;
};

type FilesListProps = {
  title: string;
  files: FileMetadata[];
  selectedFiles: string[];
  loading: boolean;
  onFileSelection: (fileId: string) => void;
  onSuccess?: () => void;
  onError?: () => void;
};

const FilesList: React.FC<FilesListProps> = ({
  title,
  files,
  selectedFiles,
  loading,
  onFileSelection,
  onSuccess,
  onError,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const filteredFiles = files.filter((file) =>
    file.filename.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = async (file: FileMetadata) => {
    console.log(file)
    try {
      await axios.delete(`http://localhost:3001/delete/${file.filename}`);
      onSuccess && onSuccess();
    } catch (error) {
      console.error('Error deleting the file', error);
      onError && onError();
    }
  };

  return (
    <div className='file-list-container'>
        <div className='file-list-title'>
            <div className='file-list-title-text'>
                <h2>{title}</h2>
            </div>
            <div className="search-box">
                <button className="btn-search"><i className="fas fa-search"></i></button>
                <input
                    type="text"
                    className="input-search"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    placeholder="Search files..."
                />
            </div>
        </div>
        <div className="file-list-content">
            {loading ? (
                <p>Loading files...</p>
            ) : (
                <ul>
                    {filteredFiles.map((file) => (
                    <li key={file._id}>
                        <label>
                        <input
                            type="checkbox"
                            checked={selectedFiles.includes(file.filename)}
                            onChange={() => onFileSelection(file.filename)}
                        />
                        <div className="custom-checkbox"></div>
                        <span className="file-info">
                            {file.originalName}
                        </span>
                        <div className='actions'>
                            <button className='action-icon' onClick={() => handleDelete(file)}>
                              <i className='fas fa-trash'></i> Delete
                            </button>
                        </div>
                        </label>
                    </li>
                    ))}
                </ul>
            )}
        </div>
    </div>
  );
};

export default FilesList;
