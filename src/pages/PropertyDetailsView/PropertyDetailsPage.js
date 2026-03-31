import React, { useEffect, useState,} from 'react';

import { useParams, useNavigate } from 'react-router-dom';

import PropertyDetailsView from './PropertyDetailsView';
import EditPropertyModal from '../../components/Modals/EditPropertyModal';
import EditUnitModal from '../../components/Modals/EditUnitModal';
import EditAmenityModal from '../../components/Modals/EditAmenityModal';
import DocumentModal from '../../components/Modals/DocumentModal';

import { propertyService } from '../../services/propertyService';
import { unitAmenityService } from '../../services/unitAmenityService';
import { documentService } from '../../services/documentService';

const PropertyDetailsPage = () => {

  const { id } = useParams();
  const navigate = useNavigate();

  const [property, setProperty] = useState(null);
  const [units, setUnits] = useState([]);
  const [amenities, setAmenities] = useState([]);
  const [documents, setDocuments] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isEditPropertyOpen, setIsEditPropertyOpen] = useState(false);
  const [selectedUnitForEdit, setSelectedUnitForEdit] = useState(null);
  const [selectedAmenityForEdit, setSelectedAmenityForEdit] = useState(null);
  const [selectedDocumentForEdit, setSelectedDocumentForEdit] = useState(null);
  const [isDocumentModalOpen, setIsDocumentModalOpen] = useState(false);


  const loadPropertyData = async () => {
    try {
      setLoading(true);
      setError(null);

      const propertyRes = await propertyService.getPropertyById(id);
      setProperty(propertyRes?.data || propertyRes);

      const unitsRes = await unitAmenityService.getUnits({ PropertyID: id });
      setUnits(unitsRes?.data?.items || []);

      const amenitiesRes = await unitAmenityService.getAmenities({ PropertyID: id });
      setAmenities(amenitiesRes?.data?.items || []);

      const docsRes = await documentService.getDocuments({
        EntityType: 'Property',
        EntityID: id,
      });
      setDocuments(docsRes?.data?.items || []);
    } catch (err) {
      setError(err.message || 'Failed to load property details');
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    if (id) {
      loadPropertyData();
    }
  }, [id]);


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading property...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>
          <p className="text-red-600">{error}</p>
          <button onClick={loadPropertyData} className="mt-4 px-4 py-2 bg-red-600 text-white rounded">
            Retry
          </button>
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <PropertyDetailsView
        property={property}
        units={units}
        amenities={amenities}
        documents={documents}
        onBack={() => navigate('/Property')}
        onEditProperty={() => setIsEditPropertyOpen(true)}
        onEditUnit={setSelectedUnitForEdit}
        onEditAmenity={setSelectedAmenityForEdit}
        onEditDocument={(doc) => {
          setSelectedDocumentForEdit(doc);
          setIsDocumentModalOpen(true);
        }}
        onUploadDocument={() => {
          setSelectedDocumentForEdit(null);
          setIsDocumentModalOpen(true);
        }}
        onRefresh={loadPropertyData}
      />

      <EditPropertyModal
        isOpen={isEditPropertyOpen}
        onClose={() => setIsEditPropertyOpen(false)}
        property={property}
        onSuccess={async (values) => {
          await propertyService.updateProperty(id, values);
          await loadPropertyData();
          setIsEditPropertyOpen(false);
        }}
      />

      <EditUnitModal
        isOpen={Boolean(selectedUnitForEdit)}
        onClose={() => setSelectedUnitForEdit(null)}
        unit={selectedUnitForEdit}
        onSuccess={async (values) => {
          await unitAmenityService.updateUnit(selectedUnitForEdit.unitID, values);
          await loadPropertyData();
          setSelectedUnitForEdit(null);
        }}
      />

      <EditAmenityModal
        isOpen={Boolean(selectedAmenityForEdit)}
        onClose={() => setSelectedAmenityForEdit(null)}
        amenity={selectedAmenityForEdit}
        onSuccess={async (values) => {
          await unitAmenityService.updateAmenity(
            selectedAmenityForEdit.amenityID,
            values
          );
          await loadPropertyData();
          setSelectedAmenityForEdit(null);
        }}
      />

      <DocumentModal
        isOpen={isDocumentModalOpen}
        onClose={() => setIsDocumentModalOpen(false)}
        document={selectedDocumentForEdit}
        entityType="Property"
        entityId={id}
        onSuccess={async () => {
          await loadPropertyData();
          setIsDocumentModalOpen(false);
          setSelectedDocumentForEdit(null);
        }}
      />
    </div>
  );
};

export default PropertyDetailsPage;