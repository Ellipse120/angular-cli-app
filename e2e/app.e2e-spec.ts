import { FindatabaseWebPage } from './app.po';

describe('findatabase-web App', () => {
  let page: FindatabaseWebPage;

  beforeEach(() => {
    page = new FindatabaseWebPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
