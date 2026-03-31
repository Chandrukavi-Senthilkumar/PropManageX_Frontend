import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { documentService } from '../../services/documentService';
import { DocumentDuplicateIcon, XMarkIcon } from '@heroicons/react/24/outline';

const DocumentModal = ({ isOpen, onClose, document, entityType, entityId, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    if (!isOpen) {
      setSelectedFile(null);
      setError(null);
      setLoading(false);
    }
  }, [isOpen]);

  const formik = useFormik({
    initialValues: {
      entityType: entityType ?? 'Property',
      entityID: entityId ?? '',
      documentType: document?.documentType ?? 'Agreement',
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      documentType: Yup.string().required('Document type is required'),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      setError(null);
      try {
        const formData = new FormData();
        formData.append('EntityType', values.entityType);
        formData.append('EntityID', values.entityID);
        formData.append('DocumentType', values.documentType);
        if (selectedFile) {
          formData.append('file', selectedFile);
        }

        let response;
        if (document?.documentID) {
          response = await documentService.updateDocument(document.documentID, formData);
        } else {
          response = await documentService.uploadDocument(formData);
        }

        if (response.success || response.statusCode === 200 || response.statusCode === 201) {
          onSuccess?.({
            ...values,
            file: selectedFile,
            entityType: values.entityType,
            entityID: values.entityID,
          });
          onClose();
        } else {
          setError(response.message || 'Failed to save document');
        }
      } catch (err) {
        console.error('Document save failed:', err);
        setError(err.response?.data?.message || err.message || 'Failed to save document');
      } finally {
        setLoading(false);
      }
    },
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-[32px] w-full max-w-lg p-10 shadow-2xl relative">
        <button onClick={onClose} className="absolute top-6 right-6 text-gray-400 hover:text-gray-600">
          <XMarkIcon className="w-6 h-6" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-blue-100 rounded-2xl">
            <DocumentDuplicateIcon className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{document ? 'Edit Document' : 'Upload Document'}</h2>
            <p className="text-sm text-gray-400">Only PDF or image files are allowed..</p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={formik.handleSubmit} className="space-y-5">
          <div>
            <label className="text-xs font-black uppercase text-gray-400 tracking-wider">Document Type</label>
            <select
              name="documentType"
              {...formik.getFieldProps('documentType')}
              className="w-full mt-1 p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="Agreement">Agreement</option>
              <option value="KYC">KYC</option>
              <option value="Approval">Approval</option>
            </select>
            {formik.touched.documentType && formik.errors.documentType && (
              <p className="text-red-500 text-xs mt-1">{formik.errors.documentType}</p>
            )}
          </div>

          <div>
            <label className="text-xs font-black uppercase text-gray-400 tracking-wider">File</label>
            <div className="relative border-2 border-dashed border-gray-200 rounded-2xl p-6 text-center hover:bg-gray-50 transition-colors">
              <input
                type="file"
                accept="*/*"
                onChange={(e) => setSelectedFile(e.target.files?.[0] ?? null)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="space-y-1">
                <p className="text-sm font-semibold text-gray-700">
                  {selectedFile ? selectedFile.name : document?.uri ? `Current file: ${document.uri}` : 'Click to select a file'}
                </p>
                <p className="text-xs text-gray-400 font-medium">Max 15MB</p>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 text-gray-500 font-bold hover:bg-gray-100 rounded-xl transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || (!document && !selectedFile)}
              className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 active:scale-95 transition-all disabled:opacity-50"
            >
              {loading ? 'Saving...' : document ? 'Update Document' : 'Upload Document'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DocumentModal;
