import { GildedRose, Item } from '@/gilded-rose';

describe('Conjured items', () => {
  it('lose two quality a day while before their sell-by date', () => {
    const shop = new GildedRose([new Item('Conjured Mana Cake', 5, 20)]);

    const [cake] = shop.updateQuality();

    expect(cake.quality).toBe(18);
  });
});
