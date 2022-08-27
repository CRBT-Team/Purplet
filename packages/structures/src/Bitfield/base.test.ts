// tests/demo.js
import assert from 'assert';
import { describe, test } from 'bun:test';
import { UserFlags } from 'discord-api-types/v10';
import { UserFlagsBitfield } from '.';
import { Bitfield } from './base';

describe('Bitfield', () => {
  test('.has', () => {
    const field = new Bitfield(0b100110);
    assert.strictEqual(field.has(1), false);
    assert.strictEqual(field.has(2), true);
    assert.strictEqual(field.has(4), true);
    assert.strictEqual(field.has(8), false);
    assert.strictEqual(field.has(16), false);
    assert.strictEqual(field.has(32), true);
  });

  test('.toArray()', () => {
    const field = new Bitfield(0b100110);
    assert.deepEqual(field.toArray(), [2, 4, 32]);
  });

  test('.bitfield', () => {
    const field = new Bitfield(0b100110);
    assert.strictEqual(field.bitfield, 0b100110);
  });

  test('.add', () => {
    const field = new Bitfield(0b100110);
    field.add(1);
    assert.strictEqual(field.bitfield, 0b100111);
    field.add(2);
    assert.strictEqual(field.bitfield, 0b100111);
  });

  test('.remove', () => {
    const field = new Bitfield(0b100110);
    field.remove(1);
    assert.strictEqual(field.bitfield, 0b100110);
    field.remove(2);
    assert.strictEqual(field.bitfield, 0b100100);
  });

  test('UserFlagsBitfield', () => {
    const userFlags = new UserFlagsBitfield(
      UserFlags.HypeSquadOnlineHouse1 | UserFlags.Spammer | UserFlags.PremiumEarlySupporter
    );
    assert.strictEqual(
      userFlags.bitfield,
      UserFlags.HypeSquadOnlineHouse1 | UserFlags.Spammer | UserFlags.PremiumEarlySupporter
    );
    assert.strictEqual(userFlags.has(UserFlags.HypeSquadOnlineHouse1), true);
    assert.strictEqual(userFlags.has(UserFlags.Spammer), true);
    assert.strictEqual(userFlags.has(UserFlags.PremiumEarlySupporter), true);
    assert.strictEqual(userFlags.has(UserFlags.HypeSquadOnlineHouse2), false);
    assert.strictEqual(userFlags.has(UserFlags.HypeSquadOnlineHouse3), false);
    assert.strictEqual(userFlags.has(UserFlags.BugHunterLevel2), false);
    assert.strictEqual(userFlags.has(UserFlags.BotHTTPInteractions), false);
    assert.strictEqual(userFlags.has(UserFlags.Staff), false);
  });
});
