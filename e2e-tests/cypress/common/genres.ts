export function addNewGenre(name: string) {
  cy.contains('New').click();
  cy.contains('Create Genre');
  cy.get('input[name=name]').type(name);
  cy.contains('Save').click();
}

export function updateGenre(index: number, newName: string) {
  cy.get('tbody tr').eq(index).find('#editIcon').click();
  cy.contains('Update Genre');
  cy.get('input[name=name]').clear().type(newName);
  cy.get('button[type=button]').contains('Update').click();
}

export function deleteGenre(index: number) {
  cy.get('tbody tr').eq(index).find('#deleteIcon').click();
  cy.contains('Delete Genre');
  cy.contains(`Are you sure you want delete genre:`)
  cy.get('button[type=button]').contains('Delete').click();
}
