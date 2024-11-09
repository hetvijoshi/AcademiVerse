describe('Microsoft Entra ID Authentication', () => {
  // Define test constants
  const TEST_USER = {
    email: 'test@example.com',
    name: 'Test User',
    role: 'student',
    departmentCode: 'CSE'
  };
  const TEST_TOKENS = {
    access_token: 'mock_access_token',
    id_token: 'mock_id_token',
    token_type: 'Bearer'
  };

  // Setup authentication session before other tests
  before(() => {
    cy.session('authenticated-session', () => {
      // Mock the Microsoft authentication response
      cy.intercept('POST', '**/oauth/token', {
        statusCode: 200,
        body: TEST_TOKENS
      }).as('authRequest');

      // Mock the user data response
      cy.intercept('GET', '**/users/*', {
        statusCode: 200,
        body: {
          data: TEST_USER
        }
      }).as('userDataRequest');

      cy.visit('/');
      cy.wait(['@authRequest', '@userDataRequest']);
      
      // Verify successful login
      cy.get('[data-testid="welcome-message"]')
        .should('contain', 'Welcome back')
        .should('be.visible');
    }, {
      // Session options
      validate() {
        // Verify session is still valid
        cy.window().its('localStorage')
          .invoke('getItem', 'next-auth.session-token')
          .should('exist');
      },
      cacheAcrossSpecs: true
    });
  });

  it('should redirect to Microsoft login when not authenticated', () => {
    // Clear session for this specific test
    cy.clearAllSessionStorage();
    cy.visit('/');
    cy.url().should('include', 'login.microsoftonline.com');
  });

  it('should persist authentication across tests', () => {
    cy.visit('/');
    // Verify user is still logged in
    cy.get('[data-testid="welcome-message"]')
      .should('contain', `Welcome back, ${TEST_USER.name}`);
    cy.get('[data-testid="user-role"]')
      .should('contain', TEST_USER.role);
  });

  it('should handle new user registration', () => {
    const NEW_USER = {
      name: 'New User',
      userEmail: 'new@example.com',
      role: 'student',
      departmentCode: 'CSE'
    };

    // Clear session for registration test
    cy.clearAllSessionStorage();
    
    // Mock empty user response to trigger registration
    cy.intercept('GET', '**/users/*', {
      statusCode: 200,
      body: {
        data: null
      }
    }).as('emptyUserCheck');

    // Mock successful user registration
    cy.intercept('POST', '**/users', {
      statusCode: 200,
      body: {
        isError: false,
        data: NEW_USER
      }
    }).as('userRegistration');

    cy.visit('/');
    cy.wait(['@emptyUserCheck', '@userRegistration']);

    // Verify registration success
    cy.get('[data-testid="welcome-message"]')
      .should('contain', `Welcome back, ${NEW_USER.name}`);
  });

  it('should handle authentication errors', () => {
    // Clear session for error test
    cy.clearAllSessionStorage();
    
    // Mock authentication error
    cy.intercept('POST', '**/oauth/token', {
      statusCode: 401,
      body: {
        error: 'invalid_grant',
        error_description: 'Authentication failed'
      }
    }).as('failedAuth');

    cy.visit('/');
    cy.wait('@failedAuth');

    // Verify error handling
    cy.url().should('include', 'login.microsoftonline.com');
    cy.get('[data-testid="auth-error-message"]')
      .should('contain', 'Authentication failed')
      .should('be.visible');
  });
});
