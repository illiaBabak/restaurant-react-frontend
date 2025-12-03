describe("Test receipt page", () => {
  beforeEach(() => {
    cy.visit("/receipt");
  });

  it("Shows error when creating bill without dishes", () => {
    cy.wait("@getDishes");
    cy.wait("@getAllWaiters");

    cy.get('[data-testid="create-bill-btn"]').click();

    cy.get('[data-testid="alert"]').should("be.visible");
  });

  it("Increments and decrements dish quantity", () => {
    cy.wait("@getDishes");

    const dishId = "1";

    cy.get(`[data-testid="dish-quantity-${dishId}"]`).should("have.text", "0");

    cy.get(`[data-testid="dish-plus-${dishId}"]`).click();
    cy.get(`[data-testid="dish-quantity-${dishId}"]`).should("have.text", "1");

    cy.get(`[data-testid="dish-plus-${dishId}"]`).click();
    cy.get(`[data-testid="dish-quantity-${dishId}"]`).should("have.text", "2");

    cy.get(`[data-testid="dish-minus-${dishId}"]`).click();
    cy.get(`[data-testid="dish-quantity-${dishId}"]`).should("have.text", "1");

    cy.get(`[data-testid="dish-minus-${dishId}"]`).click();
    cy.get(`[data-testid="dish-quantity-${dishId}"]`).should("have.text", "0");

    // проверка визуального "disable"
    cy.get(`[data-testid="dish-minus-${dishId}"]`)
      .should("have.class", "cursor-not-allowed")
      .and("have.class", "opacity-50");
  });
});
