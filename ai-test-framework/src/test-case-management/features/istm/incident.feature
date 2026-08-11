@e2e @user-journey
Feature: Complete User Journey
  As a registered user
  I want to perform a full workflow from login to logout
  So that I can verify the end-to-end application flow

  @e2e @p0
  Scenario: Full login to dashboard to settings to logout journey
    Given the application is accessible
    And I am on the login page
    When I login with valid credentials
    Then I should see the dashboard

    When I navigate to settings
    Then I should see the settings page

    When I navigate back to dashboard
    Then I should see the dashboard

    When I click the logout button
    Then I should be redirected to the login page
    And the login form should be displayed

  @e2e @p1
  Scenario: Session timeout handling
    Given I am logged in to the application
    When my session expires
    And I try to navigate to a protected page
    Then I should be redirected to the login page
    And I should see a session expired message

  @e2e @p1
  Scenario: Multi-page navigation preserves state
    Given I am logged in to the application
    When I navigate to the profile page
    And I update my display name
    And I navigate to the dashboard
    And I navigate back to the profile page
    Then my updated display name should be preserved
