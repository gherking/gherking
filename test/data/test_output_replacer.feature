Feature: Test feature file for login
  feature description

  Background: Opening login page
    Given the login page is opened

  Scenario Outline: Login with <user> without logout
    And username is filled with <username>
    And password is filled filth <password>
    And login button is clicked
    Then the profile page of <user> should be loaded

    Examples:
      | user | username | password |
      | {u1} | user1    | pwd1  |
      | {u2} | user2    | pwd2  |

  @logout
  Scenario: Testing logout
    And username is filled with <username>
    And password is filled filth <pwd>
    And login button is clicked
    Then the profile page of <user> should be loaded
    When the sign out is clicked
    Then the user should be logged out

  feature-login
  u1-user_1
  u2_user_2
  feature2-logout
  button-sign out
  description-feature description
  tag1-logout
  pwd-password

