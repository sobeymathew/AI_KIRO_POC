import { Given, When, Then } from '@cucumber/cucumber';

// =============================================================================
// COMMON STEPS - Shared across multiple feature files
// =============================================================================

// --- Application Access & Navigation ---

Given('the application is accessible', async function () {
  // Verify the application is reachable
});

Given('I am on the login page', async function () {
  // Navigate to the login page
});

Given('I am logged in to the self-service portal', async function () {
  // Login to the self-service portal
});

Given('I am logged in to the application', async function () {
  // Login to the application
});

Given('I am logged into the application', async function () {
  // Login to the application
});

Given('I am on the home page', async function () {
  // Verify user is on the home page
});

Given('I have a valid user account', async function () {
  // Ensure valid user account exists
});

// --- Form Interactions ---

When('I click the {string} button', async function (buttonName: string) {
  // Click button by name
});

When('I click the "Submit" button', async function () {
  // Click the Submit button
});

When('I click the sign in button', async function () {
  // Click the sign in button
});

When('I leave all mandatory fields empty', async function () {
  // Leave all mandatory fields empty
});

When('I fill in all mandatory fields with valid data', async function () {
  // Fill in all mandatory fields with valid data
});

When('I fill in {string} with a valid user', async function (field: string) {
  // Fill in a field with a valid user
});

When('I fill in {string} with {string}', async function (field: string, value: string) {
  // Fill in a field with a specific value
});

When('I enter a valid user in the {string} field', async function (field: string) {
  // Enter a valid user in the specified field
});

When('I select a value from the {string} dropdown', async function (field: string) {
  // Select a value from a dropdown
});

When('I select {string} from the dropdown', async function (field: string) {
  // Select from a dropdown
});

When('I select {string} as {string}', async function (field: string, value: string) {
  // Select a specific value from a field
});

When('I enter {string} with {string}', async function (field: string, value: string) {
  // Enter a value in a text field
});

When('I enter {string} with a valid city', async function (field: string) {
  // Enter a valid city name
});

When('I enter {string} with a future date', async function (field: string) {
  // Enter a future date
});

When('I enter {string} with a date after start date', async function (field: string) {
  // Enter a date after the start date
});

When('I enter {string} with a date before the start date', async function (field: string) {
  // Enter a date before the start date
});

When('I enter {string} with a date 3 days after start date', async function (field: string) {
  // Enter a date 3 days after start date
});

When('I enter {string} with a valid amount', async function (field: string) {
  // Enter a valid amount
});

When('I enter {string} with a valid description', async function (field: string) {
  // Enter a valid description
});

When('I enter {string} with additional details', async function (field: string) {
  // Enter additional details
});

When('I clear the {string} field', async function (field: string) {
  // Clear a specific field
});

When('I change {string} to {string}', async function (field: string, value: string) {
  // Change a field to a new value
});

When('I upload an attachment file', async function () {
  // Upload an attachment
});

When('I upload a supported file of size less than 4 MB', async function () {
  // Upload a file under 4MB
});

When('I interact with all form fields', async function () {
  // Interact with all form fields
});

When('I add an optional comment {string}', async function (comment: string) {
  // Add an optional comment
});

// --- Common Assertions ---

Then('I should see a success confirmation message', async function () {
  // Verify success message is displayed
});

Then('a success confirmation message should be displayed', async function () {
  // Verify success confirmation
});

Then('a unique request number should be generated', async function () {
  // Verify unique request number
});

Then('the request should be submitted successfully', async function () {
  // Verify request submitted
});

Then('the request should not be submitted', async function () {
  // Verify request not submitted
});

Then('I should see validation errors for mandatory fields', async function () {
  // Verify validation errors shown
});

Then('I should see a validation error for {string}', async function (field: string) {
  // Verify specific field validation error
});

Then('I should see a date validation error', async function () {
  // Verify date validation error
});

Then('no application errors should be displayed', async function () {
  // Verify no application errors
});

Then('no application errors should be displayed during the entire workflow', async function () {
  // Verify no errors during entire workflow
});

Then('no application errors should be displayed during the workflow', async function () {
  // Verify no errors during workflow
});

Then('no application error pages should be displayed', async function () {
  // Verify no error pages
});

Then('no JavaScript console errors should be present', async function () {
  // Check browser console for errors
});

Then('the workflow should complete without unexpected behavior', async function () {
  // Verify workflow completes normally
});

Then('an Incident Number should be generated', async function () {
  // Verify incident number generated
});

Then('the incident should not be created', async function () {
  // Verify incident was not created
});
