import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { propertyService } from '../services/propertyService';
import { unitAmenityService } from '../services/unitAmenityService';
import { documentService } from '../services/documentService';

const initialState = {
  properties: [],
  selectedProperty: null,
  units: [],
  amenities: [],
  documents: [],
  status: 'idle',
  error: null,
  notification: null,
};

export const fetchProperties = createAsyncThunk('property/fetchProperties', async () => {
  const response = await propertyService.getProperties();
  const items = response?.data?.data?.items || response?.data?.items || response?.data || [];
  return Array.isArray(items) ? items : [];
});

export const fetchPropertyById = createAsyncThunk('property/fetchPropertyById', async (id) => {
  const response = await propertyService.getPropertyById(id);
  return response?.data?.data || response?.data;
});

export const fetchUnitsByPropertyId = createAsyncThunk('property/fetchUnitsByPropertyId', async (propertyId) => {
  const response = await unitAmenityService.getUnits({ PropertyID: propertyId });
  const items = response?.data?.items || response?.data || [];
  return Array.isArray(items) ? items : [];
});

export const fetchAmenitiesByPropertyId = createAsyncThunk('property/fetchAmenitiesByPropertyId', async (propertyId) => {
  const response = await unitAmenityService.getAmenities({ PropertyID: propertyId });
  const items = response?.data?.items || response?.data || [];
  return Array.isArray(items) ? items : [];
});

export const fetchDocumentsByPropertyId = createAsyncThunk('property/fetchDocumentsByPropertyId', async (propertyId) => {
  const response = await documentService.getDocuments({ EntityType: 'Property', EntityID: propertyId });
  const items = response?.data?.items || response?.data || [];
  return Array.isArray(items) ? items : [];
});

export const uploadDocument = createAsyncThunk('property/uploadDocument', async ({ entityType, entityId, values }, { dispatch, rejectWithValue }) => {
  try {
    const formData = new FormData();
    formData.append('EntityType', entityType);
    formData.append('EntityID', entityId);
    formData.append('DocumentType', values.documentType);
    if (values.file) formData.append('file', values.file);

    const response = await documentService.uploadDocument(formData);
    await dispatch(fetchDocumentsByPropertyId(entityId));
    return response;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || err.message || 'Unable to upload document');
  }
});

export const updateDocument = createAsyncThunk('property/updateDocument', async ({ documentId, entityId, values }, { dispatch, rejectWithValue }) => {
  try {
    const formData = new FormData();
    formData.append('EntityType', values.entityType);
    formData.append('EntityID', values.entityID);
    formData.append('DocumentType', values.documentType);
    if (values.file) formData.append('file', values.file);

    const response = await documentService.updateDocument(documentId, formData);
    await dispatch(fetchDocumentsByPropertyId(entityId));
    return response;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || err.message || 'Unable to update document');
  }
});

export const updateProperty = createAsyncThunk('property/updateProperty', async ({ id, data }, { dispatch, rejectWithValue }) => {
  try {
    const response = await propertyService.updateProperty(id, data);
    await dispatch(fetchPropertyById(id));
    return response;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || err.message || 'Unable to update property');
  }
});

export const updateUnit = createAsyncThunk('property/updateUnit', async ({ unitId, data, propertyId }, { dispatch, rejectWithValue }) => {
  try {
    const response = await unitAmenityService.updateUnit(unitId, data);
    await dispatch(fetchUnitsByPropertyId(propertyId));
    return response;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || err.message || 'Unable to update unit');
  }
});

export const updateAmenity = createAsyncThunk('property/updateAmenity', async ({ amenityId, data, propertyId }, { dispatch, rejectWithValue }) => {
  try {
    const response = await unitAmenityService.updateAmenity(amenityId, data);
    await dispatch(fetchAmenitiesByPropertyId(propertyId));
    return response;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || err.message || 'Unable to update amenity');
  }
});

const propertySlice = createSlice({
  name: 'property',
  initialState,
  reducers: {
    clearNotification(state) {
      state.notification = null;
    },
    setNotification(state, action) {
      state.notification = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProperties.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchProperties.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.properties = action.payload;
      })
      .addCase(fetchProperties.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(fetchPropertyById.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchPropertyById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.selectedProperty = action.payload;
      })
      .addCase(fetchPropertyById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(fetchUnitsByPropertyId.fulfilled, (state, action) => {
        state.units = action.payload;
      })
      .addCase(fetchUnitsByPropertyId.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(fetchAmenitiesByPropertyId.fulfilled, (state, action) => {
        state.amenities = action.payload;
      })
      .addCase(fetchAmenitiesByPropertyId.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(fetchDocumentsByPropertyId.fulfilled, (state, action) => {
        state.documents = action.payload;
      })
      .addCase(fetchDocumentsByPropertyId.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(uploadDocument.fulfilled, (state) => {
        state.notification = { type: 'success', message: 'Document uploaded successfully.' };
      })
      .addCase(uploadDocument.rejected, (state, action) => {
        state.notification = { type: 'error', message: action.payload || action.error.message };
      })
      .addCase(updateDocument.fulfilled, (state) => {
        state.notification = { type: 'success', message: 'Document updated successfully.' };
      })
      .addCase(updateDocument.rejected, (state, action) => {
        state.notification = { type: 'error', message: action.payload || action.error.message };
      })
      .addCase(updateProperty.fulfilled, (state) => {
        state.notification = { type: 'success', message: 'Property updated successfully.' };
      })
      .addCase(updateProperty.rejected, (state, action) => {
        state.notification = { type: 'error', message: action.payload || action.error.message };
      })
      .addCase(updateUnit.fulfilled, (state) => {
        state.notification = { type: 'success', message: 'Unit updated successfully.' };
      })
      .addCase(updateUnit.rejected, (state, action) => {
        state.notification = { type: 'error', message: action.payload || action.error.message };
      })
      .addCase(updateAmenity.fulfilled, (state) => {
        state.notification = { type: 'success', message: 'Amenity updated successfully.' };
      })
      .addCase(updateAmenity.rejected, (state, action) => {
        state.notification = { type: 'error', message: action.payload || action.error.message };
      });
  }
});

export const { clearNotification, setNotification } = propertySlice.actions;

export default propertySlice.reducer;
