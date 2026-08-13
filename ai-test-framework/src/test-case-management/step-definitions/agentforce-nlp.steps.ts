import { Given, When, Then } from '@cucumber/cucumber';

// =============================================================================
// AGENTFORCE NLP & CONVERSATION STEPS
// =============================================================================

// --- Describing Issues ---

When('I describe my issue as {string}', async function (description: string) {
  // Describe issue to assistant
});

When('I describe {string}', async function (description: string) {
  // Describe issue (short form)
});

Given('I describe {string}', async function (description: string) {
  // Describe issue (Given variant)
});

When('I describe my issue with a message exceeding 1000 characters', async function () {
  // Describe issue with very long message
});

When('I describe a request that is outside the assistant\'s capabilities', async function () {
  // Describe out-of-scope request
});

When('I describe an issue that has no matching knowledge article', async function () {
  // Describe issue with no knowledge match
});

Given('I have described my issue as {string}', async function (description: string) {
  // Issue previously described
});

Given('I have described my issue briefly as {string}', async function (description: string) {
  // Issue briefly described
});

// --- Conversation Responses ---

When('I respond {string}', async function (response: string) {
  // Respond to assistant
});

Given('I respond {string}', async function (response: string) {
  // Respond to assistant (Given variant)
});

When('I provide {string}', async function (info: string) {
  // Provide information
});

Given('I provide {string}', async function (info: string) {
  // Provide information (Given variant)
});

When('I ask {string}', async function (question: string) {
  // Ask a question
});

Given('I ask {string}', async function (question: string) {
  // Ask a question (Given variant)
});

When('I say {string}', async function (statement: string) {
  // Say something to the assistant
});

Given('I say {string}', async function (statement: string) {
  // Say something (Given variant)
});

// --- Intent Identification ---

Then('the assistant identifies my intent as a VPN connectivity question', async function () {
  // Verify VPN intent identified
});

Then('the assistant identifies the intent as a connectivity issue', async function () {
  // Verify connectivity intent
});

Then('the assistant identifies the intent as a system failure', async function () {
  // Verify system failure intent
});

Then('the assistant identifies this as a request for equipment', async function () {
  // Verify equipment request intent
});

Then('the assistant identifies this as an access\\/authentication issue', async function () {
  // Verify access/auth intent
});

Then('the assistant identifies the intent despite language errors', async function () {
  // Verify intent despite errors
});

Then('the assistant identifies two separate intents', async function () {
  // Verify multiple intents identified
});

Then('the assistant has low confidence in the intent', async function () {
  // Verify low confidence
});

// --- Clarification ---

Then('the assistant asks clarifying questions to understand the issue', async function () {
  // Verify clarification questions
});

Then('the assistant asks clarifying questions to determine if it is an Incident or Service Request', async function () {
  // Verify type determination questions
});

Then('asks clarifying questions about the nature of the problem', async function () {
  // Verify problem nature questions
});

Then('asks whether I am experiencing an error or need new access', async function () {
  // Verify error vs access question
});

Then('asks which issue I would like to address first', async function () {
  // Verify issue priority question
});

Then('the conversation context is maintained', async function () {
  // Verify context maintained
});

Then('the assistant maintains context from previous messages', async function () {
  // Verify context from previous messages
});

Then('the assistant maintains the conversation context', async function () {
  // Verify conversation context maintained
});

// --- Conversation Flow ---

When('the assistant asks for additional details', async function () {
  // Assistant asks for more details
});

When('the assistant asks for specifications', async function () {
  // Assistant asks for specs
});

Then('the assistant asks for justification', async function () {
  // Assistant asks for justification
});

Given('the assistant asks for justification', async function () {
  // Assistant asks for justification (Given variant)
});

Then('the assistant asks for clarification', async function () {
  // Assistant asks for clarification
});

Given('the assistant asks for clarification', async function () {
  // Assistant asks for clarification (Given variant)
});

When('the assistant asks about my second issue', async function () {
  // Assistant moves to second issue
});

Then('the assistant responds with {string}', async function (behavior: string) {
  // Verify assistant response
});

Then('provides relevant assistance', async function () {
  // Verify relevant assistance
});

Then('provides assistance relevant to both messages combined', async function () {
  // Verify combined context assistance
});

Then('responds with a relevant summary and next steps', async function () {
  // Verify summary and next steps
});

Then('provides relevant information about similar incidents', async function () {
  // Verify similar incident info
});

Then('provides appropriate escalation paths', async function () {
  // Verify escalation paths
});

Then('the assistant clearly identifies it as out-of-scope', async function () {
  // Verify out-of-scope identification
});

Then('the assistant processes the entire description', async function () {
  // Verify full description processed
});

Then('gathers all required information', async function () {
  // Verify all info gathered
});

Then('gathers remaining details', async function () {
  // Verify remaining details gathered
});

Then('gathers required details including justification', async function () {
  // Verify details with justification
});

Then('the assistant gathers the remaining required details', async function () {
  // Verify remaining details gathered
});

Given('I describe a clear network connectivity issue', async function () {
  // Describe clear network issue
});

Given('I describe an ambiguous issue spanning multiple categories', async function () {
  // Describe ambiguous multi-category issue
});
