'use client';
import React, { useEffect, useRef, useState } from 'react';
import * as LR from '@uploadcare/blocks';
import { useRouter } from 'next/navigation';
import { FileUploaderRegular } from '@uploadcare/react-uploader';
import '@uploadcare/react-uploader/core.css';

type Props = {
  onUpload: (url: string) => Promise<any>;
};

LR.registerBlocks(LR);

const UploadCareButton: React.FC<Props> = ({ onUpload }) => {
  const router = useRouter();
  const [files, setFiles] = useState<Array<{ uuid: string; cdnUrl: string; fileInfo: { originalFilename: string } }>>([]);
  const uploaderRef = useRef<any>(null); // Adjust the type if possible

  useEffect(() => {
    const handleUpload = async (e: CustomEvent<{ cdnUrl: string }>) => {
      const file = await onUpload(e.detail.cdnUrl);
      if (file) {
        router.refresh();
      }
    };

    const uploader = uploaderRef.current;

    if (uploader) {
      uploader.addCustomEventListener('file-upload-success', handleUpload as unknown as EventListener);
    }

    return () => {
      if (uploader) {
        uploader.removeCustomEventListener('file-upload-success', handleUpload as unknown as EventListener);
      }
    };
  }, [onUpload, router]);

  const handleChangeEvent = (items: any) => {
    // Adjust this function based on the actual structure provided by FileUploaderRegular
    setFiles(items.allEntries.filter((entry: any) => entry.status === 'success').map((entry: any) => ({
      uuid: entry.uuid,
      cdnUrl: entry.cdnUrl,
      fileInfo: {
        originalFilename: entry.fileInfo.originalFilename,
      },
    })));
  };

  return (
    <div>
      <FileUploaderRegular ref={uploaderRef} onChange={handleChangeEvent} pubkey="d23461dc05c798249293" />
      <div>
        {files.map(file => (
          <div key={file.uuid}>
            <img src={file.cdnUrl} alt={file.fileInfo.originalFilename} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default UploadCareButton;
