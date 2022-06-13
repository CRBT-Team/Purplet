---
id: "GatewayEventHook"
title: "Interface: GatewayEventHook"
sidebar_label: "GatewayEventHook"
sidebar_position: 0
custom_edit_url: null
---

## Properties

### CHANNEL\_CREATE

• `Optional` **CHANNEL\_CREATE**: [`EventHook`](../modules.md#eventhook)<`APIChannel`, `void`\>

#### Defined in

[packages/purplet/src/lib/feature.ts:130](https://github.com/CRBT-Team/Purplet/blob/b72b1ee/packages/purplet/src/lib/feature.ts#L130)

___

### CHANNEL\_DELETE

• `Optional` **CHANNEL\_DELETE**: [`EventHook`](../modules.md#eventhook)<`APIChannel`, `void`\>

#### Defined in

[packages/purplet/src/lib/feature.ts:131](https://github.com/CRBT-Team/Purplet/blob/b72b1ee/packages/purplet/src/lib/feature.ts#L131)

___

### CHANNEL\_PINS\_UPDATE

• `Optional` **CHANNEL\_PINS\_UPDATE**: [`EventHook`](../modules.md#eventhook)<`GatewayChannelPinsUpdateDispatchData`, `void`\>

#### Defined in

[packages/purplet/src/lib/feature.ts:132](https://github.com/CRBT-Team/Purplet/blob/b72b1ee/packages/purplet/src/lib/feature.ts#L132)

___

### CHANNEL\_UPDATE

• `Optional` **CHANNEL\_UPDATE**: [`EventHook`](../modules.md#eventhook)<`APIChannel`, `void`\>

#### Defined in

[packages/purplet/src/lib/feature.ts:133](https://github.com/CRBT-Team/Purplet/blob/b72b1ee/packages/purplet/src/lib/feature.ts#L133)

___

### GUILD\_BAN\_ADD

• `Optional` **GUILD\_BAN\_ADD**: [`EventHook`](../modules.md#eventhook)<`GatewayGuildBanModifyDispatchData`, `void`\>

#### Defined in

[packages/purplet/src/lib/feature.ts:134](https://github.com/CRBT-Team/Purplet/blob/b72b1ee/packages/purplet/src/lib/feature.ts#L134)

___

### GUILD\_BAN\_REMOVE

• `Optional` **GUILD\_BAN\_REMOVE**: [`EventHook`](../modules.md#eventhook)<`GatewayGuildBanModifyDispatchData`, `void`\>

#### Defined in

[packages/purplet/src/lib/feature.ts:135](https://github.com/CRBT-Team/Purplet/blob/b72b1ee/packages/purplet/src/lib/feature.ts#L135)

___

### GUILD\_CREATE

• `Optional` **GUILD\_CREATE**: [`EventHook`](../modules.md#eventhook)<`GatewayGuildCreateDispatchData`, `void`\>

#### Defined in

[packages/purplet/src/lib/feature.ts:136](https://github.com/CRBT-Team/Purplet/blob/b72b1ee/packages/purplet/src/lib/feature.ts#L136)

___

### GUILD\_DELETE

• `Optional` **GUILD\_DELETE**: [`EventHook`](../modules.md#eventhook)<`APIUnavailableGuild`, `void`\>

#### Defined in

[packages/purplet/src/lib/feature.ts:137](https://github.com/CRBT-Team/Purplet/blob/b72b1ee/packages/purplet/src/lib/feature.ts#L137)

___

### GUILD\_EMOJIS\_UPDATE

• `Optional` **GUILD\_EMOJIS\_UPDATE**: [`EventHook`](../modules.md#eventhook)<`GatewayGuildEmojisUpdateDispatchData`, `void`\>

#### Defined in

[packages/purplet/src/lib/feature.ts:138](https://github.com/CRBT-Team/Purplet/blob/b72b1ee/packages/purplet/src/lib/feature.ts#L138)

___

### GUILD\_INTEGRATIONS\_UPDATE

• `Optional` **GUILD\_INTEGRATIONS\_UPDATE**: [`EventHook`](../modules.md#eventhook)<`GatewayGuildIntegrationsUpdateDispatchData`, `void`\>

#### Defined in

[packages/purplet/src/lib/feature.ts:139](https://github.com/CRBT-Team/Purplet/blob/b72b1ee/packages/purplet/src/lib/feature.ts#L139)

___

### GUILD\_MEMBERS\_CHUNK

• `Optional` **GUILD\_MEMBERS\_CHUNK**: [`EventHook`](../modules.md#eventhook)<`GatewayGuildMembersChunkDispatchData`, `void`\>

#### Defined in

[packages/purplet/src/lib/feature.ts:142](https://github.com/CRBT-Team/Purplet/blob/b72b1ee/packages/purplet/src/lib/feature.ts#L142)

___

### GUILD\_MEMBER\_ADD

• `Optional` **GUILD\_MEMBER\_ADD**: [`EventHook`](../modules.md#eventhook)<`GatewayGuildMemberAddDispatchData`, `void`\>

#### Defined in

[packages/purplet/src/lib/feature.ts:140](https://github.com/CRBT-Team/Purplet/blob/b72b1ee/packages/purplet/src/lib/feature.ts#L140)

___

### GUILD\_MEMBER\_REMOVE

• `Optional` **GUILD\_MEMBER\_REMOVE**: [`EventHook`](../modules.md#eventhook)<`GatewayGuildMemberRemoveDispatchData`, `void`\>

#### Defined in

[packages/purplet/src/lib/feature.ts:141](https://github.com/CRBT-Team/Purplet/blob/b72b1ee/packages/purplet/src/lib/feature.ts#L141)

___

### GUILD\_MEMBER\_UPDATE

• `Optional` **GUILD\_MEMBER\_UPDATE**: [`EventHook`](../modules.md#eventhook)<`GatewayGuildMemberUpdateDispatchData`, `void`\>

#### Defined in

[packages/purplet/src/lib/feature.ts:143](https://github.com/CRBT-Team/Purplet/blob/b72b1ee/packages/purplet/src/lib/feature.ts#L143)

___

### GUILD\_ROLE\_CREATE

• `Optional` **GUILD\_ROLE\_CREATE**: [`EventHook`](../modules.md#eventhook)<`GatewayGuildRoleModifyDispatchData`, `void`\>

#### Defined in

[packages/purplet/src/lib/feature.ts:144](https://github.com/CRBT-Team/Purplet/blob/b72b1ee/packages/purplet/src/lib/feature.ts#L144)

___

### GUILD\_ROLE\_DELETE

• `Optional` **GUILD\_ROLE\_DELETE**: [`EventHook`](../modules.md#eventhook)<`GatewayGuildRoleDeleteDispatchData`, `void`\>

#### Defined in

[packages/purplet/src/lib/feature.ts:145](https://github.com/CRBT-Team/Purplet/blob/b72b1ee/packages/purplet/src/lib/feature.ts#L145)

___

### GUILD\_ROLE\_UPDATE

• `Optional` **GUILD\_ROLE\_UPDATE**: [`EventHook`](../modules.md#eventhook)<`GatewayGuildRoleModifyDispatchData`, `void`\>

#### Defined in

[packages/purplet/src/lib/feature.ts:146](https://github.com/CRBT-Team/Purplet/blob/b72b1ee/packages/purplet/src/lib/feature.ts#L146)

___

### GUILD\_SCHEDULED\_EVENT\_CREATE

• `Optional` **GUILD\_SCHEDULED\_EVENT\_CREATE**: [`EventHook`](../modules.md#eventhook)<`APIGuildScheduledEvent`, `void`\>

#### Defined in

[packages/purplet/src/lib/feature.ts:177](https://github.com/CRBT-Team/Purplet/blob/b72b1ee/packages/purplet/src/lib/feature.ts#L177)

___

### GUILD\_SCHEDULED\_EVENT\_DELETE

• `Optional` **GUILD\_SCHEDULED\_EVENT\_DELETE**: [`EventHook`](../modules.md#eventhook)<`APIGuildScheduledEvent`, `void`\>

#### Defined in

[packages/purplet/src/lib/feature.ts:179](https://github.com/CRBT-Team/Purplet/blob/b72b1ee/packages/purplet/src/lib/feature.ts#L179)

___

### GUILD\_SCHEDULED\_EVENT\_UPDATE

• `Optional` **GUILD\_SCHEDULED\_EVENT\_UPDATE**: [`EventHook`](../modules.md#eventhook)<`APIGuildScheduledEvent`, `void`\>

#### Defined in

[packages/purplet/src/lib/feature.ts:178](https://github.com/CRBT-Team/Purplet/blob/b72b1ee/packages/purplet/src/lib/feature.ts#L178)

___

### GUILD\_SCHEDULED\_EVENT\_USER\_ADD

• `Optional` **GUILD\_SCHEDULED\_EVENT\_USER\_ADD**: [`EventHook`](../modules.md#eventhook)<`GatewayGuildScheduledEventUserAddDispatchData`, `void`\>

#### Defined in

[packages/purplet/src/lib/feature.ts:180](https://github.com/CRBT-Team/Purplet/blob/b72b1ee/packages/purplet/src/lib/feature.ts#L180)

___

### GUILD\_SCHEDULED\_EVENT\_USER\_REMOVE

• `Optional` **GUILD\_SCHEDULED\_EVENT\_USER\_REMOVE**: [`EventHook`](../modules.md#eventhook)<`GatewayGuildScheduledEventUserRemoveDispatchData`, `void`\>

#### Defined in

[packages/purplet/src/lib/feature.ts:181](https://github.com/CRBT-Team/Purplet/blob/b72b1ee/packages/purplet/src/lib/feature.ts#L181)

___

### GUILD\_STICKERS\_UPDATE

• `Optional` **GUILD\_STICKERS\_UPDATE**: [`EventHook`](../modules.md#eventhook)<`GatewayGuildStickersUpdateDispatchData`, `void`\>

#### Defined in

[packages/purplet/src/lib/feature.ts:147](https://github.com/CRBT-Team/Purplet/blob/b72b1ee/packages/purplet/src/lib/feature.ts#L147)

___

### GUILD\_UPDATE

• `Optional` **GUILD\_UPDATE**: [`EventHook`](../modules.md#eventhook)<`APIGuild`, `void`\>

#### Defined in

[packages/purplet/src/lib/feature.ts:148](https://github.com/CRBT-Team/Purplet/blob/b72b1ee/packages/purplet/src/lib/feature.ts#L148)

___

### INTEGRATION\_CREATE

• `Optional` **INTEGRATION\_CREATE**: [`EventHook`](../modules.md#eventhook)<`GatewayIntegrationCreateDispatchData`, `void`\>

#### Defined in

[packages/purplet/src/lib/feature.ts:149](https://github.com/CRBT-Team/Purplet/blob/b72b1ee/packages/purplet/src/lib/feature.ts#L149)

___

### INTEGRATION\_DELETE

• `Optional` **INTEGRATION\_DELETE**: [`EventHook`](../modules.md#eventhook)<`GatewayIntegrationDeleteDispatchData`, `void`\>

#### Defined in

[packages/purplet/src/lib/feature.ts:150](https://github.com/CRBT-Team/Purplet/blob/b72b1ee/packages/purplet/src/lib/feature.ts#L150)

___

### INTEGRATION\_UPDATE

• `Optional` **INTEGRATION\_UPDATE**: [`EventHook`](../modules.md#eventhook)<`GatewayIntegrationUpdateDispatchData`, `void`\>

#### Defined in

[packages/purplet/src/lib/feature.ts:151](https://github.com/CRBT-Team/Purplet/blob/b72b1ee/packages/purplet/src/lib/feature.ts#L151)

___

### INVITE\_CREATE

• `Optional` **INVITE\_CREATE**: [`EventHook`](../modules.md#eventhook)<`GatewayInviteCreateDispatchData`, `void`\>

#### Defined in

[packages/purplet/src/lib/feature.ts:152](https://github.com/CRBT-Team/Purplet/blob/b72b1ee/packages/purplet/src/lib/feature.ts#L152)

___

### INVITE\_DELETE

• `Optional` **INVITE\_DELETE**: [`EventHook`](../modules.md#eventhook)<`GatewayInviteDeleteDispatchData`, `void`\>

#### Defined in

[packages/purplet/src/lib/feature.ts:153](https://github.com/CRBT-Team/Purplet/blob/b72b1ee/packages/purplet/src/lib/feature.ts#L153)

___

### MESSAGE\_CREATE

• `Optional` **MESSAGE\_CREATE**: [`EventHook`](../modules.md#eventhook)<`APIMessage`, `void`\>

#### Defined in

[packages/purplet/src/lib/feature.ts:154](https://github.com/CRBT-Team/Purplet/blob/b72b1ee/packages/purplet/src/lib/feature.ts#L154)

___

### MESSAGE\_DELETE

• `Optional` **MESSAGE\_DELETE**: [`EventHook`](../modules.md#eventhook)<`GatewayMessageDeleteDispatchData`, `void`\>

#### Defined in

[packages/purplet/src/lib/feature.ts:155](https://github.com/CRBT-Team/Purplet/blob/b72b1ee/packages/purplet/src/lib/feature.ts#L155)

___

### MESSAGE\_DELETE\_BULK

• `Optional` **MESSAGE\_DELETE\_BULK**: [`EventHook`](../modules.md#eventhook)<`GatewayMessageDeleteBulkDispatchData`, `void`\>

#### Defined in

[packages/purplet/src/lib/feature.ts:156](https://github.com/CRBT-Team/Purplet/blob/b72b1ee/packages/purplet/src/lib/feature.ts#L156)

___

### MESSAGE\_REACTION\_ADD

• `Optional` **MESSAGE\_REACTION\_ADD**: [`EventHook`](../modules.md#eventhook)<`Omit`<{ `channel_id`: `string` ; `emoji`: `APIEmoji` ; `guild_id?`: `string` ; `member?`: `APIGuildMember` ; `message_id`: `string` ; `user_id`: `string`  }, `never`\>, `void`\>

#### Defined in

[packages/purplet/src/lib/feature.ts:157](https://github.com/CRBT-Team/Purplet/blob/b72b1ee/packages/purplet/src/lib/feature.ts#L157)

___

### MESSAGE\_REACTION\_REMOVE

• `Optional` **MESSAGE\_REACTION\_REMOVE**: [`EventHook`](../modules.md#eventhook)<`Omit`<{ `channel_id`: `string` ; `emoji`: `APIEmoji` ; `guild_id?`: `string` ; `member?`: `APIGuildMember` ; `message_id`: `string` ; `user_id`: `string`  }, ``"member"``\>, `void`\>

#### Defined in

[packages/purplet/src/lib/feature.ts:158](https://github.com/CRBT-Team/Purplet/blob/b72b1ee/packages/purplet/src/lib/feature.ts#L158)

___

### MESSAGE\_REACTION\_REMOVE\_ALL

• `Optional` **MESSAGE\_REACTION\_REMOVE\_ALL**: [`EventHook`](../modules.md#eventhook)<`MessageReactionRemoveData`, `void`\>

#### Defined in

[packages/purplet/src/lib/feature.ts:159](https://github.com/CRBT-Team/Purplet/blob/b72b1ee/packages/purplet/src/lib/feature.ts#L159)

___

### MESSAGE\_REACTION\_REMOVE\_EMOJI

• `Optional` **MESSAGE\_REACTION\_REMOVE\_EMOJI**: [`EventHook`](../modules.md#eventhook)<`GatewayMessageReactionRemoveEmojiDispatchData`, `void`\>

#### Defined in

[packages/purplet/src/lib/feature.ts:160](https://github.com/CRBT-Team/Purplet/blob/b72b1ee/packages/purplet/src/lib/feature.ts#L160)

___

### MESSAGE\_UPDATE

• `Optional` **MESSAGE\_UPDATE**: [`EventHook`](../modules.md#eventhook)<`GatewayMessageUpdateDispatchData`, `void`\>

#### Defined in

[packages/purplet/src/lib/feature.ts:161](https://github.com/CRBT-Team/Purplet/blob/b72b1ee/packages/purplet/src/lib/feature.ts#L161)

___

### PRESENCE\_UPDATE

• `Optional` **PRESENCE\_UPDATE**: [`EventHook`](../modules.md#eventhook)<`GatewayPresenceUpdate`, `void`\>

#### Defined in

[packages/purplet/src/lib/feature.ts:162](https://github.com/CRBT-Team/Purplet/blob/b72b1ee/packages/purplet/src/lib/feature.ts#L162)

___

### STAGE\_INSTANCE\_CREATE

• `Optional` **STAGE\_INSTANCE\_CREATE**: [`EventHook`](../modules.md#eventhook)<`APIStageInstance`, `void`\>

#### Defined in

[packages/purplet/src/lib/feature.ts:163](https://github.com/CRBT-Team/Purplet/blob/b72b1ee/packages/purplet/src/lib/feature.ts#L163)

___

### STAGE\_INSTANCE\_DELETE

• `Optional` **STAGE\_INSTANCE\_DELETE**: [`EventHook`](../modules.md#eventhook)<`APIStageInstance`, `void`\>

#### Defined in

[packages/purplet/src/lib/feature.ts:164](https://github.com/CRBT-Team/Purplet/blob/b72b1ee/packages/purplet/src/lib/feature.ts#L164)

___

### STAGE\_INSTANCE\_UPDATE

• `Optional` **STAGE\_INSTANCE\_UPDATE**: [`EventHook`](../modules.md#eventhook)<`APIStageInstance`, `void`\>

#### Defined in

[packages/purplet/src/lib/feature.ts:165](https://github.com/CRBT-Team/Purplet/blob/b72b1ee/packages/purplet/src/lib/feature.ts#L165)

___

### THREAD\_CREATE

• `Optional` **THREAD\_CREATE**: [`EventHook`](../modules.md#eventhook)<`GatewayThreadCreateDispatchData`, `void`\>

#### Defined in

[packages/purplet/src/lib/feature.ts:166](https://github.com/CRBT-Team/Purplet/blob/b72b1ee/packages/purplet/src/lib/feature.ts#L166)

___

### THREAD\_DELETE

• `Optional` **THREAD\_DELETE**: [`EventHook`](../modules.md#eventhook)<`APIChannel`, `void`\>

#### Defined in

[packages/purplet/src/lib/feature.ts:167](https://github.com/CRBT-Team/Purplet/blob/b72b1ee/packages/purplet/src/lib/feature.ts#L167)

___

### THREAD\_LIST\_SYNC

• `Optional` **THREAD\_LIST\_SYNC**: [`EventHook`](../modules.md#eventhook)<`GatewayThreadListSync`, `void`\>

#### Defined in

[packages/purplet/src/lib/feature.ts:168](https://github.com/CRBT-Team/Purplet/blob/b72b1ee/packages/purplet/src/lib/feature.ts#L168)

___

### THREAD\_MEMBERS\_UPDATE

• `Optional` **THREAD\_MEMBERS\_UPDATE**: [`EventHook`](../modules.md#eventhook)<`GatewayThreadMembersUpdate`, `void`\>

#### Defined in

[packages/purplet/src/lib/feature.ts:169](https://github.com/CRBT-Team/Purplet/blob/b72b1ee/packages/purplet/src/lib/feature.ts#L169)

___

### THREAD\_MEMBER\_UPDATE

• `Optional` **THREAD\_MEMBER\_UPDATE**: [`EventHook`](../modules.md#eventhook)<`GatewayThreadMemberUpdateDispatchData`, `void`\>

#### Defined in

[packages/purplet/src/lib/feature.ts:170](https://github.com/CRBT-Team/Purplet/blob/b72b1ee/packages/purplet/src/lib/feature.ts#L170)

___

### THREAD\_UPDATE

• `Optional` **THREAD\_UPDATE**: [`EventHook`](../modules.md#eventhook)<`APIChannel`, `void`\>

#### Defined in

[packages/purplet/src/lib/feature.ts:171](https://github.com/CRBT-Team/Purplet/blob/b72b1ee/packages/purplet/src/lib/feature.ts#L171)

___

### TYPING\_START

• `Optional` **TYPING\_START**: [`EventHook`](../modules.md#eventhook)<`GatewayTypingStartDispatchData`, `void`\>

#### Defined in

[packages/purplet/src/lib/feature.ts:172](https://github.com/CRBT-Team/Purplet/blob/b72b1ee/packages/purplet/src/lib/feature.ts#L172)

___

### USER\_UPDATE

• `Optional` **USER\_UPDATE**: [`EventHook`](../modules.md#eventhook)<`APIUser`, `void`\>

#### Defined in

[packages/purplet/src/lib/feature.ts:173](https://github.com/CRBT-Team/Purplet/blob/b72b1ee/packages/purplet/src/lib/feature.ts#L173)

___

### VOICE\_SERVER\_UPDATE

• `Optional` **VOICE\_SERVER\_UPDATE**: [`EventHook`](../modules.md#eventhook)<`GatewayVoiceServerUpdateDispatchData`, `void`\>

#### Defined in

[packages/purplet/src/lib/feature.ts:174](https://github.com/CRBT-Team/Purplet/blob/b72b1ee/packages/purplet/src/lib/feature.ts#L174)

___

### VOICE\_STATE\_UPDATE

• `Optional` **VOICE\_STATE\_UPDATE**: [`EventHook`](../modules.md#eventhook)<`GatewayVoiceState`, `void`\>

#### Defined in

[packages/purplet/src/lib/feature.ts:175](https://github.com/CRBT-Team/Purplet/blob/b72b1ee/packages/purplet/src/lib/feature.ts#L175)

___

### WEBHOOKS\_UPDATE

• `Optional` **WEBHOOKS\_UPDATE**: [`EventHook`](../modules.md#eventhook)<`GatewayWebhooksUpdateDispatchData`, `void`\>

#### Defined in

[packages/purplet/src/lib/feature.ts:176](https://github.com/CRBT-Team/Purplet/blob/b72b1ee/packages/purplet/src/lib/feature.ts#L176)
