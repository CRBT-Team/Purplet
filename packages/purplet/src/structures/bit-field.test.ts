// tests/demo.js
import * as assert from 'uvu/assert';
import { UserFlags } from 'discord.js';
import { test } from 'uvu';
import { UserFlagsBitfield } from './bit-field';

// test('bitfield.has', () => {
//   const field = new BitField(0b100110);
//   assert.equal(field.has(1), false);
//   assert.equal(field.has(2), true);
//   assert.equal(field.has(4), true);
//   assert.equal(field.has(8), false);
//   assert.equal(field.has(16), false);
//   assert.equal(field.has(32), true);
// });
// test('bitfield.toArray()', () => {
//   const field = new BitField(0b100110);
//   assert.equal(field.toArray(), [2, 4, 32]);
// });
// test('bitfield.bitfield', () => {
//   const field = new BitField(0b100110);
//   assert.equal(field.bitfield, 0b100110);
// });
// test('bitfield.add', () => {
//   const field = new BitField(0b100110);
//   field.add(1);
//   assert.equal(field.bitfield, 0b100111);
//   field.add(2);
//   assert.equal(field.bitfield, 0b100111);
// });
// test('bitfield.remove', () => {
//   const field = new BitField(0b100110);
//   field.remove(1);
//   assert.equal(field.bitfield, 0b100110);
//   field.remove(2);
//   assert.equal(field.bitfield, 0b100100);
// });

test('test', () => {
  const userFlags = new UserFlagsBitfield(
    UserFlags.HypeSquadOnlineHouse1 | UserFlags.Spammer | UserFlags.PremiumEarlySupporter
  );
  assert.equal(
    userFlags.bitfield,
    UserFlags.HypeSquadOnlineHouse1 | UserFlags.Spammer | UserFlags.PremiumEarlySupporter
  );
  assert.equal(userFlags.has(UserFlags.HypeSquadOnlineHouse1), true);
  assert.equal(userFlags.has(UserFlags.Spammer), true);
  assert.equal(userFlags.has(UserFlags.PremiumEarlySupporter), true);
  assert.equal(userFlags.has(UserFlags.HypeSquadOnlineHouse2), false);
  assert.equal(userFlags.has(UserFlags.HypeSquadOnlineHouse3), false);
  assert.equal(userFlags.has(UserFlags.BugHunterLevel2), false);
  assert.equal(userFlags.has(UserFlags.BotHTTPInteractions), false);
  assert.equal(userFlags.has(UserFlags.Staff), false);
});

test.run();
