@smoke @authentication
Feature: User Authentication - Smoke
  As a registered user
  I want to log in to the application
  So that I can access my personalized dashboard

  Background:
    Given the application is accessible
    And I am on the login page

  @smoke @p0
  Scenario: Successful login with valid credentials
    Given I have a valid user account
    When I enter my email "test@example.com"
    And I enter my password
    And I click the sign in button
    Then I should be redirected to the dashboard
    And I should see my welcome message
    And I should see the user avatar

  @smoke @p0
  Scenario: Failed login with invalid credentials
    When I enter email "invalid@example.com"
    And I enter password "wrongpassword"
    And I click the sign in button
    Then I should see an error message
    And I should remain on the login page

  @smoke @p1
  Scenario: Login form displays correctly
    Then I should see the email input field
    And I should see the password input field
    And I should see the sign in button
    And the sign in button should be enabled

  @smoke @p1
  Scenario: Navigate to forgot password
    When I click the forgot password link
    Then I should be on the forgot password page
