export function addNewCategory(name: string) {
  cy.contains('New').click();
  cy.contains('Create Category');
  cy.get('input[name=name]').type(name);
  cy.contains('Save').click();
}

export function updateCategory(index: number, newName: string) {
  cy.get('tbody tr').eq(index).find('#editIcon').click();
  cy.contains('Update Category');
  cy.get('input[name=name]').clear().type(newName);
  cy.get('button[type=button]').contains('Update').click();
}

export function deleteCategory(index: number) {
  cy.get('tbody tr').eq(index).find('#deleteIcon').click();
  cy.contains('Delete Category');
  cy.contains(`Are you sure you want delete category:`)
  cy.get('button[type=button]').contains('Delete').click();
}
