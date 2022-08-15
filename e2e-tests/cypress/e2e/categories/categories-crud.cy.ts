import { addNewCategory, updateCategory, deleteCategory } from '../../common/categories';

context('Categories', () => {
    beforeEach(() => {
      cy.visit('http://frontend:3000');
      cy.login();
      cy.get('#categoriesMenuItem').click();
      cy.url().should('include', '/admin/categories');
    });

    it('should create/read/update/delete categories', () => {
      addNewCategory('Mixs')
      cy.get('tbody tr').should('have.length', 1);
      addNewCategory('Created');
      cy.get('tbody tr').should('have.length', 2);

      updateCategory(0, 'Created Updated');
      cy.get('tbody tr').contains('Created Updated');
      updateCategory(1, 'Mixs Updated');
      cy.get('tbody tr').contains('Mixs Updated');

      deleteCategory(0)
      cy.get('tbody tr').should('have.length', 1);
      deleteCategory(0);
      cy.get('tbody tr').should('have.length', 0);
    });
});
