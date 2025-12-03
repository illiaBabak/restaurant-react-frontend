describe("Test admin page", () => {
  beforeEach(() => {
    cy.visit("/admin?table-category=Waiters&page=1");
    cy.wait("@getWaiters");
  });

  it("Test sidebar", () => {
    cy.get('[data-testid="Dishes-sidebar-btn"]').click();

    cy.wait("@getDishes");

    cy.get('[data-testid="dishes-managment"]').should("be.visible");
    cy.get('[data-testid="waiters-managment"]').should("not.exist");

    cy.location("search").should("contain", "table-category=Dishes");

    cy.get('[data-testid="Waiters-sidebar-btn"]').click();

    cy.get('[data-testid="dishes-managment"]').should("not.exist");
    cy.get('[data-testid="waiters-managment"]').should("be.visible");

    cy.location("search").should("contain", "table-category=Waiters");
  });

  it("Test pagination", () => {
    cy.get('[data-testid="pagination-next-btn"]').click();

    cy.location("search").should("contain", "page=2");

    cy.get('[data-testid="pagination-next-btn"]').should("be.disabled");

    cy.get('[data-testid="pagination-prev-btn"]').click();

    cy.location("search").should("contain", "page=1");

    cy.get('[data-testid="pagination-prev-btn"]').should("be.disabled");
  });
});

describe("Waiters CRUD", () => {
  beforeEach(() => {
    cy.visit("/admin?table-category=Waiters&page=1");
    cy.wait("@getWaiters");
  });

  it("Create Waiter", () => {
    cy.get('[data-testid="add-waiter-btn"]').click();

    cy.get('[data-testid="waiter-name"]').type("Test user");
    cy.get('[data-testid="waiter-surname"]').type("Test surname");
    cy.get('[data-testid="waiter-email"]').type("test@example.com");
    cy.get('[data-testid="waiter-phone"]').type("+48123456789");
    cy.get('[data-testid="waiter-address"]').type("Test, New York");

    cy.get('[data-testid="create-waiter-btn"]').click();
    cy.wait("@createWaiter");

    cy.contains("Test user").should("be.visible");
  });

  it("Delete Waiter", () => {
    cy.get('[data-testid="table-row-0"]').click();

    cy.get('[data-testid="waiter-dlt-btn"]').click();
    cy.wait("@deleteWaiter");

    cy.contains("Test user").should("not.exist");
  });

  it("Update Waiter", () => {
    cy.get('[data-testid="table-row-0"]').click();

    cy.get('[data-testid="waiter-name"]').clear().type("Updated test user");

    cy.get('[data-testid="create-waiter-btn"]').click();
    cy.wait("@updateWaiter");

    cy.contains("Updated test user").should("be.visible");
  });
});

describe("Dishes CRUD", () => {
  beforeEach(() => {
    cy.visit("/admin?table-category=Dishes&page=1");
    cy.wait("@getDishes");
  });

  it("Create Dish", () => {
    cy.get('[data-testid="dishes-managment"]').should("be.visible");

    cy.get('[data-testid="add-dish-btn"]').click();

    cy.get('[data-testid="dish-name"]').type("Test dish");
    cy.get('[data-testid="dish-price"]').clear().type("1");
    cy.get('[data-testid="dish-weight"]').clear().type("20");

    cy.get('[data-testid="create-dish-btn"]').click();
    cy.wait("@createDish");

    cy.contains("Test dish").should("be.visible");
  });

  it("Delete Dish", () => {
    cy.get('[data-testid="dishes-managment"]').should("be.visible");

    cy.get('[data-testid="table-row-0"]').click();

    cy.get('[data-testid="dish-dlt-btn"]').click();
    cy.wait("@deleteDish");

    cy.contains("Margherita Pizza").should("not.exist");
  });

  it("Update Dish", () => {
    cy.get('[data-testid="dishes-managment"]').should("be.visible");

    cy.get('[data-testid="table-row-0"]').click();

    cy.get('[data-testid="dish-name"]').clear().type("Updated test dish");

    cy.get('[data-testid="create-dish-btn"]').click();
    cy.wait("@updateDish");

    cy.contains("Updated test dish").should("be.visible");
  });
});
