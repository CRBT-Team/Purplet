---
id: 'GatewayEventHook'
title: 'Interface: GatewayEventHook'
sidebar_label: 'GatewayEventHook'
sidebar_position: 0
custom_edit_url: null
---

## Properties

### CHANNEL_CREATE

• `Optional` **CHANNEL_CREATE**: [`EventHook`](../modules.md#eventhook)<`APIChannel`, `void`\>

#### Defined in

[packages/purplet/src/lib/feature.ts:130](https://github.com/CRBT-Team/Purplet/blob/b72b1ee/packages/purplet/src/lib/feature.ts#L130)

---

### CHANNEL_DELETE

• `Optional` **CHANNEL_DELETE**: [`EventHook`](../modules.md#eventhook)<`APIChannel`, `void`\>

#### Defined in

[packages/purplet/src/lib/feature.ts:131](https://github.com/CRBT-Team/Purplet/blob/b72b1ee/packages/purplet/src/lib/feature.ts#L131)

---

### CHANNEL_PINS_UPDATE

• `Optional` **CHANNEL_PINS_UPDATE**: [`EventHook`](../modules.md#eventhook)<`GatewayChannelPinsUpdateDispatchData`, `void`\>

#### Defined in

[packages/purplet/src/lib/feature.ts:132](https://github.com/CRBT-Team/Purplet/blob/b72b1ee/packages/purplet/src/lib/feature.ts#L132)

---

### CHANNEL_UPDATE

• `Optional` **CHANNEL_UPDATE**: [`EventHook`](../modules.md#eventhook)<`APIChannel`, `void`\>

#### Defined in

[packages/purplet/src/lib/feature.ts:133](https://github.com/CRBT-Team/Purplet/blob/b72b1ee/packages/purplet/src/lib/feature.ts#L133)

---

### GUILD_BAN_ADD

• `Optional` **GUILD_BAN_ADD**: [`EventHook`](../modules.md#eventhook)<`GatewayGuildBanModifyDispatchData`, `void`\>

#### Defined in

[packages/purplet/src/lib/feature.ts:134](https://github.com/CRBT-Team/Purplet/blob/b72b1ee/packages/purplet/src/lib/feature.ts#L134)

---

### GUILD_BAN_REMOVE

• `Optional` **GUILD_BAN_REMOVE**: [`EventHook`](../modules.md#eventhook)<`GatewayGuildBanModifyDispatchData`, `void`\>

#### Defined in

[packages/purplet/src/lib/feature.ts:135](https://github.com/CRBT-Team/Purplet/blob/b72b1ee/packages/purplet/src/lib/feature.ts#L135)

---

### GUILD_CREATE

• `Optional` **GUILD_CREATE**: [`EventHook`](../modules.md#eventhook)<`GatewayGuildCreateDispatchData`, `void`\>

#### Defined in

[packages/purplet/src/lib/feature.ts:136](https://github.com/CRBT-Team/Purplet/blob/b72b1ee/packages/purplet/src/lib/feature.ts#L136)

---

### GUILD_DELETE

• `Optional` **GUILD_DELETE**: [`EventHook`](../modules.md#eventhook)<`APIUnavailableGuild`, `void`\>

#### Defined in

[packages/purplet/src/lib/feature.ts:137](https://github.com/CRBT-Team/Purplet/blob/b72b1ee/packages/purplet/src/lib/feature.ts#L137)

---

### GUILD_EMOJIS_UPDATE

• `Optional` **GUILD_EMOJIS_UPDATE**: [`EventHook`](../modules.md#eventhook)<`GatewayGuildEmojisUpdateDispatchData`, `void`\>

#### Defined in

[packages/purplet/src/lib/feature.ts:138](https://github.com/CRBT-Team/Purplet/blob/b72b1ee/packages/purplet/src/lib/feature.ts#L138)

---

### GUILD_INTEGRATIONS_UPDATE

• `Optional` **GUILD_INTEGRATIONS_UPDATE**: [`EventHook`](../modules.md#eventhook)<`GatewayGuildIntegrationsUpdateDispatchData`, `void`\>

#### Defined in

[packages/purplet/src/lib/feature.ts:139](https://github.com/CRBT-Team/Purplet/blob/b72b1ee/packages/purplet/src/lib/feature.ts#L139)

---

### GUILD_MEMBERS_CHUNK

• `Optional` **GUILD_MEMBERS_CHUNK**: [`EventHook`](../modules.md#eventhook)<`GatewayGuildMembersChunkDispatchData`, `void`\>

#### Defined in

[packages/purplet/src/lib/feature.ts:142](https://github.com/CRBT-Team/Purplet/blob/b72b1ee/packages/purplet/src/lib/feature.ts#L142)

---

### GUILD_MEMBER_ADD

• `Optional` **GUILD_MEMBER_ADD**: [`EventHook`](../modules.md#eventhook)<`GatewayGuildMemberAddDispatchData`, `void`\>

#### Defined in

[packages/purplet/src/lib/feature.ts:140](https://github.com/CRBT-Team/Purplet/blob/b72b1ee/packages/purplet/src/lib/feature.ts#L140)

---

### GUILD_MEMBER_REMOVE

• `Optional` **GUILD_MEMBER_REMOVE**: [`EventHook`](../modules.md#eventhook)<`GatewayGuildMemberRemoveDispatchData`, `void`\>

#### Defined in

[packages/purplet/src/lib/feature.ts:141](https://github.com/CRBT-Team/Purplet/blob/b72b1ee/packages/purplet/src/lib/feature.ts#L141)

---

### GUILD_MEMBER_UPDATE

• `Optional` **GUILD_MEMBER_UPDATE**: [`EventHook`](../modules.md#eventhook)<`GatewayGuildMemberUpdateDispatchData`, `void`\>

#### Defined in

[packages/purplet/src/lib/feature.ts:143](https://github.com/CRBT-Team/Purplet/blob/b72b1ee/packages/purplet/src/lib/feature.ts#L143)

---

### GUILD_ROLE_CREATE

• `Optional` **GUILD_ROLE_CREATE**: [`EventHook`](../modules.md#eventhook)<`GatewayGuildRoleModifyDispatchData`, `void`\>

#### Defined in

[packages/purplet/src/lib/feature.ts:144](https://github.com/CRBT-Team/Purplet/blob/b72b1ee/packages/purplet/src/lib/feature.ts#L144)

---

### GUILD_ROLE_DELETE

• `Optional` **GUILD_ROLE_DELETE**: [`EventHook`](../modules.md#eventhook)<`GatewayGuildRoleDeleteDispatchData`, `void`\>

#### Defined in

[packages/purplet/src/lib/feature.ts:145](https://github.com/CRBT-Team/Purplet/blob/b72b1ee/packages/purplet/src/lib/feature.ts#L145)

---

### GUILD_ROLE_UPDATE

• `Optional` **GUILD_ROLE_UPDATE**: [`EventHook`](../modules.md#eventhook)<`GatewayGuildRoleModifyDispatchData`, `void`\>

#### Defined in

[packages/purplet/src/lib/feature.ts:146](https://github.com/CRBT-Team/Purplet/blob/b72b1ee/packages/purplet/src/lib/feature.ts#L146)

---

### GUILD_SCHEDULED_EVENT_CREATE

• `Optional` **GUILD_SCHEDULED_EVENT_CREATE**: [`EventHook`](../modules.md#eventhook)<`APIGuildScheduledEvent`, `void`\>

#### Defined in

[packages/purplet/src/lib/feature.ts:177](https://github.com/CRBT-Team/Purplet/blob/b72b1ee/packages/purplet/src/lib/feature.ts#L177)

---

### GUILD_SCHEDULED_EVENT_DELETE

• `Optional` **GUILD_SCHEDULED_EVENT_DELETE**: [`EventHook`](../modules.md#eventhook)<`APIGuildScheduledEvent`, `void`\>

#### Defined in

[packages/purplet/src/lib/feature.ts:179](https://github.com/CRBT-Team/Purplet/blob/b72b1ee/packages/purplet/src/lib/feature.ts#L179)

---

### GUILD_SCHEDULED_EVENT_UPDATE

• `Optional` **GUILD_SCHEDULED_EVENT_UPDATE**: [`EventHook`](../modules.md#eventhook)<`APIGuildScheduledEvent`, `void`\>

#### Defined in

[packages/purplet/src/lib/feature.ts:178](https://github.com/CRBT-Team/Purplet/blob/b72b1ee/packages/purplet/src/lib/feature.ts#L178)

---

### GUILD_SCHEDULED_EVENT_USER_ADD

• `Optional` **GUILD_SCHEDULED_EVENT_USER_ADD**: [`EventHook`](../modules.md#eventhook)<`GatewayGuildScheduledEventUserAddDispatchData`, `void`\>

#### Defined in

[packages/purplet/src/lib/feature.ts:180](https://github.com/CRBT-Team/Purplet/blob/b72b1ee/packages/purplet/src/lib/feature.ts#L180)

---

### GUILD_SCHEDULED_EVENT_USER_REMOVE

• `Optional` **GUILD_SCHEDULED_EVENT_USER_REMOVE**: [`EventHook`](../modules.md#eventhook)<`GatewayGuildScheduledEventUserRemoveDispatchData`, `void`\>

#### Defined in

[packages/purplet/src/lib/feature.ts:181](https://github.com/CRBT-Team/Purplet/blob/b72b1ee/packages/purplet/src/lib/feature.ts#L181)

---

### GUILD_STICKERS_UPDATE

• `Optional` **GUILD_STICKERS_UPDATE**: [`EventHook`](../modules.md#eventhook)<`GatewayGuildStickersUpdateDispatchData`, `void`\>

#### Defined in

[packages/purplet/src/lib/feature.ts:147](https://github.com/CRBT-Team/Purplet/blob/b72b1ee/packages/purplet/src/lib/feature.ts#L147)

---

### GUILD_UPDATE

• `Optional` **GUILD_UPDATE**: [`EventHook`](../modules.md#eventhook)<`APIGuild`, `void`\>

#### Defined in

[packages/purplet/src/lib/feature.ts:148](https://github.com/CRBT-Team/Purplet/blob/b72b1ee/packages/purplet/src/lib/feature.ts#L148)

---

### INTEGRATION_CREATE

• `Optional` **INTEGRATION_CREATE**: [`EventHook`](../modules.md#eventhook)<`GatewayIntegrationCreateDispatchData`, `void`\>

#### Defined in

[packages/purplet/src/lib/feature.ts:149](https://github.com/CRBT-Team/Purplet/blob/b72b1ee/packages/purplet/src/lib/feature.ts#L149)

---

### INTEGRATION_DELETE

• `Optional` **INTEGRATION_DELETE**: [`EventHook`](../modules.md#eventhook)<`GatewayIntegrationDeleteDispatchData`, `void`\>

#### Defined in

[packages/purplet/src/lib/feature.ts:150](https://github.com/CRBT-Team/Purplet/blob/b72b1ee/packages/purplet/src/lib/feature.ts#L150)

---

### INTEGRATION_UPDATE

• `Optional` **INTEGRATION_UPDATE**: [`EventHook`](../modules.md#eventhook)<`GatewayIntegrationUpdateDispatchData`, `void`\>

#### Defined in

[packages/purplet/src/lib/feature.ts:151](https://github.com/CRBT-Team/Purplet/blob/b72b1ee/packages/purplet/src/lib/feature.ts#L151)

---

### INVITE_CREATE

• `Optional` **INVITE_CREATE**: [`EventHook`](../modules.md#eventhook)<`GatewayInviteCreateDispatchData`, `void`\>

#### Defined in

[packages/purplet/src/lib/feature.ts:152](https://github.com/CRBT-Team/Purplet/blob/b72b1ee/packages/purplet/src/lib/feature.ts#L152)

---

### INVITE_DELETE

• `Optional` **INVITE_DELETE**: [`EventHook`](../modules.md#eventhook)<`GatewayInviteDeleteDispatchData`, `void`\>

#### Defined in

[packages/purplet/src/lib/feature.ts:153](https://github.com/CRBT-Team/Purplet/blob/b72b1ee/packages/purplet/src/lib/feature.ts#L153)

---

### MESSAGE_CREATE

• `Optional` **MESSAGE_CREATE**: [`EventHook`](../modules.md#eventhook)<`APIMessage`, `void`\>

#### Defined in

[packages/purplet/src/lib/feature.ts:154](https://github.com/CRBT-Team/Purplet/blob/b72b1ee/packages/purplet/src/lib/feature.ts#L154)

---

### MESSAGE_DELETE

• `Optional` **MESSAGE_DELETE**: [`EventHook`](../modules.md#eventhook)<`GatewayMessageDeleteDispatchData`, `void`\>

#### Defined in

[packages/purplet/src/lib/feature.ts:155](https://github.com/CRBT-Team/Purplet/blob/b72b1ee/packages/purplet/src/lib/feature.ts#L155)

---

### MESSAGE_DELETE_BULK

• `Optional` **MESSAGE_DELETE_BULK**: [`EventHook`](../modules.md#eventhook)<`GatewayMessageDeleteBulkDispatchData`, `void`\>

#### Defined in

[packages/purplet/src/lib/feature.ts:156](https://github.com/CRBT-Team/Purplet/blob/b72b1ee/packages/purplet/src/lib/feature.ts#L156)

---

### MESSAGE_REACTION_ADD

• `Optional` **MESSAGE_REACTION_ADD**: [`EventHook`](../modules.md#eventhook)<`Omit`<{ `channel_id`: `string` ; `emoji`: `APIEmoji` ; `guild_id?`: `string` ; `member?`: `APIGuildMember` ; `message_id`: `string` ; `user_id`: `string` }, `never`\>, `void`\>

#### Defined in

[packages/purplet/src/lib/feature.ts:157](https://github.com/CRBT-Team/Purplet/blob/b72b1ee/packages/purplet/src/lib/feature.ts#L157)

---

### MESSAGE_REACTION_REMOVE

• `Optional` **MESSAGE_REACTION_REMOVE**: [`EventHook`](../modules.md#eventhook)<`Omit`<{ `channel_id`: `string` ; `emoji`: `APIEmoji` ; `guild_id?`: `string` ; `member?`: `APIGuildMember` ; `message_id`: `string` ; `user_id`: `string` }, `"member"`\>, `void`\>

#### Defined in

[packages/purplet/src/lib/feature.ts:158](https://github.com/CRBT-Team/Purplet/blob/b72b1ee/packages/purplet/src/lib/feature.ts#L158)

---

### MESSAGE_REACTION_REMOVE_ALL

• `Optional` **MESSAGE_REACTION_REMOVE_ALL**: [`EventHook`](../modules.md#eventhook)<`MessageReactionRemoveData`, `void`\>

#### Defined in

[packages/purplet/src/lib/feature.ts:159](https://github.com/CRBT-Team/Purplet/blob/b72b1ee/packages/purplet/src/lib/feature.ts#L159)

---

### MESSAGE_REACTION_REMOVE_EMOJI

• `Optional` **MESSAGE_REACTION_REMOVE_EMOJI**: [`EventHook`](../modules.md#eventhook)<`GatewayMessageReactionRemoveEmojiDispatchData`, `void`\>

#### Defined in

[packages/purplet/src/lib/feature.ts:160](https://github.com/CRBT-Team/Purplet/blob/b72b1ee/packages/purplet/src/lib/feature.ts#L160)

---

### MESSAGE_UPDATE

• `Optional` **MESSAGE_UPDATE**: [`EventHook`](../modules.md#eventhook)<`GatewayMessageUpdateDispatchData`, `void`\>

#### Defined in

[packages/purplet/src/lib/feature.ts:161](https://github.com/CRBT-Team/Purplet/blob/b72b1ee/packages/purplet/src/lib/feature.ts#L161)

---

### PRESENCE_UPDATE

• `Optional` **PRESENCE_UPDATE**: [`EventHook`](../modules.md#eventhook)<`GatewayPresenceUpdate`, `void`\>

#### Defined in

[packages/purplet/src/lib/feature.ts:162](https://github.com/CRBT-Team/Purplet/blob/b72b1ee/packages/purplet/src/lib/feature.ts#L162)

---

### STAGE_INSTANCE_CREATE

• `Optional` **STAGE_INSTANCE_CREATE**: [`EventHook`](../modules.md#eventhook)<`APIStageInstance`, `void`\>

#### Defined in

[packages/purplet/src/lib/feature.ts:163](https://github.com/CRBT-Team/Purplet/blob/b72b1ee/packages/purplet/src/lib/feature.ts#L163)

---

### STAGE_INSTANCE_DELETE

• `Optional` **STAGE_INSTANCE_DELETE**: [`EventHook`](../modules.md#eventhook)<`APIStageInstance`, `void`\>

#### Defined in

[packages/purplet/src/lib/feature.ts:164](https://github.com/CRBT-Team/Purplet/blob/b72b1ee/packages/purplet/src/lib/feature.ts#L164)

---

### STAGE_INSTANCE_UPDATE

• `Optional` **STAGE_INSTANCE_UPDATE**: [`EventHook`](../modules.md#eventhook)<`APIStageInstance`, `void`\>

#### Defined in

[packages/purplet/src/lib/feature.ts:165](https://github.com/CRBT-Team/Purplet/blob/b72b1ee/packages/purplet/src/lib/feature.ts#L165)

---

### THREAD_CREATE

• `Optional` **THREAD_CREATE**: [`EventHook`](../modules.md#eventhook)<`GatewayThreadCreateDispatchData`, `void`\>

#### Defined in

[packages/purplet/src/lib/feature.ts:166](https://github.com/CRBT-Team/Purplet/blob/b72b1ee/packages/purplet/src/lib/feature.ts#L166)

---

### THREAD_DELETE

• `Optional` **THREAD_DELETE**: [`EventHook`](../modules.md#eventhook)<`APIChannel`, `void`\>

#### Defined in

[packages/purplet/src/lib/feature.ts:167](https://github.com/CRBT-Team/Purplet/blob/b72b1ee/packages/purplet/src/lib/feature.ts#L167)

---

### THREAD_LIST_SYNC

• `Optional` **THREAD_LIST_SYNC**: [`EventHook`](../modules.md#eventhook)<`GatewayThreadListSync`, `void`\>

#### Defined in

[packages/purplet/src/lib/feature.ts:168](https://github.com/CRBT-Team/Purplet/blob/b72b1ee/packages/purplet/src/lib/feature.ts#L168)

---

### THREAD_MEMBERS_UPDATE

• `Optional` **THREAD_MEMBERS_UPDATE**: [`EventHook`](../modules.md#eventhook)<`GatewayThreadMembersUpdate`, `void`\>

#### Defined in

[packages/purplet/src/lib/feature.ts:169](https://github.com/CRBT-Team/Purplet/blob/b72b1ee/packages/purplet/src/lib/feature.ts#L169)

---

### THREAD_MEMBER_UPDATE

• `Optional` **THREAD_MEMBER_UPDATE**: [`EventHook`](../modules.md#eventhook)<`GatewayThreadMemberUpdateDispatchData`, `void`\>

#### Defined in

[packages/purplet/src/lib/feature.ts:170](https://github.com/CRBT-Team/Purplet/blob/b72b1ee/packages/purplet/src/lib/feature.ts#L170)

---

### THREAD_UPDATE

• `Optional` **THREAD_UPDATE**: [`EventHook`](../modules.md#eventhook)<`APIChannel`, `void`\>

#### Defined in

[packages/purplet/src/lib/feature.ts:171](https://github.com/CRBT-Team/Purplet/blob/b72b1ee/packages/purplet/src/lib/feature.ts#L171)

---

### TYPING_START

• `Optional` **TYPING_START**: [`EventHook`](../modules.md#eventhook)<`GatewayTypingStartDispatchData`, `void`\>

#### Defined in

[packages/purplet/src/lib/feature.ts:172](https://github.com/CRBT-Team/Purplet/blob/b72b1ee/packages/purplet/src/lib/feature.ts#L172)

---

### USER_UPDATE

• `Optional` **USER_UPDATE**: [`EventHook`](../modules.md#eventhook)<`APIUser`, `void`\>

#### Defined in

[packages/purplet/src/lib/feature.ts:173](https://github.com/CRBT-Team/Purplet/blob/b72b1ee/packages/purplet/src/lib/feature.ts#L173)

---

### VOICE_SERVER_UPDATE

• `Optional` **VOICE_SERVER_UPDATE**: [`EventHook`](../modules.md#eventhook)<`GatewayVoiceServerUpdateDispatchData`, `void`\>

#### Defined in

[packages/purplet/src/lib/feature.ts:174](https://github.com/CRBT-Team/Purplet/blob/b72b1ee/packages/purplet/src/lib/feature.ts#L174)

---

### VOICE_STATE_UPDATE

• `Optional` **VOICE_STATE_UPDATE**: [`EventHook`](../modules.md#eventhook)<`GatewayVoiceState`, `void`\>

#### Defined in

[packages/purplet/src/lib/feature.ts:175](https://github.com/CRBT-Team/Purplet/blob/b72b1ee/packages/purplet/src/lib/feature.ts#L175)

---

### WEBHOOKS_UPDATE

• `Optional` **WEBHOOKS_UPDATE**: [`EventHook`](../modules.md#eventhook)<`GatewayWebhooksUpdateDispatchData`, `void`\>

#### Defined in

[packages/purplet/src/lib/feature.ts:176](https://github.com/CRBT-Team/Purplet/blob/b72b1ee/packages/purplet/src/lib/feature.ts#L176)
