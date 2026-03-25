import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import PropertyDetailsView from './PropertyDetailsView';
import EditPropertyModal from '../../components/Modals/EditPropertyModal';
import EditUnitModal from '../../components/Modals/EditUnitModal';
import EditAmenityModal from '../../components/Modals/EditAmenityModal';
import DocumentModal from '../../components/Modals/DocumentModal';
import {
  fetchPropertyById,
  fetchUnitsByPropertyId,
  fetchAmenitiesByPropertyId,
  fetchDocumentsByPropertyId,
  updateProperty,
  updateUnit,
  updateAmenity,
  uploadDocument,
  updateDocument,
} from '../../redux/slices/propertySlice';

const PropertyDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const property = useSelector((state) => state.property.selectedProperty);
  const units = useSelector((state) => state.property.units);
  const amenities = useSelector((state) => state.property.amenities);
  const documents = useSelector((state) => state.property.documents);
  const status = useSelector((state) => state.property.status);
  const error = useSelector((state) => state.property.error);

  const [isEditPropertyOpen, setIsEditPropertyOpen] = useState(false);
  const [selectedUnitForEdit, setSelectedUnitForEdit] = useState(null);
  const [selectedAmenityForEdit, setSelectedAmenityForEdit] = useState(null);
  const [selectedDocumentForEdit, setSelectedDocumentForEdit] = useState(null);
  const [isDocumentModalOpen, setIsDocumentModalOpen] = useState(false);

  useEffect(() => {
    if (!id) return;
    dispatch(fetchPropertyById(id));
    dispatch(fetchUnitsByPropertyId(id));
    dispatch(fetchAmenitiesByPropertyId(id));
    dispatch(fetchDocumentsByPropertyId(id));
  }, [dispatch, id]);

  const doRefreshData = () => {
    if (!id) return;
    dispatch(fetchPropertyById(id));
    dispatch(fetchUnitsByPropertyId(id));
    dispatch(fetchAmenitiesByPropertyId(id));
    dispatch(fetchDocumentsByPropertyId(id));
  };

  if (status === 'loading' || !property) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-500 font-black animate-pulse uppercase tracking-widest text-xs">
          Fetching Asset Data...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50">
        <div className="bg-white p-8 rounded-xl shadow-lg border border-red-200">
          <h2 className="text-lg font-black text-red-600">Error</h2>
          <p className="mt-2 text-red-500">{error}</p>
          <button
            onClick={doRefreshData}
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 p-8">
      <PropertyDetailsView
        property={property}
        units={units}
        amenities={amenities}
        documents={documents}
        onBack={() => navigate('/Property')}
        onEditProperty={() => setIsEditPropertyOpen(true)}
        onEditUnit={setSelectedUnitForEdit}
        onEditAmenity={setSelectedAmenityForEdit}
        onEditDocument={(doc) => { setSelectedDocumentForEdit(doc); setIsDocumentModalOpen(true); }}
        onUploadDocument={() => { setSelectedDocumentForEdit(null); setIsDocumentModalOpen(true); }}
        onRefresh={doRefreshData}
      />

      <EditPropertyModal
        isOpen={isEditPropertyOpen}
        onClose={() => setIsEditPropertyOpen(false)}
        property={property}
        onSuccess={(values) => {
          dispatch(updateProperty({ id, data: values })).then(() => {
            doRefreshData();
            setIsEditPropertyOpen(false);
          });
        }}
      />

      <EditUnitModal
        isOpen={Boolean(selectedUnitForEdit)}
        onClose={() => setSelectedUnitForEdit(null)}
        unit={selectedUnitForEdit}
        onSuccess={(values) => {
          if (selectedUnitForEdit) {
            dispatch(updateUnit({ unitId: selectedUnitForEdit.unitID, data: values, propertyId: id })).then(() => {
              doRefreshData();
              setSelectedUnitForEdit(null);
            });
          }
        }}
      />

      <EditAmenityModal
        isOpen={Boolean(selectedAmenityForEdit)}
        onClose={() => setSelectedAmenityForEdit(null)}
        amenity={selectedAmenityForEdit}
        onSuccess={(values) => {
          if (selectedAmenityForEdit) {
            dispatch(updateAmenity({ amenityId: selectedAmenityForEdit.amenityID, data: values, propertyId: id })).then(() => {
              doRefreshData();
              setSelectedAmenityForEdit(null);
            });
          }
        }}
      />

      <DocumentModal
        isOpen={isDocumentModalOpen}
        onClose={() => setIsDocumentModalOpen(false)}
        document={selectedDocumentForEdit}
        entityType="Property"
        entityId={id}
        onSuccess={(values) => {
          if (selectedDocumentForEdit) {
            dispatch(updateDocument({ documentId: selectedDocumentForEdit.documentID, entityId: id, values }))
              .then(() => {
                doRefreshData();
                setSelectedDocumentForEdit(null);
                setIsDocumentModalOpen(false);
              });
          } else {
            dispatch(uploadDocument({ entityType: 'Property', entityId: id, values }))
              .then(() => {
                doRefreshData();
                setIsDocumentModalOpen(false);
              });
          }
        }}
      />
    </div>
  );
};

export default PropertyDetailsPage;
