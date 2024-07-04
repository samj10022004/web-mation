'use client'
import React, { useEffect, useRef, useState } from 'react';
import * as LR from '@uploadcare/blocks';
import { useRouter } from 'next/navigation';
import { FileUploaderRegular, FileUploaderEvent } from '@uploadcare/react-uploader';
import '@uploadcare/react-uploader/core.css';

type Props = {
  onUpload: (url: string) => Promise<any>;
};

LR.registerBlocks(LR);

const UploadCareButton: React.FC<Props> = ({ onUpload }) => {
  const router = useRouter();
  const ctxProviderRef = useRef<LR.UploadCtxProvider>(null);
  const [files, setFiles] = useState<Array<{ uuid: string; cdnUrl: string; fileInfo: { originalFilename: string } }>>([]);

  useEffect(() => {
    const handleUpload = async (e: CustomEvent<{ cdnUrl: string }>) => {
      const file = await onUpload(e.detail.cdnUrl);
      if (file) {
        router.refresh();
      }
    };

    const ctxProvider = ctxProviderRef.current;
    ctxProvider?.addEventListener('file-upload-success', handleUpload as EventListener);

    return () => {
      ctxProvider?.removeEventListener('file-upload-success', handleUpload as EventListener);
    };
  }, [onUpload, router]);

  const handleChangeEvent = (items: FileUploaderEvent) => {
    setFiles(items.allEntries.filter(file => file.status === 'success'));
  };

  return (
    <div>
      <FileUploaderRegular onChange={handleChangeEvent} pubkey="d23461dc05c798249293" />
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
