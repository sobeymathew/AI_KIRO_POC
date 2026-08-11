@regression @authentication
Feature: User Authentication - Full Regression
  As a registered user
  I want comprehensive authentication validation
  So that the login system is thoroughly tested

  Background:
    Given the application is accessible
    And I am on the login page

  @regression @p1
  Scenario: Email field validation - empty
    When I leave the email field empty
    And I enter password "Test@12345"
    And I click the sign in button
    Then I should see error "Email is required"

  @regression @p1
  Scenario: Email field validation - invalid format
    When I enter email "not-an-email"
    And I enter password "Test@12345"
    And I click the sign in button
    Then I should see error "Invalid email format"

  @regression @p1
  Scenario: Password field validation - empty
    When I enter email "test@example.com"
    And I leave the password field empty
    And I click the sign in button
    Then I should see error "Password is required"

  @regression @p2
  Scenario: Password field masks input
    When I enter password "secretpassword"
    Then the password field should have type "password"

  @regression @p2
  Scenario: Remember me functionality
    When I enter my email "test@example.com"
    And I enter my password
    And I check the remember me checkbox
    And I click the sign in button
    Then I should be redirected to the dashboard
    And my session should persist after browser restart

  @regression @p1
  Scenario Outline: Login with various invalid inputs
    When I enter email "<email>"
    And I enter password "<password>"
    And I click the sign in button
    Then I should see an error message

    Examples:
      | email              | password    |
      | test@example.com   | wrong       |
      | wrong@example.com  | Test@12345  |
      | admin' OR '1'='1   | Test@12345  |
      | <script>alert</script> | Test@12345 |

  @regression @p2
  Scenario: Google OAuth login button visible
    Then I should see the Google login button
    And the Google login button should be clickable

  @regression @p2
  Scenario: GitHub OAuth login button visible
    Then I should see the GitHub login button
    And the GitHub login button should be clickable

  @regression @p2
  Scenario: Navigate to sign up page
    When I click the sign up link
    Then I should be on the registration page
