/**
 * ITSM Test Data — Centralized test data for ITSM QA Platform.
 * Contains form data, expected values, and test configurations for ITSM modules.
 */

/** Incident creation test data */
export const incidentTestData = {
  validIncident: {
    requestedFor: 'ITSM Requester 4',
    urgency: 'Low - Productivity not impacted',
    category: 'Hardware',
    subCategory: 'Laptop',
    briefDescription: 'Test incident for validation',
    detailedDescription: 'This is a test incident created to verify the creation workflow',
  },
  expectedFormats: {
    incidentNumberPattern: /INC-\d+/,
  },
};

/** COI Request test data */
export const coiTestData = {
  validRequest: {
    certificateHolderName: 'Test Corp Ltd',
    certificateHolderAddress: '123 Test Street, Suite 100',
    generalCoverage: '1000000',
    workersCompCoverage: '500000',
    autoCoverage: '250000',
    umbrellaCoverage: '2000000',
    cyberCoverage: '1000000',
    crimeCoverage: '500000',
  },
};

/** Travel Request test data */
export const travelTestData = {
  validRequest: {
    category: 'Travel Approval',
    subCategory: 'Domestic Billable',
    departureCity: 'New York',
    arrivalCity: 'San Francisco',
    estimatedCost: '2500',
    purposeOfVisit: 'Client meeting for Q3 project review',
    additionalComments: 'Flight and hotel booking required',
  },
};

/** Common dropdown values available in the ITSM portal */
export const dropdownOptions = {
  urgency: [
    'Low - Productivity not impacted',
    'Medium - Productivity degraded',
    'High - Productivity impacted',
  ],
  categories: [
    'Hardware',
    'Software',
    'Network & Connectivity',
    'Access & Authentication',
  ],
};
